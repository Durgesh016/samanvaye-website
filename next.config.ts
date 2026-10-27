import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Static export: `npm run build` writes the whole site as plain files to out/, for any web host. */
  output: "export",
  /* A-Frame ships as an ES module that imports "three"; let Next compile it for the browser. */
  transpilePackages: ["aframe"],
  images: {
    /* A static site has no image optimizer: photos are served as the files in public/images. */
    unoptimized: true,
    /* Inner-page photos are copied into public/images/site by scripts/fetch-photos.mjs. Until a photo
       has been copied, it is shown from the WordPress uploads folder on samanvaye.org. */
    remotePatterns: [new URL("https://samanvaye.org/wp-content/uploads/**")],
  },
};

export default nextConfig;
