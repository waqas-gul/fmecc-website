import { BadgeCheck } from "lucide-react";

import type { CompanyContent } from "@/entities/company";
import { Card, Section, SectionHeader } from "@/shared/ui";

import { aboutContent } from "../data/about";
import { IconTile } from "./IconTile";

/** Registrations and certifications, rendered only when FMECC supplies them in `company.registrations`. */
export function AboutRegistrations({ registrations }: { registrations: CompanyContent["registrations"] }) {
  if (registrations.length === 0) return null;
  const { eyebrow, title } = aboutContent.registrations;

  return (
    <Section id="registrations" scheme="light">
      <SectionHeader eyebrow={eyebrow} title={title} />
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
        {registrations.map((registration) => (
          <Card as="li" key={registration.title} className="flex flex-col gap-5">
            <IconTile icon={BadgeCheck} />
            <div>
              <h3 className="font-display text-heading-sm font-semibold">{registration.title}</h3>
              {registration.issuer && <p className="mt-1 text-body-sm text-ink-muted">{registration.issuer}</p>}
            </div>
          </Card>
        ))}
      </ul>
    </Section>
  );
}
