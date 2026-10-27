# Samanvaye Foundation: Constellation website (Next.js)

The whole samanvaye.org site rebuilt in the Constellation design with **Next.js 16 (App Router) + React 19 +
TypeScript**. No WordPress: every page is part of this project and every menu link stays inside it.
All text is the live site's text, word for word (spelling kept as published).

| Page | Address | What moves |
| --- | --- | --- |
| Home | `/` | 3D photo constellation (A-Frame), orbiting gallery, counters, timeline |
| About us | `/about-us` | 3D cover-flow of the Organizing Council, tilt cards, word ribbon |
| Our Team | `/our-team` | portraits that tilt in 3D, constellation lines between members |
| Causes | `/causes` | 3D tilt cards; hovering a cause slides through more photos of that work |
| Blogs | `/blogs` | post cards, a 3D film strip of the social media photos, newsletter form |
| Blog posts (8) | `/social-welfare-programs`, `/supporting-orphanage-children`, … (same addresses as before) | curved 3D "Latest news and articles" slider |
| Gallery | `/gallery` | the clinic opening as a 3D photo ring (drag it), albums as photo walls, full-screen viewer |
| Health Clinic | `/health-clinic` | photo carousel with slow zoom, 3D thumbnail strip, map, event details |
| Contact Us | `/contact-us` | message form, bank details card that tilts in 3D, map |
| Donation | `/donation` | the three-step donation form (amount → donor → payment) |
| Vayo Vidhya | `/vayo-vidhya` | cause details with the volunteer card |

Every inner page opens with its title beside a small constellation of that page's photos that drifts in 3D
with the mouse.

## Run it

You need **Node.js 20.9 or newer**.

```bash
npm install
npm run dev
```

Open **http://localhost:3000** (use `localhost`, not `127.0.0.1`: Next.js blocks its development files on other
host names unless you add them to `allowedDevOrigins` in `next.config.ts`).

**First run:** before the site starts, `scripts/fetch-photos.mjs` copies the inner-page photos that are not in the
project yet (128 of the 140) from samanvaye.org into `public/images/site/`, one time only, and shrinks big ones
to 1920 px. You will see
`[photos] Saving … photos …` in the terminal. After that the site does not need the WordPress server at all.
If you are offline, the run simply carries on; any photo not yet copied is shown from samanvaye.org, and the
next `npm run dev` tries again. You can also run it yourself: `npm run photos` (or `node scripts/fetch-photos.mjs --check`
to list what is missing).

Production build (a static site: `output: "export"` in `next.config.ts`):

```bash
npm run build
```

The build copies the photos first, then writes the whole site as plain files to **`out/`**. Upload the contents of
`out/` to any web host; no Node.js is needed. (`npm start` does not work with a static export; to look at the
build locally, serve `out/` with any static file server.)

## Where things are

```
app/
  layout.tsx            shared for every page: <html>, fonts, top bar, header, footer, effects
  page.tsx              homepage
  about-us/ our-team/ causes/ blogs/ gallery/ health-clinic/ contact-us/ donation/ vayo-vidhya/
                        one folder per page (page.tsx)
  [slug]/page.tsx       the 8 blog posts, at their old samanvaye.org addresses
  sitemap.ts robots.ts  /sitemap.xml and /robots.txt for search engines
  og/[...path]/route.ts link-preview pictures: any photo as a 1200×630 JPEG (/og/site/2026/05/photo.jpg)
  icon.png apple-icon.png favicon.ico   the site icons (browser tab, phone home screen, search results)
  globals.css           colour + font tokens, shared effects, homepage styles (cn- classes)
  pages.css             inner-page styles (pg- classes)
components/
  sections/             homepage sections; Volunteer, About, Why, Give and Marquee are reused on inner pages
  site/                 inner-page parts: PageHero, PhotoRing, PhotoGrid, Lightbox, Coverflow, Carousel,
                        CurvedSlider, PhotoStrip, Forms, DonationForm (with BankCard), NavLinks
  Photo.tsx             <Photo>, <Twinkle> (sparkle hover) and <PhotoSlides> (picture-slide on hover)
  JsonLd.tsx            writes schema.org structured data into a page
  SiteEffects.tsx       starts the effects; loads A-Frame only on the homepage, after the page itself
lib/
  content.ts            ALL homepage text and menu/footer links
  site/data.ts          ALL inner-page text: about, team, causes, blogs, posts, gallery, clinic, contact, …
  site/photos.json      every inner-page photo (WordPress upload paths, e.g. 2026/05/photo.jpg)
  site/photo.ts         serves a photo from public/images/site, or from samanvaye.org until it is copied
  images.ts             homepage photos (public/images)
  seo.ts                site address, page titles/descriptions/share cards (pageMeta), structured data
  samanvaye/            effects runtime and the homepage 3D scene
scripts/fetch-photos.mjs  the one-time photo copy
public/images/          homepage photos; site/ holds the inner-page photos
```

