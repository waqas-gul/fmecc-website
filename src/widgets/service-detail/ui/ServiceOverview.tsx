import type { Service } from "@/entities/service";
import { Section } from "@/shared/ui";

/**
 * Service page section 2 (planning/DESIGN.md §9.1): the positioning statement beside the
 * "Who it is for" list. The label-style h2 keeps the summary itself as the visual lead.
 */
export function ServiceOverview({ service }: { service: Service }) {
  return (
    <Section id="overview" scheme="light">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <h2 className="type-label flex items-center gap-3 text-ink-muted">
            <span aria-hidden className="h-px w-6 shrink-0 bg-highlight" />
            Overview
          </h2>
          <p className="mt-8 max-w-[40ch] font-display text-heading-md leading-snug font-medium text-ink">
            {service.summary}
          </p>
        </div>

        {service.audiences.length > 0 && (
          <div className="lg:col-span-4 lg:col-start-9">
            <h3 className="font-display text-heading-sm font-semibold">Who it is for</h3>
            <ul className="mt-6 border-t border-line">
              {service.audiences.map((audience) => (
                <li key={audience} className="flex items-start gap-4 border-b border-line py-4 text-body text-ink-muted">
                  {/* A border, not a 1 px fill, so the tick stays crisp at fractional offsets. */}
                  <span aria-hidden className="mt-[0.8em] w-3 shrink-0 border-t border-highlight" />
                  {audience}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Section>
  );
}
