import { Check } from "lucide-react";

import type { Service } from "@/entities/service";
import { Reveal, Section, SectionHeader } from "@/shared/ui";

/**
 * Service page section 3 (planning/DESIGN.md §9.1): scope items as a feature grid
 * (1 / 2 / 3 columns), followed by the documents handed over when the service lists them.
 */
export function ServiceScope({ service }: { service: Service }) {
  if (service.scope.length === 0) return null;
  const deliverables = service.deliverables ?? [];

  return (
    <Section id="scope" scheme="light">
      <SectionHeader
        eyebrow="Scope of work"
        title="What the work covers"
        lede="The final scope for each site is agreed with you in the proposal."
      />

      <ul className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
        {service.scope.map((item, index) => {
          const Icon = item.icon ?? service.icon;
          return (
            <Reveal as="li" key={item.title} delay={(index % 3) * 0.08} className="flex flex-col border-t border-line pt-6">
              <span className="inline-flex size-10 items-center justify-center rounded-sm border border-line text-highlight">
                <Icon aria-hidden className="size-5" />
              </span>
              <h3 className="mt-6 font-display text-heading-sm font-semibold">{item.title}</h3>
              <p className="mt-3 max-w-[48ch] text-body text-ink-muted">{item.description}</p>
            </Reveal>
          );
        })}
      </ul>

      {deliverables.length > 0 && (
        <div className="mt-16 grid gap-8 rounded-md border border-line bg-surface-muted p-6 lg:mt-24 lg:grid-cols-12 lg:p-10">
          <h3 className="font-display text-heading-md font-semibold lg:col-span-4">What you receive</h3>
          <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:col-span-8">
            {deliverables.map((deliverable) => (
              <li key={deliverable} className="flex items-start gap-3 text-body text-ink">
                <Check aria-hidden className="mt-1 size-4 shrink-0 text-highlight" />
                {deliverable}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}
