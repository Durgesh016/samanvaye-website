import { content } from "@/lib/content";
import { Star, UiIcon } from "../Icon";
import { Twinkle, type PicRef } from "../Photo";

type Card = { readonly title: string; readonly text: string; readonly cta: string; readonly href: string };
type VolunteerData = { readonly a: Card; readonly b: Card & { readonly eyebrow: string } };

/** Card A ("Lend a hand") alone — used when Programmes is inserted between the two cards. */
export function VolunteerA({
  data = content.volunteer,
  photo = "vol1" as PicRef,
  id = "cn-vol-t",
}: {
  data?: VolunteerData;
  photo?: PicRef;
  id?: string;
}) {
  const { a } = data;
  return (
    <section className="cn-sec cn-vol" aria-labelledby={id}>
      <div className="cn-vol-grid">
        <article className="cn-card cn-vol-a cn-host">
          <Twinkle k={photo} className="cn-vol-ph" sizes="(max-width: 760px) 92vw, 44vw" />
          <h2 className="cn-h3" id={id}>{a.title}</h2>
          <p>{a.text}</p>
          <a className="cn-more" href={a.href}>
            <span>{a.cta}</span>
            <UiIcon name="arrow-r" />
          </a>
        </article>
      </div>
    </section>
  );
}

/** Card B ("Volunteer with us") alone — used when Programmes is inserted between the two cards. */
export function VolunteerB({
  data = content.volunteer,
  photo = "vol2" as PicRef,
}: {
  data?: VolunteerData;
  photo?: PicRef;
}) {
  const { b } = data;
  return (
    <section className="cn-sec cn-vol" aria-labelledby="cn-vol-b-t">
      <div className="cn-vol-grid">
        <article className="cn-card cn-vol-b cn-host cn-vol-b-solo">
          <Twinkle k={photo} className="cn-vol-ph" sizes="(max-width: 760px) 92vw, 44vw" />
          <p className="cn-eyebrow"><Star /><span>{b.eyebrow}</span></p>
          <h2 className="cn-h3" id="cn-vol-b-t">{b.title}</h2>
          <p>{b.text}</p>
          <a className="cn-btn" href={b.href}>
            <span>{b.cta}</span>
            <UiIcon name="arrow-r" />
          </a>
        </article>
      </div>
    </section>
  );
}

/** Both cards joined by a star bridge — kept for any page that wants the paired layout. */
export function Volunteer({
  data = content.volunteer,
  photos = ["vol1", "vol2"],
  id = "cn-vol-t",
}: {
  data?: VolunteerData;
  photos?: readonly [PicRef, PicRef];
  id?: string;
}) {
  const { a, b } = data;
  return (
    <section className="cn-sec cn-vol" aria-labelledby={id}>
      <div className="cn-vol-grid">
        <article className="cn-card cn-vol-a cn-host">
          <Twinkle k={photos[0]} className="cn-vol-ph" sizes="(max-width: 760px) 92vw, 30vw" />
          <h2 className="cn-h3" id={id}>
            {a.title}
          </h2>
          <p>{a.text}</p>
          <a className="cn-more" href={a.href}>
            <span>{a.cta}</span>
            <UiIcon name="arrow-r" />
          </a>
        </article>
        <span className="cn-bridge" aria-hidden="true">
          <Star className="cn-bridge-s" />
        </span>
        <article className="cn-card cn-vol-b cn-host">
          <Twinkle k={photos[1]} className="cn-vol-ph" sizes="(max-width: 760px) 92vw, 30vw" />
          <p className="cn-eyebrow">
            <Star />
            <span>{b.eyebrow}</span>
          </p>
          <h2 className="cn-h3">{b.title}</h2>
          <p>{b.text}</p>
          <a className="cn-btn" href={b.href}>
            <span>{b.cta}</span>
            <UiIcon name="arrow-r" />
          </a>
        </article>
      </div>
    </section>
  );
}
