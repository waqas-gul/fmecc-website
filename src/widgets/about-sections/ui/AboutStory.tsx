import type { CompanyContent } from "@/entities/company";
import { Section, SectionHeader, Stat } from "@/shared/ui";

import { aboutContent } from "../data/about";

/** Company introduction (planning/DESIGN.md §9.3): statement and description, plus figures only when FMECC supplies them. */
export function AboutStory({
  statement,
  intro,
  stats,
}: {
  statement: string;
  intro: string[];
  stats: CompanyContent["stats"];
}) {
  const { eyebrow, paragraphs, statsLabel } = aboutContent.story;

  return (
    <Section id="who-we-are" scheme="light">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <SectionHeader index={1} eyebrow={eyebrow} title={statement} className="lg:col-span-6" />
        <div className="flex flex-col gap-6 lg:col-span-5 lg:col-start-8 lg:pt-12">
          {[...intro, ...paragraphs].map((paragraph, index) => (
            <p key={index} className={index === 0 ? "text-body-lg text-ink" : "text-body text-ink-muted"}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {stats.length > 0 && (
        <div className="mt-16 lg:mt-24">
          <h3 className="sr-only">{statsLabel}</h3>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Stat key={stat.label} value={stat.value} label={stat.label} note={stat.note} />
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
