import { ViewTransition } from "react";
import { ArrowRight } from "lucide-react";

import { routes, type ServiceSlug } from "@/shared/config";
import { cn } from "@/shared/lib/utils";
import { Button, LinkButton, Reveal, VisuallyHidden } from "@/shared/ui";
import { ConceptFeature } from "@/entities/concept";
import { ProjectCard } from "@/entities/project";

import { portfolioServices, type Portfolio, type ServiceOption } from "../lib/filter";

const LABEL_ID = "project-filter-label";
const RESULTS_ID = "project-filter-results";

const nouns = { projects: ["project", "projects"], concepts: ["concept", "concepts"] } as const;
const headings = { projects: "Projects", concepts: "Illustrative concepts" } as const;

// Project cards sit three to a row; concepts are full-width editorial features, one after another.
const layouts = {
  projects: "grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8",
  concepts: "flex flex-col gap-y-28 sm:gap-y-36 lg:gap-y-48",
} as const;

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Filter bar, result count and results. Hook-free on purpose: the server renders it as the Suspense
 * fallback (the "All" view, filters inert until hydration) and the client island renders it with
 * state, so both produce the same markup. Without JavaScript the filter bar is hidden (it could not
 * work) and every entry shows. Entries reveal as they scroll in. With `transitions`, a filter change
 * is a React view transition: the previous set lifts away, the new set rises in and the indicator
 * slides to the pressed filter; it stays off until the visitor first filters, so hydration never animates.
 */
export function ProjectFilterView({
  portfolio,
  options,
  active,
  transitions = false,
  onSelect,
  onShowAll,
  allChipRef,
}: {
  portfolio: Portfolio;
  options: ServiceOption[];
  active: ServiceSlug | null;
  transitions?: boolean;
  onSelect?: (service: ServiceSlug | null) => void;
  onShowAll?: () => void;
  allChipRef?: React.Ref<HTMLButtonElement>;
}) {
  const [one, many] = nouns[portfolio.kind];
  const lists = portfolioServices(portfolio);
  const entries =
    portfolio.kind === "projects"
      ? portfolio.items.map((project, index) => ({
          key: project.slug,
          services: lists[index],
          card: (
            <Reveal variant="media-scale" delay={(index % 3) * 0.08} className="flex w-full">
              <ProjectCard project={project} className="w-full" />
            </Reveal>
          ),
        }))
      : portfolio.items.map((concept, index) => ({
          key: concept.slug,
          services: lists[index],
          // Only the client island names the frames for the morph (the fallback is swapped out on hydration).
          card: <ConceptFeature concept={concept} morph={Boolean(onSelect)} />,
        }));

  const activeOption = options.find((option) => option.slug === active);
  const visible = active ? entries.filter((entry) => entry.services.includes(active)) : entries;
  const total = entries.length;
  const status = activeOption
    ? `Showing ${visible.length} of ${total} ${total === 1 ? one : many} in ${activeOption.label}`
    : `Showing ${total === 1 ? `1 ${one}` : `all ${total} ${many}`}`;

  return (
    <div className="flex flex-col gap-16 lg:gap-24">
      <h2 className="sr-only">{headings[portfolio.kind]}</h2>
      <div className="noscript:hidden">
        <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-3">
          <p id={LABEL_ID} className="type-label flex items-center gap-3 text-ink-muted">
            <span aria-hidden className="h-px w-6 shrink-0 bg-highlight" />
            Filter by service
          </p>
          <p role="status" className="type-label text-ink-subtle tabular-nums">
            {status}
          </p>
        </div>
        {/* One row at every width: where the filters do not fit, the bar scrolls sideways (scrollbar
            hidden) and runs to the screen edges, so the cut-off filter reads as more to swipe to. */}
        <div
          role="group"
          aria-labelledby={LABEL_ID}
          className="-mx-(--gutter) mt-4 overflow-x-auto px-(--gutter) [scrollbar-width:none] lg:mt-6 [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex w-max min-w-full gap-x-8 border-b border-line lg:gap-x-10">
            <FilterTab
              ref={allChipRef}
              label="All"
              count={total}
              pressed={active === null}
              transitions={transitions}
              onClick={onSelect && (() => onSelect(null))}
            />
            {options.map((option) => (
              <FilterTab
                key={option.slug}
                label={option.label}
                count={option.count}
                pressed={active === option.slug}
                transitions={transitions}
                onClick={onSelect && (() => onSelect(option.slug))}
              />
            ))}
          </div>
        </div>
      </div>

      <div id={RESULTS_ID}>
        {visible.length > 0 ? (
          <ViewTransition
            key={active ?? "all"}
            enter={transitions ? "filter-enter" : "none"}
            exit={transitions ? "filter-exit" : "none"}
            default="none"
          >
            <ul className={layouts[portfolio.kind]}>
              {visible.map((entry) => (
                <li key={entry.key} className="flex flex-col">
                  {entry.card}
                </li>
              ))}
            </ul>
          </ViewTransition>
        ) : (
          activeOption && <FilterEmptyState option={activeOption} noun={many} onShowAll={onShowAll} />
        )}
      </div>
    </div>
  );
}

/**
 * Text toggle with its count. The pressed filter carries a 2 px spectrum rule, the page's one
 * purple accent (planning/DESIGN.md §2.2, §2.4), which slides between filters on change; the others
 * draw a hairline under the pointer.
 */
function FilterTab({
  ref,
  label,
  count,
  pressed,
  transitions,
  onClick,
}: {
  ref?: React.Ref<HTMLButtonElement>;
  label: string;
  count: number;
  pressed: boolean;
  transitions: boolean;
  onClick?: () => void;
}) {
  // Sits on the group's bottom rule, like a tab underline.
  const indicator = <span aria-hidden className="spectrum-fill absolute inset-x-0 -bottom-px h-0.5" />;

  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={pressed}
      aria-controls={RESULTS_ID}
      onClick={onClick}
      className={cn(
        "group/tab type-label relative inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap transition-colors duration-150 ease-standard lg:min-h-14",
        pressed ? "text-ink" : "text-ink-muted hover:text-ink",
      )}
    >
      {label}
      <span className={cn("tabular-nums", pressed ? "text-highlight" : "text-ink-subtle")}>{pad(count)}</span>
      {pressed ? (
        transitions ? (
          <ViewTransition name="project-filter-indicator" share="filter-indicator" default="none">
            {indicator}
          </ViewTransition>
        ) : (
          indicator
        )
      ) : (
        <span
          aria-hidden
          className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-current transition-[scale] duration-300 ease-out-expo group-hover/tab:scale-x-100"
        />
      )}
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
