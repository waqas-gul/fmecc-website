import { SERVICE_SLUGS, serviceNav, type ServiceSlug } from "@/shared/config";
import type { ProjectConcept } from "@/entities/concept";
import type { Project } from "@/entities/project";

/** Query parameter mirrored by the filter; service pages deep-link with it (planning/MASTER_PLAN.md §6). */
export const SERVICE_PARAM = "service";

/** One filter chip: a service and how many entries list it. Plain data, so it can cross into the client island. */
export interface ServiceOption {
  slug: ServiceSlug;
  label: string;
  count: number;
}

/**
 * What the filter browses: verified projects, or, while there are none, the illustrative concepts.
 * Plain data either way, so it can cross into the client island.
 */
export type Portfolio = { kind: "projects"; items: Project[] } | { kind: "concepts"; items: ProjectConcept[] };

/** Services listed by each entry, in portfolio order. */
export const portfolioServices = (portfolio: Portfolio): ServiceSlug[][] =>
  portfolio.kind === "projects"
    ? portfolio.items.map((project) => project.services)
    : portfolio.items.map((concept) => [concept.service]);

export function serviceOptions(portfolio: Portfolio): ServiceOption[] {
  const lists = portfolioServices(portfolio);
  return serviceNav.map(({ slug, label }) => ({
    slug,
    label,
    count: lists.filter((services) => services.includes(slug)).length,
  }));
}

/** Missing or unknown values select "All". */
export function parseService(value: string | null): ServiceSlug | null {
  return SERVICE_SLUGS.find((slug) => slug === value) ?? null;
}
