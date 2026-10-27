import { content } from "@/lib/content";
import { Icon, Star, UiIcon } from "../Icon";
import { Twinkle, type PicRef } from "../Photo";

type WhoData = {
  readonly counter: { readonly label: string; readonly value: number; readonly suffix: string };
  readonly eyebrow: string;
  readonly title: string;
  readonly text: string;
  readonly features: readonly { readonly title: string; readonly text: string; readonly icon: string }[];
  readonly bullets: readonly string[];
  readonly cta: string;
  readonly href: string;
  readonly call_label: string;
  readonly phone: string;
  readonly phone_href: string;
};

/** "Who we are", with the "Help poor people 2k+" counter that counts up when it scrolls into view. */
export function About({
  data = content.who,
  photos = ["who1", "launch"],
}: {
  data?: WhoData;
  photos?: readonly [PicRef, PicRef];
}) {
  const w = data;
  return (
    <section className="cn-sec cn-who" aria-labelledby="cn-who-t">
      <div className="cn-head">
        <p className="cn-eyebrow">
          <Star />
          <span>{w.eyebrow}</span>
        </p>
        <h2 className="cn-h2" id="cn-who-t">
          {w.title}
        </h2>
        <p className="cn-lede">{w.text}</p>
      </div>
      <div className="cn-who-row">
        <Twinkle k={photos[0]} className="cn-who-ph" sizes="(max-width: 760px) 46vw, 300px" />
        <p className="cn-count-wrap">
          <span className="count cn-count">
            <span className="count-n" data-fx="count" data-to={w.counter.value}>
              {w.counter.value}
            </span>
            <span className="count-s">{w.counter.suffix}</span>
          </span>
          <span className="cn-count-l">{w.counter.label}</span>
        </p>
        <Twinkle k={photos[1]} className="cn-who-ph" sizes="(max-width: 760px) 46vw, 300px" />
      </div>
      <ul className="cn-feats">
        {w.features.map((f) => (
          <li className="cn-card" key={f.title}>
            <span className="cn-ico">
              <Icon name={f.icon} />
            </span>
            <h3 className="cn-h4">{f.title}</h3>
            <p>{f.text}</p>
          </li>
        ))}
      </ul>
      <ul className="cn-bul">
        {w.bullets.map((b) => (
          <li key={b}>
            <Star className="cn-bul-s" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div className="cn-actions">
        <a className="cn-btn" href={w.href}>
          <span>{w.cta}</span>
          <UiIcon name="arrow-r" />
        </a>
        <p className="cn-call">
          <UiIcon name="phone" />
          <span>{w.call_label}</span> <a href={w.phone_href}>{w.phone}</a>
        </p>
      </div>
    </section>
  );
}
