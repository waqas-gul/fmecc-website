import type { MetadataRoute } from "next";

import { projects } from "@/entities/project";
import { routes, SERVICE_SLUGS } from "@/shared/config";
import { absoluteUrl } from "@/shared/lib/seo";

// Required for metadata routes in static export (planning/ARCHITECTURE.md §10).
export const dynamic = "force-static";

/** Every route in the sitemap of planning/MASTER_PLAN.md §3, plus one entry per project. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const paths = [
    routes.home,
    routes.services,
    ...SERVICE_SLUGS.map(routes.service),
    routes.projects,
    ...projects.map((project) => routes.project(project.slug)),
    routes.about,
    routes.contact,
  ];

  return paths.map((path) => ({ url: absoluteUrl(path), lastModified }));
}
