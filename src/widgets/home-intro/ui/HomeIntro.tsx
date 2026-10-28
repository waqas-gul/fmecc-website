import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { routes } from "@/shared/config";
import { Eyebrow, LinkButton, Reveal, Section, Stat } from "@/shared/ui";
import { company } from "@/entities/company";
import { services } from "@/entities/service";

import { introContent } from "../data/content";
import { LineReveal } from "./LineReveal";

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Home introduction (planning/DESIGN.md §8, row 2): company statement beside a numbered list of the
 * four disciplines. The statistics band exists only when FMECC has supplied real figures.
 */
export function HomeIntro() {
  return (
    <Section id="intro" scheme="light">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <Eyebrow>{introContent.eyebrow}</Eyebrow>
          <LineReveal className="mt-6 max-w-[20ch] font-display text-display-lg font-bold">{company.statement}</LineReveal>
          <Reveal className="mt-8 flex flex-col gap-4">
            {company.intro.map((paragraph) => (
              <p key={paragraph} className="max-w-[60ch] text-body-lg text-ink-muted">
                {paragraph}
              </p>
            ))}
          </Reveal>
          <LinkButton href={routes.about} variant="link" icon={<ArrowRight />} className="mt-6">
            {introContent.aboutLink}
          </LinkButton>
        </div>

        <div className="lg:col-span-5 lg:col-start-8 lg:pt-3">
          <h3 className="type-label text-ink-subtle">{introContent.disciplinesHeading}</h3>
          <ol className="mt-6 border-t border-line">
            {services.map((service, index) => (
              <Reveal as="li" key={service.slug} delay={index * 0.08} className="border-b border-line">
                <Link href={routes.service(service.slug)} className="group flex items-start gap-5 py-6">
                  <span className="type-label pt-1.5 text-highlight tabular-nums">{pad(service.index)}</span>
                  <span className="flex flex-1 flex-col gap-1.5">
                    <span className="font-display text-heading-sm font-semibold text-ink transition-colors duration-150 group-hover:text-accent-text">
                      {service.name}
                    </span>
                    <span className="text-body-sm text-ink-muted">{service.tagline}</span>
                  </span>
                  <ArrowRight
                    aria-hidden
                    className="mt-1 size-5 shrink-0 text-accent-text motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:translate-x-1"
                  />
                </Link>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>

      {company.stats.length > 0 && (
        <div className="mt-16 lg:mt-24">
          <h3 className="sr-only">{introContent.statsHeading}</h3>
          <Reveal stagger={0.08} className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
            {company.stats.map((stat) => (
              <Stat key={stat.label} value={stat.value} label={stat.label} note={stat.note} />
            ))}
          </Reveal>
        </div>
      )}
    </Section>
  );
}
