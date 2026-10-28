import { Suspense } from "react";

import type { ProjectConcept } from "@/entities/concept";
import type { Project } from "@/entities/project";

import { serviceOptions, type Portfolio } from "../lib/filter";
import { PortfolioInProgress } from "./PortfolioInProgress";
import { ProjectFilterClient } from "./ProjectFilterClient";
import { ProjectFilterView } from "./ProjectFilterView";

/**
 * Project browser for /projects/ (planning/MASTER_PLAN.md §6): service chips, result count and
 * grid, mirrored in `?service=`. Real projects always win; without them the same browser shows the
 * illustrative concepts, and with neither it shows the "portfolio in progress" state. The
 * prerendered HTML is the "All" view, used as the Suspense fallback that useSearchParams needs in a
 * static export, so the page is complete before JavaScript runs.
 */
export function ProjectFilter({ projects, concepts = [] }: { projects: Project[]; concepts?: readonly ProjectConcept[] }) {
  if (projects.length === 0 && concepts.length === 0) return <PortfolioInProgress />;

  const portfolio: Portfolio =
    projects.length > 0 ? { kind: "projects", items: projects } : { kind: "concepts", items: [...concepts] };
  const options = serviceOptions(portfolio);
  return (
    <Suspense fallback={<ProjectFilterView portfolio={portfolio} options={options} active={null} />}>
      <ProjectFilterClient portfolio={portfolio} options={options} />
    </Suspense>
  );
}
