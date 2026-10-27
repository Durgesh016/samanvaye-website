import path from "node:path";
import sharp from "sharp";
import { images } from "@/lib/images";
import { about, causes, clinic, contact, donation, gallery, posts, team, vayo } from "@/lib/site/data";

const ROOT = path.join(process.cwd(), "public", "images");

/* Written to out/og/… at build time (static export): one file for each photo the pages pass to pageMeta. */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  const files = [
    images.hero1.src.replace("/images/", ""),
    ...[about, causes, clinic, contact, donation, gallery, vayo].map((d) => `site/${d.hero.bg}`),
    `site/${team.members[0].photo.src}`,
    ...posts.map((p) => `site/${p.featured.src}`),
  ];
  return [...new Set(files)].map((f) => ({ path: f.split("/") }));
}

/** /og/<photo under public/images>: the photo cropped to 1200×630 as a JPEG, for link previews (see pageMeta). */
export async function GET(_req: Request, { params }: RouteContext<"/og/[...path]">) {
  const file = path.join(ROOT, ...(await params).path);
  if (!file.startsWith(ROOT + path.sep) || !/\.(jpe?g|png)$/i.test(file)) return new Response("Not found", { status: 404 });
  try {
    const jpg = await sharp(file)
      .flatten({ background: "#0B1033" }) /* a transparent PNG gets the site's night-sky colour, not black */
      .resize(1200, 630, { fit: "cover", position: sharp.strategy.attention })
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer();
    return new Response(new Uint8Array(jpg), { headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=86400" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
