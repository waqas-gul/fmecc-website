import type { Route } from "next";

export const SERVICE_SLUGS = [
  "building-construction",
  "telecom-tower-rollout",
  "security-systems",
  "hydraulic-parking-bollards",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

// Typed routes only know pages that exist. Most pages are built by other workstreams,
// so every route string is declared here once and cast, as the typed-routes docs advise.
const route = (path: string) => path as Route;

/** The only place route strings are written. Next adds trailing slashes when rendering links. */
export const routes = {
  home: "/" as Route,
  about: route("/about"),
  services: route("/services"),
  projects: route("/projects"),
  contact: route("/contact"),
  service: (slug: ServiceSlug) => route(`/services/${slug}`),
  project: (slug: string) => route(`/projects/${slug}`),
  quote: (service?: ServiceSlug) => route(service ? `/contact?service=${service}#quote` : "/contact#quote"),
};
