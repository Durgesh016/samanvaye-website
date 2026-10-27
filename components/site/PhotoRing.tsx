"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Star, UiIcon } from "../Icon";
import { Lightbox, type Pic } from "./Lightbox";

/**
 * A 3D ring of photos (CSS 3D, no WebGL): it turns slowly, follows a drag or swipe with momentum,
 * and the photo at the front opens full size. The side buttons turn it one photo at a time, and
 * keyboard focus brings a photo to the front. Pauses when off screen, on hover, and with "reduce motion".
 */
export function PhotoRing({ pics, label }: { pics: readonly Pic[]; label: string }) {
  const n = pics.length;
  const step = 360 / n;
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(-1);
  const s = useRef({ a: 0, target: null as number | null, vel: 0, drag: false, moved: 0, lastX: 0, hover: false, seen: false });

  useEffect(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage || !track) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = Array.from(track.children) as HTMLElement[];
    let raf = 0;
    let prev = 0;
    const st = s.current;

    const paint = () => {
      track.style.setProperty("--a", `${st.a.toFixed(2)}deg`);
      items.forEach((it, i) => {
        const rel = (((i * step + st.a) % 360) + 540) % 360 - 180; /* -180..180, 0 = front */
        const f = Math.cos((rel * Math.PI) / 180); /* 1 front … -1 back */
        it.style.setProperty("--f", Math.max(0, f).toFixed(3));
        it.classList.toggle("is-front", Math.abs(rel) < step / 2);
      });
    };
    const frame = (t: number) => {
      const dt = Math.min(50, t - (prev || t)) / 1000;
      prev = t;
      if (!st.drag) {
        if (st.target !== null) {
          st.a += (st.target - st.a) * Math.min(1, dt * 7);
          if (Math.abs(st.target - st.a) < 0.05) {
            st.a = st.target;
            st.target = null;
          }
        } else if (Math.abs(st.vel) > 0.5) {
          st.a += st.vel * dt;
          st.vel *= Math.pow(0.04, dt);
        } else if (!st.hover && !reduced) {
          st.a -= 7 * dt; /* degrees per second */
        }
      }
      paint();
      raf = st.seen ? requestAnimationFrame(frame) : 0;
    };
    const io = new IntersectionObserver(([en]) => {
      st.seen = en.isIntersecting;
      if (st.seen && !raf) {
        prev = 0;
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(stage);
    paint();
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [n, step]);

  /* turn so photo i faces front, the short way round */
  const face = (i: number) => {
    const st = s.current;
    let target = -i * step;
    target += Math.round((st.a - target) / 360) * 360;
    st.vel = 0;
    st.target = target;
  };
  const front = () => {
    const a = s.current.target ?? s.current.a;
    return ((Math.round(-a / step) % n) + n) % n;
  };

  return (
    <div className="pg-ring" role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={stageRef}
        className="pg-ring-stage"
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") s.current.hover = true;
        }}
        onPointerLeave={() => {
          s.current.hover = false;
        }}
        onPointerDown={(e) => {
          const st = s.current;
          st.drag = true;
          st.moved = 0;
          st.lastX = e.clientX;
          st.vel = 0;
          st.target = null;
        }}
        onPointerMove={(e) => {
          const st = s.current;
          if (!st.drag) return;
          const dx = e.clientX - st.lastX;
          st.lastX = e.clientX;
          st.moved += Math.abs(dx);
          if (st.moved > 6 && !(e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          }
          st.a += dx * 0.22;
          st.vel = dx * 0.22 * 60;
        }}
        onPointerUp={() => {
          s.current.drag = false;
        }}
        onPointerCancel={() => {
          s.current.drag = false;
        }}
      >
        <div ref={trackRef} className="pg-ring-track" style={{ "--n": n } as CSSProperties}>
          {pics.map((p, i) => (
            <button
              key={p.url}
              type="button"
              className="pg-ring-i"
              style={{ "--i": i } as CSSProperties}
              aria-label={p.alt}
              onFocus={() => face(i)}
              onClick={() => {
                if (s.current.moved > 6) return; /* that was a drag, not a click */
                setOpen(i);
              }}
            >
              <span className="pg-ring-ph">
                <Image src={p.url} alt={p.alt} fill sizes="(max-width: 760px) 170px, 280px" draggable={false} />
              </span>
              <span className="pg-ring-zoom" aria-hidden="true">
                <UiIcon name="zoom" />
              </span>
            </button>
          ))}
        </div>
        <span className="pg-ring-floor" aria-hidden="true"></span>
      </div>
      <div className="pg-ring-ctl">
        <button type="button" className="pg-round-btn" aria-label="Previous photo" onClick={() => face((front() - 1 + n) % n)}>
          <UiIcon name="chev-l" />
        </button>
        <span className="pg-ring-hint" aria-hidden="true">
          <Star className="pg-ring-star" />
          <UiIcon name="drag" />
          <Star className="pg-ring-star" />
        </span>
        <button type="button" className="pg-round-btn" aria-label="Next photo" onClick={() => face((front() + 1) % n)}>
          <UiIcon name="chev-r" />
        </button>
      </div>
      <Lightbox pics={pics} index={open} onIndex={setOpen} />
    </div>
  );
}
