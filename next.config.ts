import { existsSync, readFileSync } from "node:fs";
import type { NextConfig } from "next";

// Static export for any static host (planning/ARCHITECTURE.md §10).
// `cacheComponents` and `partialPrefetching` stay off: they fail in export mode.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  typedRoutes: true,
  reactStrictMode: true,
  images: {
    loader: "custom",
    loaderFile: "./src/shared/lib/media/image-loader.ts",
    deviceSizes: [640, 960, 1280, 1600, 1920],
    imageSizes: [320, 480],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// One notice per run for assets and settings FMECC still has to supply.
if (!process.env.FMECC_NOTICES_SHOWN) {
  process.env.FMECC_NOTICES_SHOWN = "1";
  const brandAssets = JSON.parse(readFileSync("src/shared/config/brand-assets.json", "utf8"));
  if (!existsSync("public/images/brand/logo.png")) {
    console.warn("[fmecc] public/images/brand/logo.png is missing: header and footer render the temporary text logo.");
  } else if (!brandAssets.logo) {
    console.warn("[fmecc] logo.png was added but brand assets are stale: run `npm run images`.");
  }
  if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SITE_URL) {
    console.warn("[fmecc] NEXT_PUBLIC_SITE_URL is not set: canonical URLs, Open Graph and the sitemap use http://localhost:3000.");
  }
}

export default nextConfig;
