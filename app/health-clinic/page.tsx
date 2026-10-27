import { ConstellationLink } from "@/components/sections/Hero";
import { MapFrame } from "@/components/site/Bits";
import { Carousel } from "@/components/site/Carousel";
import { PageHero } from "@/components/site/PageHero";
import { Icon, UiIcon } from "@/components/Icon";
import { Photo, Twinkle } from "@/components/Photo";
import { clinic } from "@/lib/site/data";
import { toPics } from "@/lib/site/photo";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Health Clinic", description: clinic.hero.sub, path: "/health-clinic", image: { src: clinic.hero.bg } });

const DETAIL_ICON: Record<string, string> = { Date: "calendar", Time: "clock", Venue: "pin" };

/** Health Clinic: the grand inauguration — photo carousel, the story, event details, map and contact. */
export default function ClinicPage() {
  const { hero, slides, intro, boxes, goal, location, details, contact } = clinic;
  /* "Phone: +91 99895 55267" → label + number, so the number can be a link */
  const [phoneLabel, phone] = contact.phone.split(/:\s*/);
  const [emailLabel, email] = contact.email.split(/:\s*/);
  return (
    <>
      <PageHero eyebrow={"eyebrow" in hero ? hero.eyebrow : undefined} title={hero.title} sub={hero.sub} pics={[{ src: hero.bg }, slides[1], slides[4]]} />

      <section className="cn-sec pg-car-sec" aria-label={hero.title}>
        <Carousel pics={toPics(slides)} label={hero.title} />
      </section>

      <ConstellationLink variant={0} />
      <section className="cn-sec pg-split" aria-labelledby="pg-intro-t">
        <div className="pg-split-copy">
          <h2 className="cn-h2" id="pg-intro-t">
            {intro.title}
          </h2>
          {intro.paras.map((p) => (
            <p key={p.slice(0, 40)} className="pg-para">
              {p}
            </p>
          ))}
        </div>
        <div className="pg-split-art" aria-hidden="true">
          <Twinkle k={slides[2]} className="pg-split-a" alt="" sizes="(max-width: 980px) 70vw, 360px" />
          <Twinkle k={slides[5]} className="pg-split-b" alt="" sizes="(max-width: 980px) 50vw, 260px" />
        </div>
      </section>

      <section className="cn-sec" aria-label={intro.title}>
        <ul className="cn-feats pg-boxes">
          {boxes.map((b) => (
            <li className="cn-card" key={b.title} data-fx="tilt" data-tilt="5">
              <span className="cn-ico">
                <Icon name={b.icon} />
              </span>
              <h3 className="cn-h4">{b.title}</h3>
              <p>{b.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <ConstellationLink variant={1} />
      <section className="cn-sec pg-goal" aria-labelledby="pg-goal-t">
        <div className="pg-goal-ph" data-fx="tilt" data-tilt="6">
          <Photo k={goal.photo} sizes="(max-width: 980px) 94vw, 520px" />
        </div>
        <div className="pg-goal-copy">
          <h2 className="cn-h2" id="pg-goal-t">
            {goal.title}
          </h2>
          {goal.paras.map((p) => (
            <p key={p.slice(0, 40)} className="pg-para">
              {p}
            </p>
          ))}
        </div>
      </section>

      <ConstellationLink variant={0} />
      <section className="cn-sec pg-where" aria-labelledby="pg-loc-t">
        <div className="pg-where-map">
          <h2 className="cn-h3" id="pg-loc-t">
            {location.title}
          </h2>
          <MapFrame src={location.map} title={location.title} />
        </div>
        <div className="pg-where-side">
          <div className="cn-card pg-details">
            <h2 className="cn-h3">{details.title}</h2>
            <dl>
              {details.items.map((d) => (
                <div key={d.label}>
                  <dt>
                    <UiIcon name={DETAIL_ICON[d.label] ?? "calendar"} />
                    <span>{d.label}:</span>
                  </dt>{" "}
                  <dd>{d.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="pg-clinic-card">
            <Photo k={{ src: contact.bg }} alt="" className="pg-clinic-bg" sizes="(max-width: 980px) 94vw, 460px" />
            <div className="pg-clinic-in">
              <span className="cn-ico">
                <Icon name="clinic" />
              </span>
              <h3 className="cn-h4">{contact.title}</h3>
              <p className="pg-clinic-line">
                {phoneLabel}: <a href={`tel:+91${phone.replace(/\D/g, "").slice(2)}`}>{phone}</a>
              </p>
              <p className="pg-clinic-line">
                {emailLabel}: <a href={`mailto:${email}`}>{email}</a>
              </p>
              <a className="cn-btn" href={contact.href}>
                <span>{contact.cta}</span>
                <UiIcon name="arrow-r" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
