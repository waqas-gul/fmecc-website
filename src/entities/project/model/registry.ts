import type { ServiceSlug } from "@/shared/config";

import { projectData } from "../data/projects";

import type { Project } from "./types";

export const projects: readonly Project[] = projectData;

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getProjectsByService(slug: ServiceSlug, limit?: number): Project[] {
  const matches = projects.filter((project) => project.services.includes(slug));
  return limit === undefined ? matches : matches.slice(0, limit);
}

export function getFeaturedProjects(limit?: number): Project[] {
  const featured = projects.filter((project) => project.featured);
  return limit === undefined ? featured : featured.slice(0, limit);
}
