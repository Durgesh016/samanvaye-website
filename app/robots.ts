import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/* written to out/robots.txt at build time (static export) */
export const dynamic = "force-static";

/** /robots.txt: every page may be crawled; points search engines at the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE_URL}/sitemap.xml` };
}
