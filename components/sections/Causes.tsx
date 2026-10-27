import { content } from "@/lib/content";
import { Star, UiIcon } from "../Icon";
import { Twinkle } from "../Photo";

export function Causes() {
  const k = content.causes;
  return (
    <section className="cn-sec cn-causes" aria-labelledby="cn-ca-t">
      <div className="cn-head">
        <p className="cn-eyebrow">
          <Star />
          <span>{k.eyebrow}</span>
        </p>
        <h2 className="cn-h2" id="cn-ca-t">
          {k.title}
        </h2>
        <a className="cn-more" href={k.href}>
          <span>{k.cta}</span>
          <UiIcon name="arrow-r" />
        </a>
      </div>
      <ul className="cn-ca">
        {k.items.map((item) => (
          <li key={item.title}>
            <a className="cn-ca-card cn-host" href={item.href}>
              <Twinkle k={item.img} className="cn-ca-ph" sizes="(max-width: 760px) 92vw, 360px" />
              <h3 className="cn-h4">{item.title}</h3>
              {"text" in item && item.text ? <p className="cn-ca-text">{item.text}</p> : null}
              <span className="cn-more">
                <span>{item.cta}</span>
                <UiIcon name="arrow-r" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
