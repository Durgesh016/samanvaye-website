import { About } from "@/components/sections/About";
import { ConstellationLink } from "@/components/sections/Hero";
import { Why } from "@/components/sections/Why";
import { Coverflow } from "@/components/site/Coverflow";
import { PageHero } from "@/components/site/PageHero";
import { Star } from "@/components/Icon";
import { about } from "@/lib/site/data";
import { photoUrl } from "@/lib/site/photo";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "About Us", description: about.hero.sub, path: "/about-us", image: { src: about.hero.bg } });

/** About us: who we are, why Samanvaye, and the Organizing Council. */
export default function AboutPage() {
  const { hero, who, why, council } = about;
  return (
    <>
      <PageHero
        eyebrow={"eyebrow" in hero ? hero.eyebrow : undefined}
        title={hero.title}
        sub={"sub" in hero ? hero.sub : undefined}
        pics={[{ src: hero.bg }, who.photos[0], who.photos[1]]}
      />
      <ConstellationLink variant={0} />
      <About data={who} photos={[who.photos[0], who.photos[1]]} />
      <Why data={why} />
      <ConstellationLink variant={1} />
      <section className="cn-sec pg-council" aria-labelledby="pg-council-t">
        <div className="cn-head">
          <p className="cn-eyebrow">
            <Star />
            <span>{council.title}</span>
          </p>
          <h2 className="cn-h2 pg-council-t" id="pg-council-t">
            {council.heading.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </h2>
          <p className="cn-lede">{council.text}</p>
        </div>
        <Coverflow
          label={council.heading.join(" ")}
          members={council.members.map((m) => ({ name: m.name, role: m.role, url: photoUrl(m.photo.src) }))}
        />
      </section>
    </>
  );
}
