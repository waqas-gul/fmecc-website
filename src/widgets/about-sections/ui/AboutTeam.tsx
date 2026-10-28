import type { CompanyContent } from "@/entities/company";
import { MediaImage, Section, SectionHeader } from "@/shared/ui";

import { aboutContent } from "../data/about";

/** Leadership, rendered only when FMECC supplies names and roles in `company.leadership`. */
export function AboutTeam({ leadership }: { leadership: CompanyContent["leadership"] }) {
  if (leadership.length === 0) return null;
  const { eyebrow, title } = aboutContent.team;

  return (
    <Section id="leadership" scheme="light">
      <SectionHeader eyebrow={eyebrow} title={title} />
      <ul className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
        {leadership.map((person) => (
          <li key={person.name} className="flex flex-col">
            {person.photo && (
              <MediaImage
                asset={person.photo}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="mb-6 aspect-[4/5] w-full rounded-md object-cover"
              />
            )}
            <h3 className="font-display text-heading-sm font-semibold">{person.name}</h3>
            <p className="mt-1 text-body-sm text-ink-muted">{person.role}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
