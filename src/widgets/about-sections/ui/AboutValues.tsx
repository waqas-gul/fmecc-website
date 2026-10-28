import type { CompanyContent } from "@/entities/company";
import { Section, SectionHeader } from "@/shared/ui";

import { aboutContent } from "../data/about";
import { IconTile } from "./IconTile";

/** Mission statement beside the company values as a ruled list. */
export function AboutValues({ values }: { values: CompanyContent["values"] }) {
  const { eyebrow, title, missionLabel, mission } = aboutContent.values;

  return (
    <Section id="mission-and-values" scheme="light">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <SectionHeader index={2} eyebrow={eyebrow} title={title} />
          <div className="mt-10 border-t border-line pt-8 lg:mt-14">
            <p className="type-label text-highlight">{missionLabel}</p>
            <p className="mt-5 max-w-[32ch] font-display text-heading-md font-semibold text-ink">{mission}</p>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <ul className="border-t border-line">
            {values.map((value, index) => (
              <li key={value.title} className="flex gap-5 border-b border-line py-7 lg:gap-6 lg:py-8">
                <IconTile icon={value.icon} />
                <div>
                  <h3 className="flex items-baseline gap-3 font-display text-heading-sm font-semibold">
                    <span aria-hidden className="type-label text-highlight tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {value.title}
                  </h3>
                  <p className="mt-2 max-w-[50ch] text-body text-ink-muted">{value.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
