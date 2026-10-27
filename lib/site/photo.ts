import fs from "node:fs";
import path from "node:path";

/**
 * Inner-page photos are stored under their WordPress upload path, e.g. "2026/05/photo.jpg".
 * `npm run dev` / `npm run build` first run scripts/fetch-photos.mjs, which copies every photo listed in
 * lib/site/photos.json from samanvaye.org into public/images/site/ (once). A photo that is on disk is
 * served from this site; one that is not (for example while offline) is shown straight from samanvaye.org.
 * Server-only: import this from Server Components and pass the resulting URL to Client Components.
 */
const DIR = path.join(process.cwd(), "public", "images", "site");
const REMOTE = "https://samanvaye.org/wp-content/uploads/";
const local = new Set<string>();

export function photoUrl(upload: string): string {
  if (local.has(upload)) return `/images/site/${upload}`;
  if (fs.existsSync(path.join(DIR, upload))) {
    local.add(upload);
    return `/images/site/${upload}`;
  }
  return REMOTE + upload;
}

export type SitePic = { src: string; alt?: string; w?: number; h?: number };

/** Photos for a Client Component (gallery walls, carousels, the viewer): src becomes a URL. */
export function toPics(pics: readonly SitePic[]): { url: string; alt: string; w?: number; h?: number }[] {
  return pics.map((p) => ({ url: photoUrl(p.src), alt: p.alt ?? "", w: p.w, h: p.h }));
}
