import { SERVICE_SLUGS, serviceNav, type ServiceSlug } from "@/shared/config";
import type { Project } from "@/entities/project";

/** Query parameter mirrored by the filter; service pages deep-link with it (planning/MASTER_PLAN.md §6). */
export const SERVICE_PARAM = "service";

/** One filter chip: a service and how many projects list it. Plain data, so it can cross into the client island. */
export interface ServiceOption {
  slug: ServiceSlug;
  label: string;
  count: number;
}

export function serviceOptions(projects: readonly Project[]): ServiceOption[] {
  return serviceNav.map(({ slug, label }) => ({
    slug,
    label,
    count: projects.filter((project) => project.services.includes(slug)).length,
  }));
}

/** Missing or unknown values select "All". */
export function parseService(value: string | null): ServiceSlug | null {
  return SERVICE_SLUGS.find((slug) => slug === value) ?? null;
}
