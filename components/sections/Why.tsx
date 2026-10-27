import { content } from "@/lib/content";
import { Star, UiIcon } from "../Icon";
import { Twinkle, type PicRef } from "../Photo";

type WhyData = {
  readonly eyebrow: string;
  readonly title: string;
  readonly tabs: readonly string[];
  readonly subtitle: string;
  readonly text: string;
  readonly bullets: readonly string[];
  readonly cta: string;
  readonly href: string;
};

/** "Why choose us": the five reasons as stars on a line, then the photo and the promise. */
export function Why({ data = content.why, photo = content.why.img }: { data?: WhyData; photo?: PicRef }) {
  const y = data;
  return (
    <section className="cn-sec cn-why" aria-labelledby="cn-why-t">
      <div className="cn-head">
        <p className="cn-eyebrow">
          <Star />
          <span>{y.eyebrow}</span>
        </p>
        <h2 className="cn-h2" id="cn-why-t">
          {y.title}
        </h2>
      </div>
      <ol className="cn-tabs">
        {y.tabs.map((t) => (
          <li key={t}>
            <span className="cn-tab-dot" aria-hidden="true"></span>
            <span>{t}</span>
          </li>
        ))}
      </ol>
      <div className="cn-why-grid">
        <Twinkle k={photo} className="cn-why-ph" sizes="(max-width: 760px) 92vw, 560px" />
        <div className="cn-why-copy">
          <h3 className="cn-h3">{y.subtitle}</h3>
          <p>{y.text}</p>
          <ul className="cn-bul">
            {y.bullets.map((b) => (
              <li key={b}>
                <Star className="cn-bul-s" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <a className="cn-btn" href={y.href}>
            <span>{y.cta}</span>
            <UiIcon name="arrow-r" />
          </a>
        </div>
      </div>
    </section>
  );
}
