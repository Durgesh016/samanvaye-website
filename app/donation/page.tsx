import { ConstellationLink } from "@/components/sections/Hero";
import { DonationForm } from "@/components/site/DonationForm";
import { PageHero } from "@/components/site/PageHero";
import { Star } from "@/components/Icon";
import { causes, contact, donation } from "@/lib/site/data";
import { content } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Donate", description: donation.hero.sub, path: "/donation", image: { src: donation.hero.bg } });

/** Donation: the three-step donation form from samanvaye.org (amount → donor → payment). */
export default function DonationPage() {
  const { hero, form } = donation;
  return (
    <>
      <PageHero eyebrow={"eyebrow" in hero ? hero.eyebrow : undefined} title={hero.title} sub={"sub" in hero ? hero.sub : undefined} pics={[{ src: hero.bg }, causes.items[4].photo, causes.items[0].photo]} />
      <ConstellationLink variant={1} />
      <section className="cn-sec pg-give" aria-label={hero.title}>
        <div className="pg-give-wrap">
          <span className="pg-give-orbit" aria-hidden="true">
            <Star className="pg-give-orbit-s" />
          </span>
          <DonationForm text={form} bank={contact.bank} to={content.topbar.email} subject={hero.title} />
        </div>
      </section>
    </>
  );
}
