"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Star } from "../Icon";

export type Member = { name: string; role: string; url: string };

/**
 * 3D cover-flow of the Organizing Council: the centre portrait faces you, the others turn away on either
 * side. ‹ › (the live site's own buttons), a swipe, the arrow keys or a click on a side portrait bring the
 * next one forward. Moves on by itself every few seconds, except while hovered or focused.
 */
export function Coverflow({ members, prev = "‹", next = "›", label }: { members: readonly Member[]; prev?: string; next?: string; label: string }) {
  const n = members.length;
  const [i, setI] = useState(0);
  const pause = useRef(false);
  const swipe = useRef<number | null>(null);
  const go = (d: number) => setI((k) => (((k + d) % n) + n) % n);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      if (!pause.current && document.visibilityState === "visible") setI((k) => (k + 1) % n);
    }, 4200);
    return () => clearInterval(t);
  }, [n]);

  return (
    <div
      className="pg-cf"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onPointerEnter={() => (pause.current = true)}
      onPointerLeave={() => (pause.current = false)}
      onFocus={() => (pause.current = true)}
      onBlur={() => (pause.current = false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      onPointerDown={(e) => {
        swipe.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (swipe.current === null) return;
        const dx = e.clientX - swipe.current;
        swipe.current = null;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      }}
    >
      <ul className="pg-cf-track">
        {members.map((m, k) => {
          let d = k - i;
          if (d > n / 2) d -= n;
          if (d < -n / 2) d += n;
          const ad = Math.abs(d);
          return (
            <li
              key={m.name}
              className={`pg-cf-i${d === 0 ? " is-on" : ""}`}
              style={{ "--d": d, "--ad": ad } as CSSProperties}
              aria-hidden={ad > 2 ? true : undefined}
            >
              <button type="button" className="pg-cf-card" tabIndex={ad > 2 ? -1 : 0} aria-label={`${m.name}, ${m.role}`} onClick={() => setI(k)}>
                <span className="pg-cf-ph ph">
                  <Image src={m.url} alt="" fill sizes="(max-width: 760px) 62vw, 300px" style={{ objectPosition: "50% 18%" }} />
                </span>
                <span className="pg-cf-cap">
                  <span className="pg-cf-name">{m.name}</span>
                  <span className="pg-cf-role">{m.role}</span>
                </span>
                <span className="cn-spark" aria-hidden="true">
                  <Star className="cn-spark-s" />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="pg-cf-ctl">
        <button type="button" className="pg-round-btn pg-cf-btn" aria-label="Previous" onClick={() => go(-1)}>
          {prev}
        </button>
        <span className="pg-cf-dots" aria-hidden="true">
          {members.map((m, k) => (
            <i key={m.name} className={k === i ? "on" : undefined} />
          ))}
        </span>
        <button type="button" className="pg-round-btn pg-cf-btn" aria-label="Next" onClick={() => go(1)}>
          {next}
        </button>
      </div>
    </div>
  );
}
