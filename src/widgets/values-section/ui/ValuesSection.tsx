import { IconTile, Reveal, Section, SectionHeader } from "@/shared/ui";
import type { CompanyContent } from "@/entities/company";

import { valuesContent } from "../data/content";

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * "Why FMECC" (planning/DESIGN.md §8, row 6): the company's working principles as numbered cards in
 * a 4 / 2 / 1 column grid on a full-bleed `surface-muted` band. Cards are not links, so hover only
 * strengthens the border and extends the cyan rule; touch shows the same resting state. Shared by
 * Home and About.
 */
export function ValuesSection({ values }: { values: CompanyContent["values"] }) {
  if (values.length === 0) return null;

  return (
    <Section id="why-fmecc" scheme="light" className="bg-surface-muted">
      <SectionHeader eyebrow={valuesContent.eyebrow} title={valuesContent.title} lede={valuesContent.lede} />
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-6">
        {values.map((value, index) => (
          <Reveal as="li" key={value.title} delay={index * 0.08} className="flex">
            <article className="group flex flex-1 flex-col rounded-md border border-line bg-surface-raised p-6 transition-colors duration-250 ease-standard hover:border-line-strong lg:p-8">
              <div className="flex items-start justify-between gap-4">
                <IconTile icon={value.icon} className="bg-surface-muted" />
                <span aria-hidden className="type-label pt-1 text-accent-text tabular-nums">
                  {pad(index + 1)}
                </span>
              </div>
              <h3 className="mt-10 font-display text-heading-sm font-semibold lg:mt-12">{value.title}</h3>
              <p className="mt-3 text-body-sm text-ink-muted">{value.description}</p>
              <span aria-hidden className="mt-auto block pt-8">
                <span className="block h-0.5 origin-left scale-x-[0.16] bg-highlight motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out-expo group-hover:scale-x-100" />
              </span>
            </article>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
