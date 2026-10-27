"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { UiIcon } from "../Icon";

/** A photo for the browser-side widgets: `url` is already resolved (see lib/site/photo.ts). */
export type Pic = { url: string; alt: string; w?: number; h?: number };

/**
 * Full-screen photo viewer (a native <dialog>, so focus, Esc and the backdrop come for free).
 * index < 0 means closed. Arrow keys, the side buttons and a swipe move through the set.
 */
export function Lightbox({ pics, index, onIndex }: { pics: readonly Pic[]; index: number; onIndex: (i: number) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<Element | null>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const [loaded, setLoaded] = useState(false);
  const n = pics.length;
  const go = useCallback((d: number) => onIndex((((index + d) % n) + n) % n), [index, n, onIndex]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (index >= 0 && !d.open) {
      opener.current = document.activeElement;
      d.showModal();
    } else if (index < 0 && d.open) {
      d.close();
    }
  }, [index]);

  useEffect(() => setLoaded(false), [index]);

  useEffect(() => {
    if (index < 0) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [index, go]);

  const pic = index >= 0 ? pics[index] : null;
  const neighbours = index >= 0 && n > 1 ? [pics[(index + 1) % n], pics[(index - 1 + n) % n]] : [];

  return (
    <dialog
      ref={ref}
      className="pg-lb"
      aria-label={pic?.alt}
      onClose={() => {
        onIndex(-1);
        (opener.current as HTMLElement | null)?.focus?.();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
      onPointerDown={(e) => {
        swipe.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={(e) => {
        const s = swipe.current;
        swipe.current = null;
        if (!s || e.pointerType === "mouse") return;
        const dx = e.clientX - s.x;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - s.y)) go(dx < 0 ? 1 : -1);
      }}
    >
      {pic && (
        <>
          <figure className={`pg-lb-fig${loaded ? " is-loaded" : ""}`}>
            <Image
              key={pic.url}
              src={pic.url}
              alt={pic.alt}
              fill
              sizes="100vw"
              quality={75}
              onLoad={() => setLoaded(true)}
              style={{ objectFit: "contain" }}
            />
          </figure>
          {/* warm up the next and previous photos */}
          <div className="pg-lb-pre" aria-hidden="true">
            {neighbours.map((p) => (
              <Image key={p.url} src={p.url} alt="" fill sizes="100vw" loading="eager" />
            ))}
          </div>
          <p className="pg-lb-count" aria-live="polite">
            {index + 1} / {n}
          </p>
          <button type="button" className="pg-lb-btn pg-lb-x" aria-label="Close" onClick={() => ref.current?.close()} autoFocus>
            <UiIcon name="close" />
          </button>
          {n > 1 && (
            <>
              <button type="button" className="pg-lb-btn pg-lb-prev" aria-label="Previous photo" onClick={() => go(-1)}>
                <UiIcon name="chev-l" />
              </button>
              <button type="button" className="pg-lb-btn pg-lb-next" aria-label="Next photo" onClick={() => go(1)}>
                <UiIcon name="chev-r" />
              </button>
            </>
          )}
        </>
      )}
    </dialog>
  );
}
