import { getImageProps } from "next/image";
import { content } from "@/lib/content";
import { images, type ImageKey } from "@/lib/images";
import { Star, UiIcon } from "../Icon";

/* An SVG <image> has no srcset: the still art's photos come from the image optimizer at twice their drawn size. */
const artPhoto = (k: ImageKey, w: number, h: number) => getImageProps({ src: images[k].src, alt: "", width: w, height: h }).props.src;

/**
 * The hero. The 3D constellation is mounted into the [data-stage] element in the browser
 * (see components/SiteEffects.tsx). Until then, and if WebGL is unavailable, the SVG "still art"
 * below shows the same constellation as a flat picture, so the hero is complete without 3D.
 */
export function Hero() {
  const h = content.hero;
  const cut = h.title.indexOf(". ");
  const [first, second] = [h.title.slice(0, cut + 1), h.title.slice(cut + 2)];
  const art = [
    { k: "hero1", x: 140, y: 188, w: 220, h: 124, clip: "cn-c1" },
    { k: "who1", x: 1100, y: 220, w: 180, h: 120, clip: "cn-c2" },
    { k: "edu", x: 250, y: 560, w: 160, h: 100, clip: "cn-c3" },
    { k: "g_tailor", x: 1018, y: 558, w: 184, h: 104, clip: "cn-c4" },
    { k: "g_vayo", x: 62, y: 390, w: 174, h: 80, clip: "cn-c5" },
    { k: "why", x: 1260, y: 410, w: 142, h: 80, clip: "cn-c6" },
  ] as const;

  return (
    <section className="cn-hero" aria-labelledby="cn-title">
      <div className="cn-stage stage" data-stage aria-hidden="true">
        <div className="stage-art cn-art">
          <svg className="cn-art-svg" viewBox="0 0 1440 820" preserveAspectRatio="xMidYMid slice" focusable="false">
            <defs>
              <clipPath id="cn-c1"><circle cx="250" cy="250" r="62" /></clipPath>
              <clipPath id="cn-c2"><circle cx="1190" cy="280" r="60" /></clipPath>
              <clipPath id="cn-c3"><circle cx="330" cy="610" r="50" /></clipPath>
              <clipPath id="cn-c4"><circle cx="1110" cy="610" r="52" /></clipPath>
              <clipPath id="cn-c5"><circle cx="120" cy="430" r="40" /></clipPath>
              <clipPath id="cn-c6"><circle cx="1320" cy="450" r="40" /></clipPath>
            </defs>
            <g fill="none" stroke="#F3C969" strokeOpacity=".35" strokeWidth="1">
              <path d="M120 430 250 250 330 610 120 430M250 250 520 90 900 80 1190 280 1320 450 1110 610 1190 280M330 610 560 760 880 770 1110 610" />
            </g>
            <g fill="#F3C969">
              <circle cx="520" cy="90" r="3" />
              <circle cx="900" cy="80" r="2.4" />
              <circle cx="560" cy="760" r="2.4" />
              <circle cx="880" cy="770" r="3" />
            </g>
            <g fill="none" stroke="#F3C969" strokeWidth="2">
              <circle cx="250" cy="250" r="64" />
              <circle cx="1190" cy="280" r="62" />
              <circle cx="330" cy="610" r="52" />
              <circle cx="1110" cy="610" r="54" />
              <circle cx="120" cy="430" r="42" />
              <circle cx="1320" cy="450" r="42" />
            </g>
            {art.map((a) => (
              <image
                key={a.k}
                href={artPhoto(a.k, a.w, a.h)}
                x={a.x}
                y={a.y}
                width={a.w}
                height={a.h}
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#${a.clip})`}
              />
            ))}
          </svg>
        </div>
      </div>

      <div className="cn-hero-copy">
        <p className="cn-eyebrow">
          <Star />
          <span>{h.eyebrow}</span>
        </p>
        <h1 className="cn-h1" id="cn-title">
          <span>{first}</span> <span className="cn-h1-b">{second}</span>
        </h1>
        <p className="cn-lede">{h.text}</p>
        <a className="cn-btn cn-btn-lg" href={h.href}>
          <span>{h.cta}</span>
          <UiIcon name="arrow-r" />
        </a>
      </div>
    </section>
  );
}

/** A thin constellation line between sections; it draws itself as you scroll (data-fx="draw"). */
export function ConstellationLink({ variant = 0 }: { variant?: 0 | 1 }) {
  return (
    <div className="cn-link" aria-hidden="true">
      <svg viewBox="0 0 240 150" data-fx="draw" data-from=".1" data-to=".6" focusable="false">
        {variant === 0 ? (
          <>
            <path data-draw="" d="M120 0 96 50 146 96 120 150" />
            <circle className="cn-dot" cx="96" cy="50" r="2.4" />
            <circle className="cn-dot cn-dot-b" cx="146" cy="96" r="3.2" />
          </>
        ) : (
          <>
            <path data-draw="" d="M120 0 150 44 98 104 120 150" />
            <circle className="cn-dot cn-dot-b" cx="150" cy="44" r="3.2" />
            <circle className="cn-dot" cx="98" cy="104" r="2.4" />
          </>
        )}
      </svg>
    </div>
  );
}
