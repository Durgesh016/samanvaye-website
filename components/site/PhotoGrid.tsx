"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { Star, UiIcon } from "../Icon";
import { Lightbox, type Pic } from "./Lightbox";

/**
 * A wall of photos in justified rows: every photo keeps its own shape and each row fills the width
 * (a photo's share of the row follows its aspect ratio, --ar). Hover lifts a photo with the gold twinkle;
 * click opens the full-size viewer for the whole album.
 */
export function PhotoGrid({ pics, dense = false }: { pics: readonly Pic[]; dense?: boolean }) {
  const [open, setOpen] = useState(-1);
  return (
    <>
      <ul className={`pg-grid${dense ? " pg-grid-dense" : ""}`}>
        {pics.map((p, i) => (
          <li key={p.url} style={{ "--ar": p.w && p.h ? +(p.w / p.h).toFixed(4) : 1.3333 } as CSSProperties}>
            <button type="button" className="pg-grid-i cn-host" aria-label={p.alt} onClick={() => setOpen(i)}>
              <span className="cn-tw pg-grid-tw">
                <span className="ph">
                  <Image src={p.url} alt={p.alt} fill sizes="(max-width: 760px) 50vw, 380px" />
                </span>
                <span className="cn-spark" aria-hidden="true">
                  <Star className="cn-spark-s" />
                </span>
              </span>
              <span className="pg-grid-zoom" aria-hidden="true">
                <UiIcon name="zoom" />
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Lightbox pics={pics} index={open} onIndex={setOpen} />
    </>
  );
}
