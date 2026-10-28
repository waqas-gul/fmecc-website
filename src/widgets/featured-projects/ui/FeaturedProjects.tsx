import { ArrowRight } from "lucide-react";

import { routes } from "@/shared/config";
import { Container, LinkButton, Section, SectionHeader } from "@/shared/ui";
import { ConceptCard, conceptNotice, type ProjectConcept } from "@/entities/concept";
import { ProjectCard, type Project } from "@/entities/project";

import { conceptContent, featuredContent } from "../data/content";
import { ProjectRail } from "./ProjectRail";

const railItem =
  "w-[82%] shrink-0 snap-start sm:w-[60%] lg:w-[min(48rem,calc((100svh_-_var(--header-h)_*_2_-_9rem)_*_1.5))]";

/**
 * Proof of delivery (planning/DESIGN.md §8, row 5). Real projects always win. Without them, the same
 * rail shows the illustrative concepts under their own heading and notice; with neither, nothing
 * renders, so Home never shows an empty gallery or work presented as delivered (MASTER_PLAN.md §6).
 */
export function FeaturedProjects({
  projects,
  concepts = [],
}: {
  projects: Project[];
  concepts?: readonly ProjectConcept[];
}) {
  const showConcepts = projects.length === 0 && concepts.length > 0;
  if (projects.length === 0 && !showConcepts) return null;
  const content = showConcepts ? conceptContent : featuredContent;

  return (
    <Section id="projects" scheme="light" container={false}>
      <Container className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          eyebrow={content.eyebrow}
          title={content.title}
          lede={showConcepts ? conceptNotice : undefined}
        />
        <LinkButton href={routes.projects} variant="link" icon={<ArrowRight />} className="shrink-0 self-start lg:self-auto">
          {content.allProjects}
        </LinkButton>
      </Container>

      <ProjectRail label={content.galleryLabel} className="mt-12 lg:mt-16">
        {showConcepts
          ? concepts.map((concept) => (
              <li key={concept.slug} data-animate="rail-item" className={railItem}>
                <ConceptCard concept={concept} variant="featured" />
              </li>
            ))
          : projects.map((project) => (
              <li key={project.slug} data-animate="rail-item" className={railItem}>
                <ProjectCard project={project} variant="featured" />
              </li>
            ))}
      </ProjectRail>
    </Section>
  );
}
