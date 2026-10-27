import type { ImageAsset } from "@/shared/types/media";

const RATIOS = {
  "16:9": [1600, 900],
  "4:3": [1600, 1200],
  "3:2": [1500, 1000],
  "4:5": [1200, 1500],
} as const;

/**
 * Stand-in for media FMECC has not supplied yet. `MediaImage` renders it as a labelled panel,
 * so no file is requested. Flagged `placeholder: true` so it cannot ship unnoticed.
 */
export const placeholderImage = (label: string, ratio: keyof typeof RATIOS): ImageAsset => {
  const [width, height] = RATIOS[ratio];
  return {
    src: `/images/placeholders/${ratio.replace(":", "x")}.webp`,
    width,
    height,
    alt: label,
    placeholder: true,
  };
};
