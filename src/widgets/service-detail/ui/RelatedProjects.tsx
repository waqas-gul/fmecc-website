import { ArrowRight } from "lucide-react";

import type { Project } from "@/entities/project";
import { ProjectCard } from "@/entities/project";
import type { Service } from "@/entities/service";
import { routes } from "@/shared/config";
import { LinkButton, Section, SectionHeader } from "@/shared/ui";

/**
 * Service page section 6 (planning/DESIGN.md §9.1): up to three projects for the service.
 * Renders nothing until real (or flagged sample) projects exist for it.
 */
export function RelatedProjects({ service, projects }: { service: Service; projects: Project[] }) {
  const related = projects.filter((project) => project.services.includes(service.slug)).slice(0, 3);
  if (related.length === 0) return null;

  return (
    <Section id="projects" scheme="light">
      <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader eyebrow="Projects" title="Related projects" />
        <LinkButton href={routes.projects} variant="link" icon={<ArrowRight />} className="min-h-11">
          All projects
        </LinkButton>
      </div>

      <ul className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
        {related.map((project) => (
          <li key={project.slug}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
