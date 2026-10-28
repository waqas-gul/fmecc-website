import { ArrowRight } from "lucide-react";

import { routes, serviceNav } from "@/shared/config";
import { LinkButton, SectionHeader, VisuallyHidden } from "@/shared/ui";

/**
 * Shown while no verified project is published (planning/MASTER_PLAN.md §6): an honest status and
 * a route into each discipline, each with a quotation link that preselects the service.
 */
export function PortfolioInProgress() {
  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
      <SectionHeader
        eyebrow="Portfolio in progress"
        title="Case studies are being prepared."
        lede="Projects are published here once their facts and imagery are confirmed. Until then, explore each discipline or ask us about the work you are planning."
        className="lg:col-span-5"
      />

      <ol className="border-t border-line lg:col-span-6 lg:col-start-7">
        {serviceNav.map(({ slug, label, description }, index) => (
          <li
            key={slug}
            className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-line py-6 sm:grid-cols-[3rem_1fr_auto] sm:items-center lg:py-7"
          >
            <span className="type-label self-start pt-2 text-highlight tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="font-display text-heading-sm font-semibold">{label}</h3>
              <p className="mt-1 text-body-sm text-ink-muted">{description}</p>
            </div>
            <div className="col-start-2 mt-3 flex flex-wrap gap-x-6 sm:col-start-3 sm:mt-0 sm:flex-col sm:items-end">
              <LinkButton href={routes.service(slug)} variant="link" size="sm" icon={<ArrowRight />} className="min-h-11">
                Explore<VisuallyHidden> {label}</VisuallyHidden>
              </LinkButton>
              <LinkButton href={routes.quote(slug)} variant="link" size="sm" className="min-h-11">
                Request a quotation<VisuallyHidden> for {label}</VisuallyHidden>
              </LinkButton>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
