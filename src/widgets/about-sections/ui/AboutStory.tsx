import { LineReveal } from "@/shared/motion";
import { Eyebrow, Reveal, Section, Stat } from "@/shared/ui";
import type { CompanyContent } from "@/entities/company";

import { aboutContent } from "../data/about";

/**
 * Company introduction (planning/DESIGN.md §9.3): statement, description and mission, plus figures
 * only when FMECC supplies them. The statement rises line by line, like Home's introduction.
 */
export function AboutStory({
  statement,
  intro,
  stats,
}: {
  statement: string;
  intro: string[];
  stats: CompanyContent["stats"];
}) {
  const { eyebrow, paragraphs, statsLabel, missionLabel, mission } = aboutContent.story;

  return (
    <Section id="who-we-are" scheme="light">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <Eyebrow>{eyebrow}</Eyebrow>
          <LineReveal className="mt-5 max-w-[20ch] font-display text-display-lg font-bold">{statement}</LineReveal>
        </div>
        <Reveal stagger={0.08} className="flex flex-col gap-6 lg:col-span-5 lg:col-start-8 lg:pt-12">
          {[...intro, ...paragraphs].map((paragraph, index) => (
            <p key={index} className={index === 0 ? "text-body-lg text-ink" : "text-body text-ink-muted"}>
              {paragraph}
            </p>
          ))}
          <div className="mt-4 border-t border-line pt-8">
            <h3 className="type-label text-highlight">{missionLabel}</h3>
            <p className="mt-5 max-w-[32ch] font-display text-heading-md font-semibold text-ink">{mission}</p>
          </div>
        </Reveal>
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
