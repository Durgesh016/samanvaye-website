import { ConstellationLink } from "@/components/sections/Hero";
import { PageHero } from "@/components/site/PageHero";
import { Star } from "@/components/Icon";
import { Twinkle } from "@/components/Photo";
import { pageMeta } from "@/lib/seo";
import { team } from "@/lib/site/data";

export const metadata = pageMeta({ title: "Our Team", description: team.text, path: "/our-team", image: team.members[0].photo });

/** Our Team: each member as a star in the constellation — portrait (tilts in 3D), role, name, story. */
export default function TeamPage() {
  const [president, vice, secretary] = team.members;
  return (
    <>
      <PageHero
        eyebrow={team.eyebrow}
        title={team.title}
        sub={team.text}
        pics={[president.photo, vice.photo, secretary.photo]}
        focus="50% 30%"
      />
      <ConstellationLink variant={1} />
      <section className="cn-sec pg-team" aria-label={team.title.join(" ")}>
        <ol className="pg-team-list">
          {team.members.map((m, i) => (
            <li key={m.name} className={`pg-member${i % 2 ? " pg-member-r" : ""}${i < 2 ? " pg-member-lead" : ""}`}>
              <div className="pg-member-ph" data-fx="tilt" data-tilt="8">
                <Twinkle
                  k={m.photo}
                  className="pg-member-tw"
                  sizes="(max-width: 760px) 80vw, 380px"
                  focus={m.photo.w > m.photo.h ? "50% 35%" : "50% 18%"}
                />
                <span className="pg-badge">
                  <Star className="pg-badge-s" />
                  <span>{m.role}</span>
                </span>
              </div>
              <div className="pg-member-copy">
                <h2 className="cn-h3 pg-member-name">{m.name}</h2>
                <p className="pg-member-q">{m.qualification}</p>
                {m.story.map((s) => (
                  <p key={s.slice(0, 40)} className="pg-member-story">
                    {s}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
