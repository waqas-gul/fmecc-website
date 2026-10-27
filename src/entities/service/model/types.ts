import type { LucideIcon } from "lucide-react";

import type { ServiceSlug } from "@/shared/config";
import type { ImageAsset, VideoAsset } from "@/shared/types/media";

export type { ServiceSlug };

export type ShowcaseKey = "building" | "tower" | "coverage" | "bollard";

/**
 * One of FMECC's four services (planning/ARCHITECTURE.md §7).
 * Holds a component (`icon`), so pass plain fields, not whole Service objects, into client components.
 */
export interface Service {
  slug: ServiceSlug;
  index: 1 | 2 | 3 | 4;
  name: string;
  shortName: string;
  tagline: string;
  summary: string;
  icon: LucideIcon;
  hero: ImageAsset;
  video?: VideoAsset;
  /** 4:5 image for the Home services switcher. */
  showcaseMedia: ImageAsset;
  audiences: string[];
  scope: { icon?: LucideIcon; title: string; description: string }[];
  process: { title: string; description: string }[];
  deliverables?: string[];
  maintenance?: string;
  faq: { question: string; answer: string }[];
  gallery: ImageAsset[];
  showcase: ShowcaseKey;
  seo: { title: string; description: string };
}
