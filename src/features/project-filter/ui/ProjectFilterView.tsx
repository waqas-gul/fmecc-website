import { ArrowRight } from "lucide-react";

import { routes, type ServiceSlug } from "@/shared/config";
import { cn } from "@/shared/lib/utils";
import { Button, LinkButton, Reveal, VisuallyHidden } from "@/shared/ui";
import { ConceptCard } from "@/entities/concept";
import { ProjectCard } from "@/entities/project";

import { portfolioServices, type Portfolio, type ServiceOption } from "../lib/filter";

const HEADING_ID = "project-filter-heading";
const RESULTS_ID = "project-filter-results";

const nouns = { projects: ["project", "projects"], concepts: ["concept", "concepts"] } as const;

// Three columns of project cards; the larger concept cards sit two to a row.
const layouts = {
  projects: { columns: 3, grid: "grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8" },
  concepts: { columns: 2, grid: "grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:gap-x-8 lg:gap-y-20" },
} as const;

/**
 * Chips, result count and grid. Hook-free on purpose: the server renders it as the Suspense
 * fallback (the "All" view, chips inert until hydration) and the client island renders it with
 * state, so both produce the same markup. Cards first reveal row by row as they scroll in; after a
 * filter change the new set rises in sequence.
 */
export function ProjectFilterView({
  portfolio,
  options,
  active,
  animate = false,
  onSelect,
  onShowAll,
  allChipRef,
}: {
  portfolio: Portfolio;
  options: ServiceOption[];
  active: ServiceSlug | null;
  /** Replays the entrance animation; only after the visitor changes the filter. */
  animate?: boolean;
  onSelect?: (service: ServiceSlug | null) => void;
  onShowAll?: () => void;
  allChipRef?: React.Ref<HTMLButtonElement>;
}) {
  const [one, many] = nouns[portfolio.kind];
  const layout = layouts[portfolio.kind];
  const lists = portfolioServices(portfolio);
  const entries =
    portfolio.kind === "projects"
      ? portfolio.items.map((project, index) => ({
          key: project.slug,
          services: lists[index],
          card: <ProjectCard project={project} className="w-full" />,
        }))
      : portfolio.items.map((concept, index) => ({
          key: concept.slug,
          services: lists[index],
          card: <ConceptCard concept={concept} className="w-full" />,
        }));

  const activeOption = options.find((option) => option.slug === active);
  const visible = active ? entries.filter((entry) => entry.services.includes(active)) : entries;
  const total = entries.length;
  const status = activeOption
    ? `Showing ${visible.length} of ${total} ${total === 1 ? one : many} in ${activeOption.label}`
    : `Showing ${total === 1 ? `1 ${one}` : `all ${total} ${many}`}`;

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
              count={total}
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
          <ul key={active ?? "all"} className={layout.grid}>
            {visible.map((entry, index) =>
              animate ? (
                <li
                  key={entry.key}
                  className="flex motion-safe:animate-rise"
                  style={{ animationDelay: `${Math.min(index, 5) * 60}ms` }}
                >
                  {entry.card}
                </li>
              ) : (
                <Reveal
                  as="li"
                  key={entry.key}
                  variant="media-scale"
                  delay={(index % layout.columns) * 0.08}
                  className="flex"
                >
                  {entry.card}
                </Reveal>
              ),
            )}
          </ul>
        ) : (
          activeOption && (
            <FilterEmptyState option={activeOption} noun={many} onShowAll={onShowAll} />
          )
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

function FilterEmptyState({
  option,
  noun,
  onShowAll,
}: {
  option: ServiceOption;
  noun: string;
  onShowAll?: () => void;
}) {
  return (
    <div className="flex flex-col gap-8 rounded-md border border-dashed border-line-strong px-6 py-12 sm:px-10 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:py-16">
      <div className="max-w-[52ch]">
        <p className="type-label text-highlight">{option.label}</p>
        <h3 className="mt-5 font-display text-heading-md font-semibold">No {noun} published in this service yet.</h3>
        <p className="mt-4 text-ink-muted">
          Entries appear here once their facts and imagery are confirmed. Show everything, or read what this service
          covers.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 lg:shrink-0">
        <Button variant="outline" onClick={onShowAll}>
          Show all {noun}
        </Button>
        <LinkButton href={routes.service(option.slug)} variant="link" icon={<ArrowRight />} className="min-h-11">
          Explore the service<VisuallyHidden>: {option.label}</VisuallyHidden>
        </LinkButton>
      </div>
    </div>
  );
}
