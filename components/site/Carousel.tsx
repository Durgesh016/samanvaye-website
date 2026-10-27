"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { UiIcon } from "../Icon";
import { Lightbox, type Pic } from "./Lightbox";

/**
 * Photo carousel for the clinic opening: the photos cross-fade with a slow zoom, the thumbnails sit on a
 * tilted 3D strip below, and the big photo opens full size. Plays by itself, pauses on hover and focus.
 */
export function Carousel({ pics, label }: { pics: readonly Pic[]; label: string }) {
  const n = pics.length;
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(-1);
  /* the slides sit on top of each other, so lazy loading cannot hold them back: only the current and next
     photos are loaded, and a slide keeps its photo once shown */
  const [shown, setShown] = useState(() => new Set([0, 1]));
  const pause = useRef(false);
  const go = (d: number) => setI((k) => (((k + d) % n) + n) % n);

  useEffect(() => {
    setShown((s) => (s.has(i) && s.has((i + 1) % n) ? s : new Set([...s, i, (i + 1) % n])));
  }, [i, n]);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      if (!pause.current && document.visibilityState === "visible") setI((k) => (k + 1) % n);
    }, 5200);
    return () => clearInterval(t);
  }, [n]);

  return (
    <div
      className="pg-car"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onPointerEnter={() => (pause.current = true)}
      onPointerLeave={() => (pause.current = false)}
      onFocus={() => (pause.current = true)}
      onBlur={() => (pause.current = false)}
    >
      <div className="pg-car-stage">
        {pics.map((p, k) => (
          <button
            key={p.url}
            type="button"
            className={`pg-car-slide${k === i ? " is-on" : ""}`}
            aria-hidden={k !== i}
            tabIndex={k === i ? 0 : -1}
            aria-label={p.alt}
            onClick={() => setOpen(k)}
          >
            {shown.has(k) && (
              <Image
                src={p.url}
                alt={p.alt}
                fill
                sizes="(max-width: 1180px) 94vw, 1100px"
                preload={k === 0}
                fetchPriority={k === 0 ? "high" : undefined}
              />
            )}
          </button>
        ))}
        <button type="button" className="pg-round-btn pg-car-prev" aria-label="Previous photo" onClick={() => go(-1)}>
          <UiIcon name="chev-l" />
        </button>
        <button type="button" className="pg-round-btn pg-car-next" aria-label="Next photo" onClick={() => go(1)}>
          <UiIcon name="chev-r" />
        </button>
        <span className="pg-car-count" aria-hidden="true">
          {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </span>
      </div>
      <ul className="pg-car-thumbs">
        {pics.map((p, k) => (
          <li key={p.url}>
            <button type="button" className={`pg-car-th${k === i ? " is-on" : ""}`} aria-label={p.alt} aria-current={k === i ? "true" : undefined} onClick={() => setI(k)}>
              <Image src={p.url} alt={p.alt} fill sizes="(max-width: 760px) 110px, 160px" />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox pics={pics} index={open} onIndex={setOpen} />
    </div>
  );
}
