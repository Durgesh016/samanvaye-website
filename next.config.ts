import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* A-Frame ships as an ES module that imports "three"; let Next compile it for the browser. */
  transpilePackages: ["aframe"],
  images: {
    /* Inner-page photos are copied into public/images/site by scripts/fetch-photos.mjs. Until a photo
       has been copied, it is shown from the WordPress uploads folder on samanvaye.org. */
    remotePatterns: [new URL("https://samanvaye.org/wp-content/uploads/**")],
    /* Photo widths the browser can choose from. Starting at 384 lets ~300–380px slots (cards, gallery wall)
       get a 384px file instead of 640px; photos are at most 1920px wide, so nothing larger is offered. */
    deviceSizes: [384, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 96, 128, 256],
  },
  /* Addresses of the old WordPress site that have no page here move permanently to the closest page, so
     search engines carry their ranking over (pages and posts kept their addresses and need nothing). */
  async redirects() {
    return [
      { source: "/home-2", destination: "/", permanent: true },
      { source: "/sample-page", destination: "/", permanent: true },
      { source: "/category/:path*", destination: "/blogs", permanent: true },
      { source: "/tag/:path*", destination: "/blogs", permanent: true },
      { source: "/author/:path*", destination: "/blogs", permanent: true },
      { source: "/feed", destination: "/blogs", permanent: true },
      { source: "/donations/:path*", destination: "/donation", permanent: true },
      { source: "/donation-confirmation", destination: "/donation", permanent: true },
      { source: "/donation-failed", destination: "/donation", permanent: true },
      { source: "/donor-dashboard", destination: "/donation", permanent: true },
      { source: "/metform-form/:path*", destination: "/contact-us", permanent: true },
      { source: "/wp-sitemap:rest(.*)", destination: "/sitemap.xml", permanent: true },
      /* photos found in Google Images or linked from other sites; they live under public/images/site */
      { source: "/wp-content/uploads/:path*", destination: "/images/site/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
