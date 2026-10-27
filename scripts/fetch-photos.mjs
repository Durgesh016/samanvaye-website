#!/usr/bin/env node
/**
 * Copies the inner-page photos from samanvaye.org into public/images/site/ so the site does not depend on
 * the WordPress server. Runs automatically before `npm run dev` and `npm run build`; photos that are
 * already on disk are skipped, so only the first run downloads anything.
 *
 * The list of photos is lib/site/photos.json (WordPress upload paths such as "2026/05/photo.jpg").
 * Large photos are resized to 1920 px wide with sharp (installed together with Next.js) when available.
 * If a photo cannot be downloaded (offline, or removed from samanvaye.org), the page shows it straight
 * from samanvaye.org instead, and the next run tries again. This script never stops dev or build.
 *
 *   node scripts/fetch-photos.mjs           download what is missing
 *   node scripts/fetch-photos.mjs --check   only report what is missing
 */
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(ROOT, "public", "images", "site");
const REMOTE = "https://samanvaye.org/wp-content/uploads/";
const MAX_WIDTH = 1920;
const PARALLEL = 6;

async function main() {
  const list = JSON.parse(await fs.readFile(path.join(ROOT, "lib", "site", "photos.json"), "utf8"));
  const missing = list.filter((p) => !existsSync(path.join(OUT, p)));
  if (process.argv.includes("--check")) {
    console.log(`[photos] ${list.length - missing.length}/${list.length} on disk`);
    missing.forEach((p) => console.log("  missing:", p));
    return;
  }
  if (!missing.length) return;

  let sharp = null;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    /* optional: photos are saved at their original size */
  }

  console.log(`[photos] Saving ${missing.length} photos from samanvaye.org into public/images/site (one time only)...`);
  let done = 0;
  const failed = [];

  async function save(upload) {
    try {
      const res = await fetch(REMOTE + upload, {
        signal: AbortSignal.timeout(60_000),
        headers: { "user-agent": "samanvaye-next (photo copy)" },
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      let data = Buffer.from(await res.arrayBuffer());
      if (sharp && /\.(jpe?g|png)$/i.test(upload)) {
        try {
          const image = sharp(data, { failOn: "none" });
          const { width = 0 } = await image.metadata();
          if (width > MAX_WIDTH) {
            const resized = image.resize({ width: MAX_WIDTH, withoutEnlargement: true });
            data = /\.png$/i.test(upload)
              ? await resized.png({ compressionLevel: 9 }).toBuffer()
              : await resized.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
          }
        } catch {
          /* keep the original bytes */
        }
      }
      const file = path.join(OUT, ...upload.split("/"));
      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.writeFile(file + ".part", data);
      await fs.rename(file + ".part", file);
    } catch (err) {
      failed.push(`${upload} (${err?.message || err})`);
    }
    done += 1;
    if (process.stdout.isTTY) process.stdout.write(`[photos] ${done}/${missing.length}\r`);
  }

  const queue = missing.slice();
  await Promise.all(
    Array.from({ length: PARALLEL }, async () => {
      while (queue.length) await save(queue.shift());
    }),
  );

  console.log(`[photos] ${missing.length - failed.length} of ${missing.length} saved.`);
  if (failed.length) {
    console.log(`[photos] ${failed.length} not saved; they are shown from samanvaye.org until the next run:`);
    failed.slice(0, 8).forEach((f) => console.log("  ", f));
    if (failed.length > 8) console.log(`   ...and ${failed.length - 8} more`);
  }
}

main().catch((err) => {
  console.warn("[photos] skipped:", err?.message || err);
});
