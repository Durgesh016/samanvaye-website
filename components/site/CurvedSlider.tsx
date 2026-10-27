"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { UiIcon } from "../Icon";

export type SlideCard = { href: string; url: string; title: string; day: string; mon: string; cta: string };

/**
 * "Latest news and articles": a swipeable row of post cards bent round a curve in 3D. Each card turns
 * towards you as it reaches the middle (computed from its scroll position), so scrolling feels like
 * turning a drum. The arrow buttons move one card; the row is an ordinary scroller, so touch, trackpad
 * and keyboard all work.
 */
export function CurvedSlider({ cards, label }: { cards: readonly SlideCard[]; label: string }) {
  const track = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const items = Array.from(el.children) as HTMLElement[];
    let raf = 0;
    const paint = () => {
      raf = 0;
      const box = el.getBoundingClientRect();
      const mid = box.left + box.width / 2;
      items.forEach((it) => {
        const r = it.getBoundingClientRect();
        const o = Math.max(-2.2, Math.min(2.2, (r.left + r.width / 2 - mid) / (r.width + 24)));
        it.style.setProperty("--o", o.toFixed(3));
        it.style.setProperty("--ao", Math.abs(o).toFixed(3));
      });
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const first = items[0];
    if (first && items.length > 2) el.scrollLeft = first.offsetWidth + 24;
    paint();
    el.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    return () => {
      el.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      cancelAnimationFrame(raf);
    };
  }, []);

  const move = (d: number) => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: d * (card.offsetWidth + 24), behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div className="pg-cs" role="region" aria-label={label}>
      <ul ref={track} className="pg-cs-track">
        {cards.map((c) => (
          <li key={c.href} className="pg-cs-i" style={{ "--o": 0, "--ao": 0 } as CSSProperties}>
            <article className="cn-card cn-post pg-cs-card cn-host">
              <a className="cn-post-ph" href={c.href} tabIndex={-1} aria-hidden="true">
                <span className="ph" style={{ "--ph": "#1B2560" } as CSSProperties}>
                  <Image src={c.url} alt="" fill sizes="(max-width: 760px) 78vw, 340px" />
                </span>
              </a>
              <span className="bd cn-bd">
                <span className="bd-d">{c.day}</span> <span className="bd-m">{c.mon}</span>
              </span>
              <h3 className="cn-h5">
                <a href={c.href}>{c.title}</a>
              </h3>
              <a className="cn-more" href={c.href}>
                <span>{c.cta}</span>
                <UiIcon name="arrow-r" />
                <span className="vh"> {c.title}</span>
              </a>
            </article>
          </li>
        ))}
      </ul>
      <div className="pg-cs-ctl">
        <button type="button" className="pg-round-btn" aria-label="Previous" onClick={() => move(-1)}>
          <UiIcon name="chev-l" />
        </button>
        <button type="button" className="pg-round-btn" aria-label="Next" onClick={() => move(1)}>
          <UiIcon name="chev-r" />
        </button>
      </div>
    </div>
  );
}
