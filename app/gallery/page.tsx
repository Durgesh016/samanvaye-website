import { ConstellationLink } from "@/components/sections/Hero";
import { SectionHead } from "@/components/site/Bits";
import { PageHero } from "@/components/site/PageHero";
import { PhotoGrid } from "@/components/site/PhotoGrid";
import { PhotoRing } from "@/components/site/PhotoRing";
import { Star } from "@/components/Icon";
import { gallery } from "@/lib/site/data";
import { toPics } from "@/lib/site/photo";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Gallery", description: gallery.hero.sub, path: "/gallery", image: { src: gallery.hero.bg } });

/** Gallery: the clinic opening as a 3D ring, then every album as a photo wall with a full-size viewer. */
export default function GalleryPage() {
  const [clinic, ...albums] = gallery.albums;
  return (
    <>
      <PageHero
        eyebrow={gallery.hero.eyebrow}
        title={gallery.hero.title}
        sub={"sub" in gallery.hero ? gallery.hero.sub : undefined}
        pics={[{ src: gallery.hero.bg }, clinic.photos[2], albums[1].photos[0]]}
      />
      <section className="cn-sec pg-ring-sec" aria-labelledby="pg-ring-t">
        <SectionHead eyebrow={gallery.eyebrow} title={clinic.title} id="pg-ring-t" />
        <PhotoRing pics={toPics(clinic.photos)} label={clinic.title} />
      </section>

      <nav className="pg-chips" aria-label={gallery.hero.eyebrow}>
        {albums.map((a) => (
          <a key={a.id} href={`#${a.id}`}>
            <Star className="pg-chip-s" />
            <span>{a.title}</span>
          </a>
        ))}
      </nav>

      {albums.map((a, i) => (
        <div key={a.id}>
          <ConstellationLink variant={i % 2 ? 1 : 0} />
          <section className="cn-sec pg-album" id={a.id} aria-labelledby={`${a.id}-t`}>
            <SectionHead title={a.title} id={`${a.id}-t`} />
            <PhotoGrid pics={toPics(a.photos)} dense={a.photos.length > 12} />
          </section>
        </div>
      ))}
    </>
  );
}
