import type { ServiceSlug } from "@/shared/config";
import type { ImageAsset } from "@/shared/types/media";

/**
 * An illustrative project concept: a hypothetical scope for one service, shown while FMECC has no
 * verified projects. It is never a delivered project, so it has no client, location, date or status.
 */
export interface ProjectConcept {
  slug: string;
  title: string;
  service: ServiceSlug;
  /** One sentence for cards and the detail page lede. */
  summary: string;
  overview: string[];
  /** Hypothetical scope items. */
  scope: string[];
  /** 16:9; licensed stock photography or a project-owned 3D illustration. */
  hero: ImageAsset;
  gallery: ImageAsset[];
}
