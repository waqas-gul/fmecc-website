/*
 * Illustrative concept detail: /projects/concepts/<slug>/. Concepts are hypothetical scopes for client
 * preview, never delivered work, so every page says so and is kept out of search indexes and the
 * sitemap. Delivered projects use /projects/<slug>/ (src/app/projects/_detail).
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { routes, serviceNav } from "@/shared/config";
import { buildMetadata } from "@/shared/lib/seo";
import { LinkButton } from "@/shared/ui";
import { conceptMediaTransition, conceptNotice, conceptNumber, concepts, getConcept } from "@/entities/concept";
import { CtaBand } from "@/widgets/cta-band";
import { CaseStudyBrief, CaseStudyHero, NextProject, ProjectGallery, ProjectIndex } from "@/widgets/project-detail";

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return concepts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/concepts/[slug]">): Promise<Metadata> {
  const concept = getConcept((await params).slug);
  if (!concept) return {};

  return {
    ...buildMetadata({
      title: `${concept.title} concept`,
      description: `${concept.summary} An illustrative concept, not a completed FMECC project.`,
      path: routes.concept(concept.slug),
      image: concept.hero,
    }),
    robots: { index: false, follow: true },
  };
}

const pad = (value: number) => String(value).padStart(2, "0");
const serviceLabel = (slug: string) => serviceNav.find((item) => item.slug === slug)?.label ?? slug;

/**
 * A concept as a case study (planning/DESIGN.md §9.3): hero, overview with facts and the
 * hypothetical scope, the concept's own imagery (the hero is not repeated), the other concepts as an
 * index, then the next concept as a full-width panel whose image morphs into that page's hero.
 */
export default async function ConceptPage({ params }: PageProps<"/projects/concepts/[slug]">) {
  const concept = getConcept((await params).slug);
  if (!concept) notFound();

  const number = conceptNumber(concept.slug);
  const total = concepts.length;
  const service = serviceLabel(concept.service);
  const next = concepts[number % total];
  const others = concepts.filter((candidate) => candidate.slug !== concept.slug && candidate.slug !== next.slug);
  // Facts about this page only: a concept has no client, location, date, value or outcome.
  const facts = [
    { label: "Concept", value: `${pad(number)} of ${pad(total)}` },
    { label: "Service", value: service, href: routes.service(concept.service) },
    { label: "Status", value: "Illustrative, not a delivered project" },
    { label: "Hypothetical scope", value: `${concept.scope.length} work packages` },
  ];

  return (
    <>
      <CaseStudyHero
        meta={`Concept ${pad(number)} / ${pad(total)}`}
        category={service}
        status="Illustrative concept"
        title={concept.title}
        lede={concept.summary}
        media={concept.hero}
        mediaTransition={conceptMediaTransition(concept.slug)}
        label="Illustrative concept"
        breadcrumbs={[
          { label: "Home", href: routes.home },
          { label: "Projects", href: routes.projects },
          { label: concept.title },
        ]}
        actions={
          <>
            <LinkButton href={routes.quote(concept.service)} size="lg" icon={<ArrowRight />} className="max-sm:w-full">
              Request a quotation
            </LinkButton>
            <LinkButton href={routes.service(concept.service)} size="lg" variant="outline" className="max-sm:w-full">
              Explore the service
            </LinkButton>
          </>
        }
      />

      <CaseStudyBrief
        overviewTitle="Concept overview"
        paragraphs={concept.overview}
        facts={facts}
        notice={conceptNotice}
        scopeTitle="Hypothetical scope"
        scope={concept.scope}
      />

      <ProjectGallery
        images={concept.gallery}
        title="Concept imagery"
        lede="Licensed stock photography and 3D illustrations, shown for illustration only. They do not depict FMECC projects."
        label="Illustrative concept"
      />

      <ProjectIndex
        eyebrow="More concepts"
        title="Other illustrative concepts"
        items={others.map((other) => ({
          key: other.slug,
          number: pad(conceptNumber(other.slug)),
          title: other.title,
          meta: serviceLabel(other.service),
          href: routes.concept(other.slug),
        }))}
        all={{ label: "All concepts", href: routes.projects }}
      />

      {next.slug !== concept.slug && (
        <NextProject
          heading="Next concept"
          position={`${pad(conceptNumber(next.slug))} / ${pad(total)}`}
          category={serviceLabel(next.service)}
          title={next.title}
          href={routes.concept(next.slug)}
          media={next.hero}
          mediaTransition={conceptMediaTransition(next.slug)}
        />
      )}

      <CtaBand
        title="Planning a project like this?"
        primary={{ label: "Request a quotation", href: routes.quote(concept.service) }}
      />
    </>
  );
}
