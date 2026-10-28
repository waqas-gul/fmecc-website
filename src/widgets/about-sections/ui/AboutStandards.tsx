import { Section, SectionHeader } from "@/shared/ui";

import { aboutContent } from "../data/about";
import { IconTile } from "./IconTile";

/** Quality and safety principles in two ruled columns (generic HSE commitment, planning/MASTER_PLAN.md §3). */
export function AboutStandards() {
  const { eyebrow, title, lede, groups } = aboutContent.standards;

  return (
    <Section id="quality-and-safety" scheme="light">
      <SectionHeader eyebrow={eyebrow} title={title} lede={lede} />

      <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-2 lg:gap-8">
        {groups.map((group) => (
          <div key={group.title}>
            <div className="flex items-center gap-4">
              <IconTile icon={group.icon} />
              <h3 className="font-display text-heading-md font-semibold">{group.title}</h3>
            </div>
            <ul className="mt-8 border-t border-line">
              {group.items.map((item) => (
                <li key={item.title} className="border-b border-line py-6">
                  <h4 className="font-display text-body-lg font-semibold">{item.title}</h4>
                  <p className="mt-2 max-w-[52ch] text-body text-ink-muted">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
