import type { ServiceSlug } from "@/shared/config";
import type { ImageAsset, VideoAsset } from "@/shared/types/media";

/** A delivered or ongoing FMECC project (planning/ARCHITECTURE.md §7). Optional facts stay empty rather than guessed. */
export interface Project {
  slug: string;
  title: string;
  services: ServiceSlug[];
  status: "completed" | "ongoing";
  location?: string;
  year?: number;
  client?: string;
  summary: string;
  scope: string[];
  body?: string[];
  hero: ImageAsset;
  gallery: ImageAsset[];
  video?: VideoAsset;
  featured?: boolean;
  /** Development sample: shows a "Sample" badge and must be removed before launch. */
  placeholder?: true;
  seo?: { title?: string; description?: string };
}
