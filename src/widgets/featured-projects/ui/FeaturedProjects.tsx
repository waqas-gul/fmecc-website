import { ArrowRight } from "lucide-react";

import { routes } from "@/shared/config";
import { Container, LinkButton, Section, SectionHeader } from "@/shared/ui";
import { ProjectCard, type Project } from "@/entities/project";

import { featuredContent } from "../data/content";
import { ProjectRail } from "./ProjectRail";

/**
 * Proof of delivery (planning/DESIGN.md §8, row 5). Renders nothing without projects, so Home never
 * shows an empty gallery or invented work (planning/MASTER_PLAN.md §6).
 */
export function FeaturedProjects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <Section id="projects" scheme="light" container={false}>
      <Container className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader eyebrow={featuredContent.eyebrow} title={featuredContent.title} />
        <LinkButton href={routes.projects} variant="link" icon={<ArrowRight />} className="shrink-0 self-start lg:self-auto">
          {featuredContent.allProjects}
        </LinkButton>
      </Container>

      <ProjectRail label={featuredContent.galleryLabel} className="mt-12 lg:mt-16">
        {projects.map((project) => (
          <li
            key={project.slug}
            data-animate="rail-item"
            className="w-[82%] shrink-0 snap-start sm:w-[60%] lg:w-[min(48rem,calc((100svh_-_var(--header-h)_*_2_-_9rem)_*_1.5))]"
          >
            <ProjectCard project={project} variant="featured" />
          </li>
        ))}
      </ProjectRail>
    </Section>
  );
}
