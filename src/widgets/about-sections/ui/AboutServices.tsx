import { ArrowRight } from "lucide-react";

import type { Service } from "@/entities/service";
import { routes } from "@/shared/config";
import { LinkButton, Section, SectionHeader } from "@/shared/ui";

import { aboutContent } from "../data/about";
import { IconTile } from "./IconTile";

/**
 * The four service areas as ruled rows: name, tagline and summary, plus audiences and scope once the
 * service data lists them, with a link to the service page and a quote link with the service preselected.
 */
export function AboutServices({ services }: { services: readonly Service[] }) {
  const { eyebrow, title, lede } = aboutContent.services;

  return (
    <Section id="what-we-do" scheme="light">
      <SectionHeader index={4} eyebrow={eyebrow} title={title} lede={lede} />

      <ul className="mt-14 border-t border-line lg:mt-20">
        {services.map((service) => {
          const scope = service.scope.slice(0, 6);
          return (
            <li key={service.slug} className="border-b border-line">
              <div className="grid gap-6 py-10 lg:grid-cols-12 lg:gap-8 lg:py-14">
                <div className="flex items-center gap-4 lg:col-span-1 lg:flex-col lg:items-start">
                  <span aria-hidden className="type-label text-highlight tabular-nums">
                    {String(service.index).padStart(2, "0")}
                  </span>
                  <IconTile icon={service.icon} />
                </div>

                <div className="lg:col-span-5">
                  <h3 className="max-w-[22ch] font-display text-heading-md font-semibold">{service.name}</h3>
                  <p className="mt-4 max-w-[40ch] text-body-lg text-ink-muted">{service.tagline}</p>
                </div>

                <div className="flex flex-col gap-6 lg:col-span-6">
                  <p className="max-w-[60ch] text-body text-ink">{service.summary}</p>
                  {service.audiences.length > 0 && (
                    <div>
                      <p className="type-label text-ink-subtle">Who it is for</p>
                      <p className="mt-3 text-body-sm text-ink-muted">{service.audiences.join(", ")}</p>
                    </div>
                  )}
                  {scope.length > 0 && (
                    <div>
                      <p className="type-label text-ink-subtle">Scope includes</p>
                      <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                        {scope.map((item) => (
                          <li key={item.title} className="flex gap-3 text-body-sm text-ink-muted">
                            <span aria-hidden className="mt-[0.75em] h-px w-3 shrink-0 bg-highlight" />
                            {item.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-x-8">
                    <LinkButton href={routes.service(service.slug)} variant="link" icon={<ArrowRight />} className="min-h-11">
                      Explore<span className="sr-only"> {service.shortName}</span>
                    </LinkButton>
                    <LinkButton href={routes.quote(service.slug)} variant="link" className="min-h-11">
                      Request a quotation<span className="sr-only"> for {service.shortName}</span>
                    </LinkButton>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
