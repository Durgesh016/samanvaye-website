import { ConstellationLink } from "@/components/sections/Hero";
import { MapFrame } from "@/components/site/Bits";
import { BankCard } from "@/components/site/DonationForm";
import { ContactForm } from "@/components/site/Forms";
import { PageHero } from "@/components/site/PageHero";
import { UiIcon } from "@/components/Icon";
import { clinic, contact } from "@/lib/site/data";
import { content } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Contact Us", description: contact.hero.sub, path: "/contact-us", image: { src: contact.hero.bg } });

/** Contact us: the message form, the bank details card (3D tilt), the map and the address. */
export default function ContactPage() {
  const { hero, message, form, bank, map, info } = contact;
  return (
    <>
      <PageHero eyebrow={"eyebrow" in hero ? hero.eyebrow : undefined} title={hero.title} sub={"sub" in hero ? hero.sub : undefined} pics={[{ src: hero.bg }, clinic.slides[0], clinic.slides[3]]} />
      <ConstellationLink variant={0} />
      <section className="cn-sec pg-contact" aria-labelledby="pg-msg-t">
        <div className="pg-contact-main cn-card">
          <h2 className="cn-h2" id="pg-msg-t">
            {message.title}
          </h2>
          <p className="cn-lede">{message.text}</p>
          <ContactForm title={form.title} fields={form.fields} submit={form.submit} to={content.topbar.email} />
        </div>
        <div className="pg-contact-side">
          <BankCard bank={bank} />
          <ul className="pg-info">
            {info.map((it) => (
              <li key={it.title} className="cn-card">
                <span className="cn-ico">
                  <UiIcon name={it.icon} />
                </span>
                <div>
                  <h3 className="cn-h4">{it.title}</h3>
                  <p>
                    {it.lines.map((l, i) =>
                      it.icon === "mail" ? (
                        <a key={l} href={`mailto:${l}`}>
                          {l}
                        </a>
                      ) : (
                        <span key={l}>
                          {i > 0 && <br />}
                          {l}
                        </span>
                      ),
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="cn-sec pg-map-sec" aria-label={info[0].title.replace(/:$/, "")}>
        <MapFrame src={map} title={hero.title} />
      </section>
    </>
  );
}
