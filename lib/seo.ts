import type { Metadata } from "next";
import { content } from "@/lib/content";
import { images } from "@/lib/images";
import { about } from "@/lib/site/data";
import { photoUrl, type SitePic } from "@/lib/site/photo";

/**
 * Search and share tags for every page. Server-only (photoUrl reads the disk).
 * SITE_URL is the address search engines should list; set the SITE_URL environment variable to use another one.
 */
export const SITE_URL = (process.env.SITE_URL ?? "https://samanvaye.org").replace(/\/$/, "");
export const SITE_NAME = "Samanvaye Foundation";
export const TITLE_SUFFIX = ` | ${SITE_NAME}`;

/**
 * Link previews (WhatsApp, Facebook, X) show the page's photo as a 1200×630 JPEG made by app/og/[...path]/route.ts,
 * from any photo under public/images. Full-size photos are often over 300 KB, which WhatsApp does not show.
 */
const shareImage = (file: string, alt: string) => ({ url: `/og/${file}`, width: 1200, height: 630, alt, type: "image/jpeg" });

/** The picture shown when a page is shared and has no photo of its own (the homepage hero). */
export const SHARE_IMAGE = shareImage(images.hero1.src.replace("/images/", ""), images.hero1.alt);

const ORG = { "@type": "NGO", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL };

type PageSeo = {
  title: string;
  description: string;
  /** The page's address, e.g. "/about-us". */
  path: string;
  /** A photo from lib/site/data (WordPress upload path) to show when the page is shared. */
  image?: SitePic;
  /** Blog posts are shared as articles with their publish time (see publishedAt). */
  published?: string;
};

/** Title, description, canonical address, and the Open Graph and X (Twitter) cards for one page. */
export function pageMeta({ title, description, path, image, published }: PageSeo): Metadata {
  const text = clip(description);
  const pic = image ? shareImage(`site/${image.src}`, image.alt ?? title) : SHARE_IMAGE;
  const og = { title, description: text, url: path, siteName: SITE_NAME, locale: "en_IN", images: [pic] };
  return {
    /* Google shows about 60 characters of a title: a long one is kept whole, without the site name after it */
    title: title.length + TITLE_SUFFIX.length > 60 ? { absolute: title } : title,
    description: text,
    alternates: { canonical: path },
    openGraph: published ? { ...og, type: "article", publishedTime: published } : { ...og, type: "website" },
    twitter: { card: "summary_large_image", title, description: text, images: [pic] },
  };
}

/* a full stop after one of these is part of a name ("Dr. James"), not the end of a sentence */
const TITLES = /^(Dr|Mr|Mrs|Ms|Smt|Sri|Prof|St)$/;

/** Search results show about 160 characters: longer text ends at a full stop when one is near, else at a word. */
function clip(text: string, max = 160) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  let end = -1;
  for (const m of cut.matchAll(/(\S+)\. /g)) if (m.index + m[1].length >= 100 && !TITLES.test(m[1])) end = m.index + m[1].length;
  if (end > 0) return cut.slice(0, end + 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:.—–-]+$/, "") + "…";
}

/** "2026-09-07" + "2:00 pm" → "2026-09-07T14:00:00+05:30" (the posts are published in India). */
export function publishedAt(iso: string, time: string) {
  const m = time.match(/(\d{1,2}):(\d{2})\s*([ap])m/i);
  if (!m) return iso;
  const hour = (Number(m[1]) % 12) + (m[3].toLowerCase() === "p" ? 12 : 0);
  return `${iso}T${String(hour).padStart(2, "0")}:${m[2]}:00+05:30`;
}

/** A photo URL that may be relative to the site ("/images/…") as a full address. */
export const absolute = (url: string) => new URL(url, SITE_URL).href;

/** schema.org data for the whole site: the foundation (address, contacts, social profiles) and the website. */
export function siteJsonLd() {
  const { footer, topbar } = content;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...ORG,
        logo: absolute("/images/mark.png"),
        image: absolute(images.hero1.src),
        description: about.hero.sub,
        email: footer.email,
        telephone: footer.phones.map((p) => p.label),
        /* the footer address, split into its parts */
        address: {
          "@type": "PostalAddress",
          streetAddress: "NO.24-1-86/3, Weavers Colony, Revenue Ward No.12",
          addressLocality: "Rajahmundry",
          addressRegion: "Andhra Pradesh",
          postalCode: "533101",
          addressCountry: "IN",
        },
        sameAs: [...new Set(topbar.social.map((s) => s.href))],
      },
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: SITE_NAME, inLanguage: "en", publisher: { "@id": ORG["@id"] } },
    ],
  };
}

/** schema.org data for a blog post, with the Home › Blogs › post breadcrumb trail. */
export function postJsonLd(post: { slug: string; title: string; iso: string; time: string; featured: SitePic }, description: string) {
  const url = `${SITE_URL}/${post.slug}`;
  const date = publishedAt(post.iso, post.time);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: clip(description),
        image: absolute(photoUrl(post.featured.src)),
        datePublished: date,
        dateModified: date,
        inLanguage: "en",
        author: ORG,
        publisher: { ...ORG, logo: absolute("/images/mark.png") },
        mainEntityOfPage: url,
        url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blogs", item: `${SITE_URL}/blogs` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };
}
