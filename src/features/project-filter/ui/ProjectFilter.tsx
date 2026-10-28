import { Suspense } from "react";

import type { Project } from "@/entities/project";

import { serviceOptions } from "../lib/filter";
import { PortfolioInProgress } from "./PortfolioInProgress";
import { ProjectFilterClient } from "./ProjectFilterClient";
import { ProjectFilterView } from "./ProjectFilterView";

/**
 * Project browser for /projects/ (planning/MASTER_PLAN.md §6): service chips, result count and
 * grid, mirrored in `?service=`. The prerendered HTML is the "All" view, used as the Suspense
 * fallback that useSearchParams needs in a static export, so the page is complete before
 * JavaScript runs. With no projects it shows the "portfolio in progress" state instead.
 */
export function ProjectFilter({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return <PortfolioInProgress />;

  const options = serviceOptions(projects);
  return (
    <Suspense fallback={<ProjectFilterView projects={projects} options={options} active={null} />}>
      <ProjectFilterClient projects={projects} options={options} />
    </Suspense>
  );
}