**To change wording**, edit `lib/content.ts` (homepage, menu, footer) or `lib/site/data.ts` (inner pages).
**To add a gallery photo**, put the file in `public/images/site/…` and add it to the album in `lib/site/data.ts`
(`src` is the path under `public/images/site/`, `w`/`h` its width and height).

## Search engines (SEO)

Every page has its own title, description, canonical address, and a photo for link previews on WhatsApp,
Facebook and X (set with `pageMeta` from `lib/seo.ts` at the top of each `page.tsx`). The preview photo is a
1200×630 JPEG of about 50–170 KB made by `app/og/[...path]/route.ts`; full-size photos are often over 300 KB,
which WhatsApp does not show. Search engines also get `/sitemap.xml` (with the gallery and blog photos for Google
Images), `/robots.txt`, and schema.org data describing the foundation (address, phones, social profiles) and
each blog post.

- **Site address:** links in these tags use `https://samanvaye.org`. To build for another address (a preview,
  for example), set the `SITE_URL` environment variable, e.g. `SITE_URL=https://preview.example.com`.
- **Adding a page:** call `pageMeta` in its `page.tsx` and add its address to `PAGES` in `app/sitemap.ts`.
  New blog posts in `lib/site/data.ts` are added to the sitemap automatically. If the page uses a new preview
  photo, add it to `generateStaticParams` in `app/og/[...path]/route.ts` so it is made at build time.
- **Old WordPress addresses:** pages and posts kept their addresses. The WordPress-only ones (tag and category
  pages, `/home-2`, the donation-plugin pages, `/wp-sitemap.xml`, photos under `/wp-content/uploads/`) should
  move permanently (301) to the closest page. A static export cannot do this itself, so set these redirects up
  on the web host.
- **After going live:** in [Google Search Console](https://search.google.com/search-console), submit
  `https://samanvaye.org/sitemap.xml` (the WordPress site's sitemap was `/wp-sitemap.xml`).

## Forms and donations

The site has no server of its own, so the **Contact Us**, **newsletter** and **donation** forms open the visitor's
email app with the message filled in, addressed to info@samanvaye.org. To receive form posts directly instead,
point the forms in `components/site/Forms.tsx` at a form service (Formspree, Getform, …) or a Next.js Route
Handler that sends email.

The donation form keeps the three steps of the form on samanvaye.org. Payment is **Offline Donation**: the last
step shows the foundation's bank details (from the Contact Us page) and sends the pledge by email. To take
card/UPI payments online, connect a payment gateway (for example Razorpay or Stripe) in
`components/site/DonationForm.tsx`. The "Test Donation" option of the WordPress form was left out, and its
placeholder address was replaced by the real bank details.

## How it works

- Pages are server-rendered HTML (built ahead of time), so they are fast and readable before any JavaScript runs.
- Links are plain links, so each page loads fresh and its effects start from the top.
- The 3D on inner pages is CSS 3D (no WebGL needed), so it also runs on phones. Effects pause off screen, and
  "reduce motion" settings turn the movement off.
- The homepage's 3D library (A-Frame, about 1.3 MB) loads after the page has finished loading, so it never holds
  up the text, photos or effects; visitors with Data Saver on, or on 2G, keep the still picture.
- Photos are served as the files in `public/images` (a static export has no image optimiser), and Google maps
  load only as you scroll near them.
