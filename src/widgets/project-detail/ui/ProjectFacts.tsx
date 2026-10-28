import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { routes, serviceNav } from "@/shared/config";
import { cn } from "@/shared/lib/utils";
import { Badge, LinkButton } from "@/shared/ui";
import type { Project } from "@/entities/project";

const STATUS_LABEL: Record<Project["status"], string> = { completed: "Completed", ongoing: "Ongoing" };

/**
 * Facts sidebar of a project page (planning/DESIGN.md §9.3), sticky beside the narrative from
 * 1024 px. Lists only the facts the record holds, links each service to its page and ends with a
 * quotation link that preselects the project's first service.
 */
export function ProjectFacts({ project }: { project: Project }) {
  const services = serviceNav.filter(({ slug }) => project.services.includes(slug));
  const facts: { term: string; value: string; numeric?: boolean }[] = [
    { term: "Status", value: STATUS_LABEL[project.status] },
  ];
  if (project.location) facts.push({ term: "Location", value: project.location });
  if (project.year) facts.push({ term: "Year", value: String(project.year), numeric: true });
  if (project.client) facts.push({ term: "Client", value: project.client });

  return (
    <aside aria-labelledby="project-facts-heading" className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
      <div className="rounded-md border border-line bg-surface-raised p-6 lg:p-8">
        <div className="flex items-center justify-between gap-4">
          <h2 id="project-facts-heading" className="type-label flex items-center gap-3 text-ink-muted">
            <span aria-hidden className="h-px w-6 shrink-0 bg-highlight" />
            Project facts
          </h2>
          {project.placeholder && <Badge tone="accent">Sample</Badge>}
        </div>

        <dl className="mt-6 grid gap-x-6 sm:grid-cols-2 lg:grid-cols-1">
          <div className="border-t border-line py-4 sm:col-span-2 lg:col-span-1">
            <dt className="type-label text-ink-subtle">{services.length === 1 ? "Service" : "Services"}</dt>
            <dd className="mt-1">
              <ul>
                {services.map(({ slug, label }) => (
                  <li key={slug}>
                    <Link
                      href={routes.service(slug)}
                      className="group flex min-h-11 items-center justify-between gap-3 rounded-sm font-semibold text-accent-text underline-offset-4 hover:underline"
                    >
                      {label}
                      <ArrowRight
                        aria-hidden
                        className="size-4 shrink-0 transition-transform duration-150 motion-safe:group-hover:translate-x-1"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          {facts.map(({ term, value, numeric }) => (
            <div key={term} className="border-t border-line py-4">
              <dt className="type-label text-ink-subtle">{term}</dt>
              <dd className={cn("mt-2 text-ink", numeric && "font-mono tabular-nums")}>{value}</dd>
            </div>
          ))}
        </dl>

        <LinkButton href={routes.quote(project.services[0])} fullWidth icon={<ArrowRight />} className="mt-6">
          Discuss a similar project
        </LinkButton>
      </div>
    </aside>
  );
}
