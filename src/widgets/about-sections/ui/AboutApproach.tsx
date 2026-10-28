import { ArrowRight } from "lucide-react";

import type { CompanyContent } from "@/entities/company";
import { routes } from "@/shared/config";
import { LinkButton, Section, SectionHeader } from "@/shared/ui";

import { aboutContent } from "../data/about";

/**
 * The shared delivery process on the dark scheme: numbered steps on a rule with cyan ticks,
 * horizontal from 1024 px and vertical below (planning/DESIGN.md §9.1, step 4).
 */
export function AboutApproach({ steps }: { steps: CompanyContent["process"] }) {
  const { eyebrow, title, lede, note } = aboutContent.approach;

  return (
    <Section id="how-we-deliver" scheme="dark" guides>
      <SectionHeader index={3} eyebrow={eyebrow} title={title} lede={lede} />

      <ol
        style={{ "--steps": steps.length } as React.CSSProperties}
        className="mt-14 grid lg:mt-20 lg:grid-cols-[repeat(var(--steps),minmax(0,1fr))] lg:gap-8"
      >
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="relative border-l border-line pb-10 pl-8 last:pb-0 lg:border-t lg:border-l-0 lg:pt-8 lg:pb-0 lg:pl-0"
          >
            <span aria-hidden className="absolute top-0 -left-px h-8 w-px bg-highlight lg:-top-px lg:left-0 lg:h-px lg:w-12" />
            <span aria-hidden className="type-label text-highlight tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 font-display text-heading-sm font-semibold">{step.title}</h3>
            <p className="mt-3 max-w-[40ch] text-body-sm text-ink-muted">{step.description}</p>
          </li>
        ))}
      </ol>

      <div className="mt-14 flex flex-col items-start gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between lg:mt-20">
        <p className="text-body text-ink-muted">{note}</p>
        <LinkButton href={routes.services} variant="link" icon={<ArrowRight />} className="min-h-11">
          Explore the services
        </LinkButton>
      </div>
    </Section>
  );
}
