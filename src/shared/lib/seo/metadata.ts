import type { Metadata } from "next";

import { site } from "@/shared/config";
import type { ImageAsset } from "@/shared/types/media";

import { withTrailingSlash } from "./url";

/** Page metadata with canonical URL, Open Graph and Twitter card (planning/MASTER_PLAN.md §8). */
export function buildMetadata(input: { title: string; description: string; path: string; image?: ImageAsset }): Metadata {
  const { title, description, image } = input;
  const url = withTrailingSlash(input.path);
  const images =
    image && !image.placeholder ? [{ url: image.src, width: image.width, height: image.height, alt: image.alt }] : undefined;

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
