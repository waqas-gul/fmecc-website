import { Reveal, Section, SectionHeader } from "@/shared/ui";
import type { CompanyContent } from "@/entities/company";

import { valuesContent } from "../data/content";

/**
 * "Why FMECC" (planning/DESIGN.md §8, row 6): the company's working principles as feature items in
 * a 4 / 2 / 1 column grid on a muted panel. Shared by Home and About.
 */
export function ValuesSection({ values }: { values: CompanyContent["values"] }) {
  if (values.length === 0) return null;

  return (
    <Section id="why-fmecc" scheme="light">
      <div className="rounded-lg bg-surface-muted px-6 py-12 sm:px-10 sm:py-14 lg:px-16 lg:py-20">
        <SectionHeader eyebrow={valuesContent.eyebrow} title={valuesContent.title} lede={valuesContent.lede} />
        <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <Reveal as="li" key={value.title} delay={index * 0.08} className="flex flex-col gap-4 border-t border-line-strong pt-6">
                <span className="inline-flex size-10 items-center justify-center rounded-sm border border-line-strong bg-surface text-highlight">
                  <Icon aria-hidden className="size-5" />
                </span>
                <h3 className="mt-2 font-display text-heading-sm font-semibold">{value.title}</h3>
                <p className="text-body-sm text-ink-muted">{value.description}</p>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
