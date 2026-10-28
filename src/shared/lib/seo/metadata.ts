import type { Metadata } from "next";

import { brandLogo, site } from "@/shared/config";
import type { ImageAsset } from "@/shared/types/media";

import { withTrailingSlash } from "./url";

/**
 * The site-wide share image (src/app/opengraph-image.png, generated with the logo by `npm run images`).
 * A page that sets `openGraph` replaces the layout's completely, image included, so every page
 * without a real image of its own names this one explicitly.
 */
const siteImage = brandLogo ? { url: "/opengraph-image.png", width: 1200, height: 630, alt: site.legalName } : undefined;

/** Page metadata with canonical URL, Open Graph and Twitter card (planning/MASTER_PLAN.md §8). */
export function buildMetadata(input: { title: string; description: string; path: string; image?: ImageAsset }): Metadata {
  const { title, description, image } = input;
  const url = withTrailingSlash(input.path);
  const own = image && !image.placeholder ? { url: image.src, width: image.width, height: image.height, alt: image.alt } : siteImage;
  const images = own ? [own] : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: site.legalName,
      locale: "en",
      ...(images && { images }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images && { images: images.map((entry) => entry.url) }),
    },
  };
}
