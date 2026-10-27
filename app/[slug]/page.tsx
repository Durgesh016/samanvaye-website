import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ConstellationLink } from "@/components/sections/Hero";
import { PostBody, SectionHead, slideCards } from "@/components/site/Bits";
import { CurvedSlider } from "@/components/site/CurvedSlider";
import { PageHero } from "@/components/site/PageHero";
import { UiIcon } from "@/components/Icon";
import { Photo } from "@/components/Photo";
import { pageMeta, postJsonLd, publishedAt } from "@/lib/seo";
import { posts } from "@/lib/site/data";

/* Blog posts keep their samanvaye.org addresses: /social-welfare-programs, /supporting-orphanage-children, … */
export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

const find = (slug: string) => posts.find((p) => p.slug === slug);

/* The post's first real paragraph describes it in search results (a short dateline or subtitle is skipped). */
function summary(post: (typeof posts)[number]) {
  const paras = post.blocks.flatMap((b) => (b.type === "p" && "text" in b ? [b.text] : []));
  return paras.find((t) => t.length >= 60) ?? paras[0] ?? post.title;
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const post = find((await params).slug);
  if (!post) return {};
  return pageMeta({
    title: post.title,
    description: summary(post),
    path: `/${post.slug}`,
    image: post.featured,
    published: publishedAt(post.iso, post.time),
  });
}

/** A blog post: title and details in the hero, the post itself, share links, then the latest posts. */
export default async function PostPage({ params }: PageProps<"/[slug]">) {
  const post = find((await params).slug);
  if (!post) notFound();
  return (
    <>
      <PageHero title={post.title} crumbs={post.crumbs} pics={[post.featured, { src: post.bg }]} long preload={false}>
        <ul className="pg-meta">
          <li>
            <UiIcon name="user" />
            <span>{post.author}</span>
          </li>
          <li>
            <UiIcon name="calendar" />
            <time dateTime={post.iso}>{post.date}</time>
          </li>
          <li>
            <UiIcon name="clock" />
            <span>{post.time}</span>
          </li>
          <li>
            <UiIcon name="comment" />
            <span>{post.comments}</span>
          </li>
        </ul>
      </PageHero>

      <article className="cn-sec pg-article" aria-labelledby="pg-title">
        <div className="pg-feature" data-fx="tilt" data-tilt="4" style={{ aspectRatio: `${post.featured.w} / ${post.featured.h}` }}>
          <Photo k={post.featured} className="pg-feature-ph" preload sizes="(max-width: 980px) 94vw, 920px" />
        </div>
        <PostBody blocks={post.blocks} />
        <div className="pg-share">
          {post.share.map((s) => (
            <a key={s.label} className="pg-share-a" href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer">
              <UiIcon name={s.icon} />
            </a>
          ))}
        </div>
      </article>

      <ConstellationLink variant={1} />
      <section className="cn-sec pg-related" aria-labelledby="pg-related-t">
        <SectionHead eyebrow={post.related.eyebrow} title={post.related.title} id="pg-related-t" />
        <CurvedSlider cards={slideCards(posts)} label={post.related.title} />
      </section>
      <JsonLd data={postJsonLd(post, summary(post))} />
    </>
  );
}
