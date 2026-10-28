import { ArrowRight } from "lucide-react";

import type { Service } from "@/entities/service";
import { routes } from "@/shared/config";
import { cn } from "@/shared/lib/utils";
import { Eyebrow, LinkButton, MediaImage, Reveal, Section } from "@/shared/ui";

/**
 * Services overview (planning/DESIGN.md §9.3): one large panel per service, media alternating
 * left and right from 1024 px, stacked with media first below. Each panel lists the scope so
 * the four services can be compared, and links to the service page and its quotation request.
 * Panels rise in as they enter while the image settles from a slight zoom, then drifts gently
 * against the scroll (CSS parallax, no JavaScript).
 */
export function ServicePanels({ services }: { services: readonly Service[] }) {
  return (
    <Section id="services" scheme="light">
      <div className="flex flex-col gap-20 lg:gap-32">
        {services.map((service, index) => {
          const reverse = index % 2 === 1;
          return (
            <Reveal key={service.slug} variant="media-scale">
              <article aria-labelledby={`service-${service.slug}`} className="grid gap-8 lg:grid-cols-12 lg:items-center">
                <div
                  className={cn(
                    "parallax-frame relative aspect-[4/3] overflow-hidden rounded-md lg:col-span-5 lg:row-start-1 lg:aspect-[4/5]",
                    reverse ? "lg:col-start-8" : "lg:col-start-1",
                  )}
                >
                  <MediaImage
                    asset={service.showcaseMedia}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="parallax-media object-cover"
                  />
                </div>

                <div className={cn("lg:col-span-6 lg:row-start-1", reverse ? "lg:col-start-1" : "lg:col-start-7")}>
                  <Eyebrow index={service.index}>Service</Eyebrow>
                  <h2 id={`service-${service.slug}`} className="mt-6 max-w-[24ch] font-display text-heading-md font-bold">
                    {service.name}
                  </h2>
                  <p className="mt-5 max-w-[60ch] text-body-lg text-ink-muted">{service.summary}</p>

                  {service.scope.length > 0 && (
                    <>
                      <h3 className="type-label mt-10 text-ink-subtle">Scope includes</h3>
                      <ul className="mt-5 grid gap-x-6 gap-y-3 border-t border-line pt-5 sm:grid-cols-2">
                        {service.scope.map((item) => (
                          <li key={item.title} className="flex items-start gap-3 text-body-sm text-ink">
                            <span aria-hidden className="mt-[0.7em] w-3 shrink-0 border-t border-highlight" />
                            {item.title}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                    <LinkButton href={routes.service(service.slug)} variant="outline" icon={<ArrowRight />}>
                      Explore the service
                      <span className="sr-only">: {service.name}</span>
                    </LinkButton>
                    <LinkButton href={routes.quote(service.slug)} variant="link" className="min-h-11">
                      Request a quotation
                      <span className="sr-only"> for {service.shortName}</span>
                    </LinkButton>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
