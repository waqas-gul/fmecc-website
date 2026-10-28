import type { Project } from "../model/types";

/**
 * Published projects, in display order (planning/MASTER_PLAN.md §6, §13).
 *
 * Empty on purpose: FMECC has not supplied verified project records yet. Never invent projects,
 * clients, locations, dates, figures or photos; optional facts are left out rather than guessed.
 * While the list is empty, /projects/ shows the "portfolio in progress" state and no detail pages exist.
 *
 * Adding a project
 * 1. Put originals in media-src/projects/<slug>/ (hero ≥ 1920 × 1080, 4–8 gallery images) and run
 *    `npm run images`; reference them as `/images/projects/<slug>/<name>.webp` with width, height and alt.
 * 2. Add the record below. `slug` is unique lowercase kebab-case and becomes /projects/<slug>/.
 *    `location`, `year`, `client`, `body`, `video` and `seo` are set only when FMECC has confirmed them.
 * 3. Activate the detail route: git mv src/app/projects/_detail "src/app/projects/[slug]".
 *    `npm run build` stops with this instruction if it is missed (src/app/projects/_lib/check-portfolio.ts).
 *
 * Development samples must carry `placeholder: true`: they show a "Sample" badge and must be removed before launch.
 */
export const projectData: readonly Project[] = [];
