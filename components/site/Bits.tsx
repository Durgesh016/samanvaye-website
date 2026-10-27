import type { ReactNode } from "react";
import { content } from "@/lib/content";
import type { Post } from "@/lib/site/data";
import { photoUrl } from "@/lib/site/photo";
import { Star, UiIcon } from "../Icon";
import { Photo } from "../Photo";
import { SocialLinks } from "../sections/SiteHeader";
import type { SlideCard } from "./CurvedSlider";

/** Eyebrow + heading, centred, as on the homepage sections. */
export function SectionHead({
  eyebrow,
  title,
  id,
  level = 2,
  children,
}: {
  eyebrow?: string;
  title: string;
  id: string;
  level?: 2 | 3;
  children?: ReactNode;
}) {
  const H = level === 2 ? "h2" : "h3";
  return (
    <div className="cn-head">
      {eyebrow && (
        <p className="cn-eyebrow">
          <Star />
          <span>{eyebrow}</span>
        </p>
      )}
      <H className="cn-h2" id={id}>
        {title}
      </H>
      {children}
    </div>
  );
}

/** "Follow us" with the foundation's social links (the live site points Facebook at Instagram; kept). */
export function FollowUs({ title, className = "" }: { title: string; className?: string }) {
  return (
    <div className={`pg-follow ${className}`.trim()}>
      <h3 className="cn-h4">{title}</h3>
      <SocialLinks className="cn-social" items={content.topbar.social} />
    </div>
  );
}

/**
 * A Google map (same map address as the live page), added as it scrolls near (data-fx="map" in
 * lib/samanvaye/runtime.js). The browser's own lazy loading starts a map far too early, and a map is heavy.
 */
export function MapFrame({ src, title }: { src: string; title: string }) {
  return (
    <div className="pg-map" data-fx="map" data-src={src} data-title={title}>
      <noscript>
        <iframe src={src} title={title} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      </noscript>
    </div>
  );
}

/** Post card for the Blogs page: photo, title, Read More (as on samanvaye.org/blogs). */
export function PostCard({ post, cta }: { post: Post; cta: string }) {
  const href = `/${post.slug}`;
  return (
    <article className="cn-card cn-post pg-post cn-host">
      <a className="cn-post-ph" href={href} tabIndex={-1} aria-hidden="true">
        <Photo k={post.featured} alt="" sizes="(max-width: 760px) 92vw, 380px" />
      </a>
      <h2 className="cn-h5">
        <a href={href}>{post.title}</a>
      </h2>
      <a className="cn-more" href={href}>
        <span>{cta}</span>
        <UiIcon name="arrow-r" />
        <span className="vh"> {post.title}</span>
      </a>
    </article>
  );
}

/** The cards for the "Latest news and articles" slider (photo URLs resolved here, on the server). */
export function slideCards(posts: readonly Post[]): SlideCard[] {
  return posts.map((p) => ({
    href: `/${p.slug}`,
    url: photoUrl(p.card.src),
    title: p.title,
    day: p.day,
    mon: p.mon,
    cta: p.card.cta,
  }));
}

/** Blog post text: paragraphs, headings, lists, photos and plain links, in the order of the live post. */
export function PostBody({ blocks }: { blocks: Post["blocks"] }) {
  /* headings under the page title start at h2: a post written with h3s only keeps their look, as h2 */
  const H3 = blocks.some((b) => b.type === "h2") ? "h3" : "h2";
  return (
    <div className="pg-prose">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return <p key={i}>{b.text}</p>;
          case "h2":
            return <h2 key={i}>{b.text}</h2>;
          case "h3":
            return (
              <H3 key={i} className="pg-h3">
                {b.text}
              </H3>
            );
          case "ul":
            return (
              <ul key={i}>
                {b.items.map((t) => (
                  <li key={t}>
                    <Star className="cn-bul-s" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            );
          case "links":
            return (
              <p key={i} className="pg-links">
                {b.items.map((u) => (
                  <a key={u} href={u} target="_blank" rel="noopener noreferrer">
                    {u}
                  </a>
                ))}
              </p>
            );
          case "img":
            return (
              <div
                key={i}
                className="pg-prose-fig"
                style={{ aspectRatio: `${b.w} / ${b.h}` }}
                data-fx="tilt"
                data-tilt="5"
              >
                <Photo k={b} className="pg-prose-ph" sizes="(max-width: 760px) 92vw, 520px" />
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
