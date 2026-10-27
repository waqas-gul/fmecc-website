import type { ImageAsset } from "@/shared/types/media";

import brandAssets from "./brand-assets.json";

export type BrandLogoAsset = ImageAsset & { src: `/images/brand/${string}` };

// brand-assets.json is written by `npm run images` from public/images/brand/logo.png.
const generated = brandAssets.logo as { src: `/images/brand/${string}`; width: number; height: number } | null;

/** FMECC's logo lockup, or `null` until the logo file exists; the UI then shows a temporary text logo. */
export const brandLogo: BrandLogoAsset | null = generated
  ? { ...generated, alt: "Future Middle East Construction Company" }
  : null;
