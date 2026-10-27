import { ConstellationLink } from "@/components/sections/Hero";
import { PostCard } from "@/components/site/Bits";
import { NewsletterForm } from "@/components/site/Forms";
import { PageHero } from "@/components/site/PageHero";
import { content } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { blogs, posts } from "@/lib/site/data";

export const metadata = pageMeta({
  title: "Blogs",
  description: blogs.text,
  path: "/blogs",
  image: posts.find((p) => p.slug === blogs.posts[0].slug)?.featured,
});

/** Blogs: Impact Stories and the newsletter sign-up. */
export default function BlogsPage() {
  const list = blogs.posts.map((b) => ({ post: posts.find((p) => p.slug === b.slug)!, cta: b.cta }));
  return (
    <>
      <PageHero eyebrow={"eyebrow" in blogs ? blogs.eyebrow : undefined} title={blogs.title} sub={blogs.text} pics={list.slice(0, 3).map((l) => l.post.featured)} />
      <ConstellationLink variant={0} />
      <section className="cn-sec" aria-labelledby="pg-title">
        <ul className="cn-posts pg-posts">
          {list.map(({ post, cta }) => (
            <li key={post.slug}>
              <PostCard post={post} cta={cta} />
            </li>
          ))}
        </ul>
      </section>
      <ConstellationLink variant={1} />
      <section className="cn-sec pg-news" aria-labelledby="pg-news-t">
        <div className="pg-news-card cn-card">
          <h2 className="cn-h2" id="pg-news-t">
            {blogs.newsletter.title}
          </h2>
          <NewsletterForm
            title={blogs.newsletter.title}
            fields={blogs.newsletter.fields}
            submit={blogs.newsletter.submit}
            to={content.topbar.email}
          />
        </div>
      </section>
    </>
  );
}
