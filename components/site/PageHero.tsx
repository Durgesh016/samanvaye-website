import type { CSSProperties, ReactNode } from "react";
import { Star } from "../Icon";
import { Photo, type PicRef } from "../Photo";
import { DepthField } from "./DepthField";

type HeroProps = {
  /** small line above the title, e.g. "Gallery" */
  eyebrow?: string;
  /** the page title; pass several strings to break it over lines exactly where the live site does */
  title: string | readonly string[];
  /** line under the title */
  sub?: string;
  /** ["Home", "About"]: the first links to the homepage */
  crumbs?: readonly string[];
  /** 1–3 photos for the constellation beside the title: the first is the big one */
  pics: readonly PicRef[];
  /** smaller title type, for long blog post titles */
  long?: boolean;
  /** CSS object-position for the big photo */
  focus?: string;
  /** the big photo is the page's main image and loads first; off on blog posts, whose featured photo is */
  preload?: boolean;
  /** extra row under the title (blog post details) */
  children?: ReactNode;
};

/**
 * The top of every inner page: title and breadcrumb on the left, and on the right the page's photos as a
 * small constellation: round photos with a gold ring, joined by lines, that drift in 3D with the pointer.
 */
export function PageHero({ eyebrow, title, sub, crumbs, pics, long = false, focus, preload = true, children }: HeroProps) {
  const lines = typeof title === "string" ? [title] : title;
  const [main, a, b] = pics;
  return (
    <section className={`pg-hero${long ? " pg-hero-long" : ""}`} aria-labelledby="pg-title">
      <div className="pg-hero-in">
        <div className="pg-hero-copy">
          {eyebrow && (
            <p className="cn-eyebrow">
              <Star />
              <span>{eyebrow}</span>
            </p>
          )}
          <h1 className="pg-h1" id="pg-title">
            {lines.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </h1>
          {sub && <p className="cn-lede pg-hero-sub">{sub}</p>}
          {children}
          {crumbs && crumbs.length > 1 && (
            <nav className="pg-crumbs" aria-label="Breadcrumb">
              <a href="/">{crumbs[0]}</a>
              <span className="pg-crumb-sep" aria-hidden="true">
                /
              </span>
              <span aria-current="page">{crumbs[crumbs.length - 1]}</span>
            </nav>
          )}
        </div>

        <DepthField className="pg-cluster">
          <svg className="pg-cluster-lines" viewBox="0 0 520 460" preserveAspectRatio="none" focusable="false">
            <path d="M118 96 300 214 92 372M300 214 470 60M300 214 486 396 330 446" />
            <circle className="pg-cl-dot" cx="470" cy="60" r="3" />
            <circle className="pg-cl-dot pg-cl-dot-b" cx="486" cy="396" r="3.4" />
            <circle className="pg-cl-dot" cx="330" cy="446" r="2.4" />
          </svg>
          {main && (
            <div className="pg-orb pg-orb-main" style={{ "--d": 1 } as CSSProperties}>
              <div className="pg-orb-in">
                <Photo k={main} alt="" preload={preload} sizes="(max-width: 760px) 70vw, 360px" focus={focus} />
              </div>
            </div>
          )}
          {a && (
            <div className="pg-orb pg-orb-a" style={{ "--d": 2.2 } as CSSProperties}>
              <div className="pg-orb-in">
                <Photo k={a} alt="" sizes="180px" />
              </div>
            </div>
          )}
          {b && (
            <div className="pg-orb pg-orb-b" style={{ "--d": 1.6 } as CSSProperties}>
              <div className="pg-orb-in">
                <Photo k={b} alt="" sizes="150px" />
              </div>
            </div>
          )}
          <span className="pg-spark pg-spark-1" style={{ "--d": 2.8 } as CSSProperties}>
            <Star className="cn-spark-s" />
          </span>
          <span className="pg-spark pg-spark-2" style={{ "--d": 0.6 } as CSSProperties}>
            <Star className="cn-spark-s" />
          </span>
          <span className="pg-spark pg-spark-3" style={{ "--d": 1.9 } as CSSProperties}>
            <Star className="cn-spark-s" />
          </span>
        </DepthField>
      </div>
    </section>
  );
}
