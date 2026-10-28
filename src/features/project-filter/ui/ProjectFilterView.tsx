import { ArrowRight } from "lucide-react";

import { routes, type ServiceSlug } from "@/shared/config";
import { cn } from "@/shared/lib/utils";
import { Button, LinkButton, VisuallyHidden } from "@/shared/ui";
import { ProjectCard, type Project } from "@/entities/project";

import type { ServiceOption } from "../lib/filter";

const HEADING_ID = "project-filter-heading";
const RESULTS_ID = "project-filter-results";

const countLabel = (count: number) => `${count} ${count === 1 ? "project" : "projects"}`;

/**
 * Chips, result count and grid. Hook-free on purpose: the server renders it as the Suspense
 * fallback (the "All" view, chips inert until hydration) and the client island renders it with
 * state, so both produce the same markup.
 */
export function ProjectFilterView({
  projects,
  options,
  active,
  animate = false,
  onSelect,
  onShowAll,
  allChipRef,
}: {
  projects: Project[];
  options: ServiceOption[];
  active: ServiceSlug | null;
  /** Replays the entrance animation; only after the visitor changes the filter. */
  animate?: boolean;
  onSelect?: (service: ServiceSlug | null) => void;
  onShowAll?: () => void;
  allChipRef?: React.Ref<HTMLButtonElement>;
}) {
  const activeOption = options.find((option) => option.slug === active);
  const visible = active ? projects.filter((project) => project.services.includes(active)) : projects;
  const status = activeOption
    ? `Showing ${visible.length} of ${countLabel(projects.length)} in ${activeOption.label}`
    : `Showing ${projects.length === 1 ? "1 project" : `all ${projects.length} projects`}`;

  return (
    <div className="flex flex-col gap-10 lg:gap-14">
      <div className="flex flex-col gap-6 border-b border-line pb-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <div className="flex flex-col gap-5">
          <h2 id={HEADING_ID} className="type-label flex items-center gap-3 text-ink-muted">
            <span aria-hidden className="h-px w-6 shrink-0 bg-highlight" />
            Filter by service
          </h2>
          <div role="group" aria-labelledby={HEADING_ID} className="flex flex-wrap gap-2">
            <FilterChip
              ref={allChipRef}
              label="All"
              count={projects.length}
              pressed={active === null}
              onClick={onSelect && (() => onSelect(null))}
            />
            {options.map((option) => (
              <FilterChip
                key={option.slug}
                label={option.label}
                count={option.count}
                pressed={active === option.slug}
                onClick={onSelect && (() => onSelect(option.slug))}
              />
            ))}
          </div>
        </div>
        <p role="status" className="shrink-0 text-body-sm text-ink-muted tabular-nums">
          {status}
        </p>
      </div>

      <div id={RESULTS_ID}>
        {visible.length > 0 ? (
          <ul key={active ?? "all"} className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
            {visible.map((project, index) => (
              <li
                key={project.slug}
                className={cn("flex", animate && "motion-safe:animate-rise")}
                style={animate ? { animationDelay: `${Math.min(index, 5) * 60}ms` } : undefined}
              >
                <ProjectCard project={project} className="w-full" />
              </li>
            ))}
          </ul>
        ) : (
          activeOption && <FilterEmptyState option={activeOption} onShowAll={onShowAll} />
        )}
      </div>
    </div>
  );
}

/** Pill toggle; the pressed chip is the page's spectrum accent (planning/DESIGN.md §2.2, §2.4). */
function FilterChip({
  ref,
  label,
  count,
  pressed,
  onClick,
}: {
  ref?: React.Ref<HTMLButtonElement>;
  label: string;
  count: number;
  pressed: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={pressed}
      aria-controls={RESULTS_ID}
      onClick={onClick}
      className={cn(
        "group/chip inline-flex min-h-11 rounded-full p-px transition-colors duration-150 ease-standard",
        pressed ? "spectrum-fill" : "bg-line-strong hover:bg-ink",
      )}
    >
      <span
        className={cn(
          "type-label inline-flex items-center gap-2.5 rounded-full px-4 transition-colors duration-150 ease-standard",
          pressed ? "bg-surface-inverse text-ink-inverse" : "bg-surface text-ink-muted group-hover/chip:text-ink",
        )}
      >
        {label}
        <span className={cn("tabular-nums", pressed ? "text-ink-inverse/70" : "text-ink-subtle")}>{count}</span>
      </span>
    </button>
  );
}

function FilterEmptyState({ option, onShowAll }: { option: ServiceOption; onShowAll?: () => void }) {
  return (
    <div className="flex flex-col gap-8 rounded-md border border-dashed border-line-strong px-6 py-12 sm:px-10 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:py-16">
      <div className="max-w-[52ch]">
        <p className="type-label text-highlight">{option.label}</p>
        {/* TODO(content): confirm the empty-state wording with FMECC. */}
        <h3 className="mt-5 font-display text-heading-md font-semibold">No projects published in this service yet.</h3>
        <p className="mt-4 text-ink-muted">
          Case studies appear here once their facts and imagery are confirmed. Show every project, or read what this
          service covers.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 lg:shrink-0">
        <Button variant="outline" onClick={onShowAll}>
          Show all projects
        </Button>
        <LinkButton href={routes.service(option.slug)} variant="link" icon={<ArrowRight />} className="min-h-11">
          Explore the service<VisuallyHidden>: {option.label}</VisuallyHidden>
        </LinkButton>
      </div>
    </div>
  );
}
