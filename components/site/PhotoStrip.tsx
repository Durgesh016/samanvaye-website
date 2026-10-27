"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { Star } from "../Icon";
import { Lightbox, type Pic } from "./Lightbox";

/**
 * "Social Media Posts": the photos drift past on a film strip tilted in 3D space. Hovering pauses it and
 * lifts the photo under the pointer; click opens the photo full size. The strip is drawn twice for a
 * seamless loop (the copy is hidden from screen readers and the keyboard).
 */
export function PhotoStrip({ pics }: { pics: readonly Pic[] }) {
  const [open, setOpen] = useState(-1);
  const row = (copy: boolean) =>
    pics.map((p, i) => (
      <li key={`${copy ? "c" : "o"}${p.url}`} className="pg-strip-i" style={{ "--k": i } as CSSProperties} aria-hidden={copy || undefined}>
        <button type="button" className="pg-strip-btn cn-host" tabIndex={copy ? -1 : 0} aria-label={p.alt} onClick={() => setOpen(i)}>
          <span className="cn-tw pg-strip-tw">
            <span className="ph">
              <Image src={p.url} alt={copy ? "" : p.alt} fill sizes="(max-width: 760px) 60vw, 300px" />
            </span>
            <span className="cn-spark" aria-hidden="true">
              <Star className="cn-spark-s" />
            </span>
          </span>
        </button>
      </li>
    ));
  return (
    <div className="pg-strip">
      <div className="pg-strip-plane">
        <ul className="pg-strip-track">
          {row(false)}
          {row(true)}
        </ul>
      </div>
      <Lightbox pics={pics} index={open} onIndex={setOpen} />
    </div>
  );
}
