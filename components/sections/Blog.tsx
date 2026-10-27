import { content } from "@/lib/content";
import { Star, UiIcon } from "../Icon";
import { Photo } from "../Photo";

export function Blog() {
  const b = content.blog;
  return (
    <section className="cn-sec cn-blog" aria-labelledby="cn-bl-t">
      <div className="cn-head">
        <p className="cn-eyebrow">
          <Star />
          <span>{b.eyebrow}</span>
        </p>
        <h2 className="cn-h2" id="cn-bl-t">
          {b.title}
        </h2>
      </div>
      <ul className="cn-posts">
        {b.items.map((post) => (
          <li className="cn-card cn-post cn-host" key={post.title}>
            <a className="cn-post-ph" href={post.href} tabIndex={-1} aria-hidden="true">
              <Photo k={post.img} alt="" sizes="(max-width: 760px) 92vw, 380px" />
            </a>
            <span className="bd cn-bd">
              <span className="bd-d">{post.day}</span> <span className="bd-m">{post.mon}</span>
            </span>
            <h3 className="cn-h5">
              <a href={post.href}>{post.title}</a>
            </h3>
            <a className="cn-more" href={post.href}>
              <span>{b.cta}</span>
              <UiIcon name="arrow-r" />
              <span className="vh"> {post.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
