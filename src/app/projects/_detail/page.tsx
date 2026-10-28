/*
 * Project detail page: /projects/<slug>/ (planning/MASTER_PLAN.md §6, DESIGN.md §9.3).
 *
 * DORMANT. With `output: 'export'`, Next 16.4 fails the build when a dynamic segment's
 * generateStaticParams() returns no params ("returned an empty array from generateStaticParams()"),
 * and FMECC has no verified projects yet. A private folder (_detail) keeps this page out of routing
 * while it stays linted and type-checked.
 *
 * Activate when the first verified project is added to src/entities/project/data/projects.ts:
 *   git mv src/app/projects/_detail "src/app/projects/[slug]"
 * The /projects/ build check (_lib/check-portfolio.ts) fails until this is done, and
 * generateStaticParams() below fails if the route is active while the registry is empty.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { routes, serviceNav } from "@/shared/config";
import { buildMetadata } from "@/shared/lib/seo";
import { LinkButton, Section, SectionHeader } from "@/shared/ui";
import { getProject, ProjectCard, projects, type Project } from "@/entities/project";
import { CtaBand } from "@/widgets/cta-band";
import { PageHero } from "@/widgets/page-hero";
import { ProjectFacts, ProjectGallery, ProjectNarrative } from "@/widgets/project-detail";

// Typed by hand: PageProps<"/projects/[slug]"> is generated only while the route is active.
type ProjectPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  if (projects.length === 0) {
    throw new Error(
      '[projects] /projects/[slug] is active but no projects exist. Add a verified project or run: git mv "src/app/projects/[slug]" src/app/projects/_detail',
    );
  }
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};

  return {
    ...buildMetadata({
      title: project.seo?.title ?? project.title,
      description: project.seo?.description ?? project.summary,
      path: routes.project(project.slug),
      image: project.hero,
    }),
    ...(project.placeholder && { robots: { index: false, follow: true } }),
  };
}

/** Up to three projects that share a service, topped up with the rest so there is always a next project. */
function relatedProjects(project: Project): Project[] {
  const others = projects.filter((candidate) => candidate.slug !== project.slug);
  const sharesService = (candidate: Project) => candidate.services.some((slug) => project.services.includes(slug));
  return [...others.filter(sharesService), ...others.filter((candidate) => !sharesService(candidate))].slice(0, 3);
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const serviceLabels = serviceNav.filter(({ slug }) => project.services.includes(slug)).map(({ label }) => label);
  const related = relatedProjects(project);

  return (
    <>
      <PageHero
        eyebrow={[project.placeholder && "Sample project", ...serviceLabels].filter(Boolean).join(" · ")}
        title={project.title}
        lede={project.summary}
        media={project.hero}
        breadcrumbs={[
          { label: "Home", href: routes.home },
          { label: "Projects", href: routes.projects },
          { label: project.title },
        ]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <ProjectFacts project={project} />
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <ProjectNarrative project={project} />
          </div>
        </div>
      </Section>

      <ProjectGallery images={project.gallery} />

      {related.length > 0 && (
        <Section container="wide">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader eyebrow="Related projects" title="More from the portfolio" />
            <LinkButton
              href={routes.projects}
              variant="link"
              icon={<ArrowRight />}
              className="min-h-11 shrink-0 self-start sm:self-auto"
            >
              All projects
            </LinkButton>
          </div>
          <ul className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-x-8">
            {related.map((item) => (
              <li key={item.slug} className="flex">
                <ProjectCard project={item} className="w-full" />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <CtaBand
        title="Planning a similar project?"
        primary={{ label: "Request a quotation", href: routes.quote(project.services[0]) }}
      />
    </>
  );
}
