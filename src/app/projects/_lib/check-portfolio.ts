import { existsSync } from "node:fs";
import { join } from "node:path";

import type { Project } from "@/entities/project";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Build-time checks for src/entities/project/data/projects.ts, run by /projects/ on every build.
 * A failure stops `npm run build` with a list of fixes instead of shipping a duplicate URL, an
 * image without alt text, or cards that link to detail pages that were never generated.
 */
export function checkPortfolio(projects: readonly Project[]): void {
  const problems: string[] = [];
  const slugs = new Set<string>();

  for (const project of projects) {
    const name = `"${project.slug}"`;
    if (!SLUG.test(project.slug)) problems.push(`${name}: the slug must be lowercase kebab-case.`);
    if (slugs.has(project.slug)) problems.push(`${name}: the slug is used by more than one project.`);
    slugs.add(project.slug);
    if (project.services.length === 0) problems.push(`${name}: list at least one service.`);
    for (const image of [project.hero, ...project.gallery, ...(project.video ? [project.video.poster] : [])]) {
      if (!image.alt.trim()) problems.push(`${name}: ${image.src} needs alt text.`);
    }
  }

  // Static export cannot build a dynamic route without params, so the detail route stays in the
  // private folder _detail/ until the first project exists (see _detail/page.tsx).
  const detailRouteActive = existsSync(join(process.cwd(), "src", "app", "projects", "[slug]", "page.tsx"));
  if (projects.length > 0 && !detailRouteActive) {
    problems.push(`project detail pages are not active. Run: git mv src/app/projects/_detail "src/app/projects/[slug]"`);
  }

  if (problems.length > 0) {
    throw new Error(`[projects] The portfolio cannot be built:\n  - ${problems.join("\n  - ")}`);
  }
}
