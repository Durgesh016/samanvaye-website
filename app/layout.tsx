import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { JsonLd } from "@/components/JsonLd";
import { SiteEffects } from "@/components/SiteEffects";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { content } from "@/lib/content";
import { SHARE_IMAGE, SITE_NAME, SITE_URL, TITLE_SUFFIX, siteJsonLd } from "@/lib/seo";
import "./globals.css";
import "./pages.css";

/* Fonts are bundled with the project (Josefin Sans for headings, Nunito Sans for text). */
const josefin = localFont({
  src: [
    { path: "./fonts/josefin-sans-300.woff2", weight: "300", style: "normal" },
    { path: "./fonts/josefin-sans-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/josefin-sans-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/josefin-sans-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-josefin",
  display: "swap",
});

const nunito = localFont({
  src: [
    { path: "./fonts/nunito-sans-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/nunito-sans-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/nunito-sans-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-nunito",
  display: "swap",
});

/* Defaults for every page; each page adds its own title, description, address and photo with pageMeta (lib/seo.ts). */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s${TITLE_SUFFIX}` },
  description: content.hero.text,
  openGraph: { siteName: SITE_NAME, locale: "en_IN", type: "website", images: [SHARE_IMAGE] },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0B1033",
};

/** Every page shares the night sky, the header and the footer. */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${josefin.variable} ${nunito.variable}`}>
      <body className="c-constellation">
        <a className="skip" href="#main">
          Skip to content
        </a>
        {/* twinkling starfield painted behind the whole page */}
        <canvas className="cn-sky" aria-hidden="true"></canvas>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <SiteEffects />
        <JsonLd data={siteJsonLd()} />
      </body>
    </html>
  );
}
