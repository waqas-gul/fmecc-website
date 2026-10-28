/*
 * Illustrative concept detail: /projects/concepts/<slug>/. Concepts are hypothetical scopes for client
 * preview, never delivered work, so every page says so and is kept out of search indexes and the
 * sitemap. Delivered projects use /projects/<slug>/ (src/app/projects/_detail).
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Info } from "lucide-react";

import { routes, serviceNav } from "@/shared/config";
import { buildMetadata } from "@/shared/lib/seo";
import { LinkButton, Reveal, Section, SectionHeader } from "@/shared/ui";
import {
  ConceptCard,
  conceptMediaTransition,
  conceptNotice,
  conceptNumber,
  concepts,
  getConcept,
} from "@/entities/concept";
import { CtaBand } from "@/widgets/cta-band";
import { PageHero } from "@/widgets/page-hero";
import { ProjectGallery } from "@/widgets/project-detail";

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

export default async function ConceptPage({ params }: PageProps<"/projects/concepts/[slug]">) {
  const concept = getConcept((await params).slug);
  if (!concept) notFound();

  const service = serviceNav.find((item) => item.slug === concept.service);
  const others = concepts.filter((candidate) => candidate.slug !== concept.slug);
  const pad = (value: number) => String(value).padStart(2, "0");
  // Facts about this page only: a concept has no client, location, date, value or outcome.
  const facts = [
    { label: "Concept", value: `${pad(conceptNumber(concept.slug))} of ${pad(concepts.length)}` },
    { label: "Service", value: service?.label ?? concept.service },
    { label: "Status", value: "Illustrative, not a delivered project" },
    { label: "Hypothetical scope", value: `${concept.scope.length} work packages` },
  ];

  return (
    <>
      <PageHero
        eyebrow="Illustrative concept"
        title={concept.title}
        lede={concept.summary}
        media={concept.hero}
        mediaTransition={conceptMediaTransition(concept.slug)}
        breadcrumbs={[
          { label: "Home", href: routes.home },
          { label: "Projects", href: routes.projects },
          { label: concept.title },
        ]}
        actions={
          <>
            <LinkButton href={routes.quote(concept.service)} size="lg" icon={<ArrowRight />}>
              Request a quotation
            </LinkButton>
            <LinkButton href={routes.service(concept.service)} size="lg" variant="outline">
              Explore the service
            </LinkButton>
          </>
        }
      />

      <Section id="overview" scheme="light">
        <Reveal className="mb-14 lg:mb-20">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 border-y border-line py-8 lg:grid-cols-4 lg:gap-x-8">
            {facts.map((fact) => (
              <div key={fact.label} className="flex flex-col gap-2.5">
                <dt className="type-label text-ink-subtle">{fact.label}</dt>
                <dd className="font-display text-body-lg font-semibold text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <h2 className="type-label flex items-center gap-3 text-ink-muted">
              <span aria-hidden className="h-px w-6 shrink-0 bg-highlight" />
              Concept overview
            </h2>
            <div className="mt-8 flex flex-col gap-6">
              {concept.overview.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={
                    index === 0
                      ? "max-w-[44ch] font-display text-heading-sm leading-snug font-medium text-ink"
                      : "max-w-[62ch] text-body-lg text-ink-muted"
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <p className="mt-10 flex max-w-[62ch] gap-3 rounded-md border border-line-strong bg-surface-muted p-4 text-body-sm text-ink">
              <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-highlight" />
              {conceptNotice}
            </p>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <h3 className="font-display text-heading-sm font-semibold">Hypothetical scope</h3>
            <ul className="mt-6 border-t border-line">
              {concept.scope.map((item) => (
                <li key={item} className="flex items-start gap-4 border-b border-line py-4 text-body text-ink-muted">
                  <span aria-hidden className="mt-[0.8em] w-3 shrink-0 border-t border-highlight" />
                  {item}
                </li>
              ))}
            </ul>
            {service && (
              <p className="mt-8 text-body-sm text-ink-muted">
                Service:{" "}
                <Link
                  href={routes.service(concept.service)}
                  className="font-medium text-accent-text underline underline-offset-4"
                >
                  {service.label}
                </Link>
              </p>
            )}
          </div>
        </div>
      </Section>

      {/* The hero leads the gallery only when the concept has distinct images of its own. */}
      <ProjectGallery
        images={concept.gallery.length > 0 ? [concept.hero, ...concept.gallery] : []}
        title="Concept imagery"
        lede="Licensed stock photography and 3D illustrations, shown for illustration only. They do not depict FMECC projects."
        label="Illustrative concept"
      />

      <Section scheme="light" container="wide">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader eyebrow="More concepts" title="Other illustrative concepts" />
          <LinkButton
            href={routes.projects}
            variant="link"
            icon={<ArrowRight />}
            className="min-h-11 shrink-0 self-start sm:self-auto"
          >
            All concepts
          </LinkButton>
        </div>
        <ul className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-x-8">
          {others.map((other, index) => (
            <Reveal as="li" key={other.slug} variant="media-scale" delay={index * 0.08} className="flex">
              <ConceptCard concept={other} variant="compact" className="flex-1" />
            </Reveal>
          ))}
        </ul>
      </Section>

      <CtaBand
        title="Planning a project like this?"
        primary={{ label: "Request a quotation", href: routes.quote(concept.service) }}
      />
    </>
  );
}
