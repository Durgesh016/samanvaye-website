import { Give } from "@/components/sections/Give";
import { ConstellationLink } from "@/components/sections/Hero";
import { PageHero } from "@/components/site/PageHero";
import { UiIcon } from "@/components/Icon";
import { PhotoSlides } from "@/components/Photo";
import { pageMeta } from "@/lib/seo";
import { causes, gallery } from "@/lib/site/data";

export const metadata = pageMeta({ title: "Our Causes", description: causes.hero.sub, path: "/causes", image: { src: causes.hero.bg } });

/* Hovering a cause slides through more photos of that work, taken from the matching gallery album. */
const ALBUM_FOR = ["medical-camp", "vayo-vidhya-service-for-elderly-care", "tailoring-programs-for-women", "books-donation", "social-welfare-services", "medical-camp"];
const OFFSET = [0, 0, 2, 1, 7, 6];

function morePhotos(i: number, first: string) {
  const album = gallery.albums.find((a) => a.id === ALBUM_FOR[i]);
  const extra = (album?.photos ?? []).filter((p) => !p.src.startsWith(first.replace(/-\d+x\d+(\.\w+)$/, "")));
  return extra.slice(OFFSET[i], OFFSET[i] + 3);
}

/** Causes: six causes as 3D tilt cards with picture-slide hover, then the president's appeal. */
export default function CausesPage() {
  const { hero, items, give } = causes;
  return (
    <>
      <PageHero eyebrow={"eyebrow" in hero ? hero.eyebrow : undefined} title={hero.title} sub={hero.sub} pics={[{ src: hero.bg }, items[0].photo, items[1].photo]} />
      <ConstellationLink variant={0} />
      <section className="cn-sec pg-causes-sec" aria-label={hero.title}>
        <ul className="pg-causes">
          {items.map((it, i) => (
            <li key={it.title}>
              <article className="pg-cause cn-card cn-host" data-fx="tilt" data-tilt="6" data-slide-host="">
                <PhotoSlides
                  className="pg-cause-ph"
                  pics={[it.photo, ...morePhotos(i, it.photo.src)]}
                  sizes="(max-width: 760px) 92vw, (max-width: 980px) 46vw, 360px"
                  effect={i % 2 ? "wipe" : "push"}
                />
                <div className="pg-cause-body">
                  <h2 className="cn-h4">{it.title}</h2>
                  <p>{it.text}</p>
                  <a className="cn-more" href={it.href}>
                    <span>{it.cta}</span>
                    <UiIcon name="arrow-r" />
                    <span className="vh"> {it.title}</span>
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>
      <ConstellationLink variant={1} />
      <Give data={give} />
    </>
  );
}
