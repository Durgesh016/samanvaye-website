import type { MetadataRoute } from "next";
import { gallery, posts } from "@/lib/site/data";
import { photoUrl } from "@/lib/site/photo";
import { SITE_URL, absolute } from "@/lib/seo";

/* written to out/sitemap.xml at build time (static export) */
export const dynamic = "force-static";

/* Every page in app/. Add new pages here so search engines find them. */
const PAGES = ["/", "/about-us", "/our-team", "/causes", "/vayo-vidhya", "/health-clinic", "/blogs", "/gallery", "/donation", "/contact-us"];

const photos = (pics: readonly { src: string }[]) => pics.map((p) => absolute(photoUrl(p.src)));

/** /sitemap.xml: every page, and every blog post with its publish date. Photos are listed for Google Images. */
export default function sitemap(): MetadataRoute.Sitemap {
  const albums = photos(gallery.albums.flatMap<{ src: string }>((a) => a.photos));
  return [
    ...PAGES.map((p) => (p === "/gallery" ? { url: SITE_URL + p, images: albums } : { url: SITE_URL + p })),
    ...posts.map((p) => ({
      url: `${SITE_URL}/${p.slug}`,
      lastModified: p.iso,
      images: photos([p.featured, ...p.blocks.flatMap((b) => (b.type === "img" ? [b] : []))]),
    })),
  ];
}
