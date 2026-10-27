import { ConstellationLink } from "@/components/sections/Hero";
import { PageHero } from "@/components/site/PageHero";
import { Icon } from "@/components/Icon";
import { Photo, Twinkle } from "@/components/Photo";
import { pageMeta } from "@/lib/seo";
import { vayo } from "@/lib/site/data";

export const metadata = pageMeta({ title: vayo.title, description: vayo.paras[0], path: "/vayo-vidhya", image: { src: vayo.hero.bg } });

/** Vayo Vidhya: the cause in detail, with vision and mission, and the volunteer card beside it. */
export default function VayoPage() {
  const { hero, photos, aside } = vayo;
  const [phoneLabel, phone] = aside.phone.split(/:\s*/);
  const [emailLabel, email] = aside.email.split(/:\s*/);
  return (
    <>
      <PageHero title={hero.title} crumbs={hero.crumbs} pics={[{ src: hero.bg }, photos[1], photos[2]]} />
      <ConstellationLink variant={0} />
      <section className="cn-sec pg-detail" aria-labelledby="pg-vayo-t">
        <div className="pg-detail-main">
          <div className="pg-wide-ph" data-fx="tilt" data-tilt="4">
            <Photo k={photos[0]} sizes="(max-width: 980px) 94vw, 760px" />
          </div>
          <h2 className="cn-h2" id="pg-vayo-t">
            {vayo.title}
          </h2>
          {vayo.paras.map((p) => (
            <p key={p.slice(0, 40)} className="pg-para">
              {p}
            </p>
          ))}
          <div className="pg-pair">
            <Twinkle k={photos[1]} className="pg-pair-ph" sizes="(max-width: 760px) 92vw, 370px" />
            <Twinkle k={photos[2]} className="pg-pair-ph" sizes="(max-width: 760px) 92vw, 370px" />
          </div>
          <ul className="cn-feats pg-boxes">
            {vayo.boxes.map((b) => (
              <li className="cn-card" key={b.title} data-fx="tilt" data-tilt="5">
                <span className="cn-ico">
                  <Icon name={b.icon} />
                </span>
                <h3 className="cn-h4">{b.title}</h3>
                <p>{b.text}</p>
              </li>
            ))}
          </ul>
        </div>
        <aside className="pg-detail-side">
          <div className="pg-clinic-card pg-vol-card">
            <Photo k={{ src: aside.bg }} alt="" className="pg-clinic-bg" sizes="(max-width: 980px) 94vw, 380px" />
            <div className="pg-clinic-in">
              <span className="cn-ico">
                <Icon name="users" />
              </span>
              <h3 className="cn-h3">{aside.question}</h3>
              <p className="pg-clinic-line">
                {phoneLabel}: <a href={`tel:+91${phone.replace(/\D/g, "").slice(2)}`}>{phone}</a>
              </p>
              <p className="pg-clinic-line">
                {emailLabel}: <a href={`mailto:${email}`}>{email}</a>
              </p>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
