import { ArrowRight } from "lucide-react";

import { routes } from "@/shared/config";
import { cn } from "@/shared/lib/utils";
import { Eyebrow, LinkButton, MediaImage, Reveal, Section, SectionHeader } from "@/shared/ui";
import { ServiceCard, services } from "@/entities/service";

import { showcaseContent } from "../data/content";
import { ServiceSwitcher, type SwitcherItem } from "./ServiceSwitcher";

/**
 * The four services with strong media. `home`: pinned scroll switcher at ≥ 1024 px, stacked
 * `ServiceCard`s below (planning/DESIGN.md §8, row 3). `overview`: four large alternating panels
 * for the services overview page (planning/DESIGN.md §9.3); its titles are h2s under the page hero.
 */
export function ServicesShowcase({ variant }: { variant: "home" | "overview" }) {
  return variant === "home" ? <HomeShowcase /> : <OverviewPanels />;
}

function HomeShowcase() {
  const items: SwitcherItem[] = services.map((service) => ({
    slug: service.slug,
    index: service.index,
    name: service.name,
    shortName: service.shortName,
    summary: service.summary,
    href: routes.service(service.slug),
    media: service.showcaseMedia,
  }));

  return (
    <Section id="services" scheme="light">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader eyebrow={showcaseContent.eyebrow} title={showcaseContent.title} lede={showcaseContent.lede} />
        <LinkButton href={routes.services} variant="link" icon={<ArrowRight />} className="shrink-0 self-start lg:self-auto">
          {showcaseContent.allServices}
        </LinkButton>
      </div>

      <ServiceSwitcher items={items} className="mt-16 max-lg:hidden" />

      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:hidden">
        {services.map((service, index) => (
          <Reveal as="li" key={service.slug} delay={(index % 2) * 0.08} className="flex">
            <ServiceCard service={service} className="flex-1" />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

function OverviewPanels() {
  return (
    <Section scheme="light">
      <ol className="flex flex-col gap-24 lg:gap-32">
        {services.map((service, index) => {
          const flipped = index % 2 === 1;
          return (
            <li key={service.slug} id={service.slug} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
              <Reveal className={cn("lg:col-span-6", flipped && "lg:order-last lg:col-start-7")}>
                <div className="overflow-hidden rounded-md">
                  <MediaImage
                    asset={service.showcaseMedia}
                    sizes="(min-width: 1280px) 39rem, (min-width: 1024px) 50vw, 100vw"
                    className="aspect-[4/5] w-full object-cover max-lg:max-h-[32rem]"
                  />
                </div>
              </Reveal>

              <Reveal className={cn("lg:col-span-5", flipped ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-8")}>
                <Eyebrow index={service.index}>{showcaseContent.overviewEyebrow}</Eyebrow>
                <h2 className="mt-6 max-w-[16ch] font-display text-display-lg font-bold">{service.shortName}</h2>
                <p className="mt-6 max-w-[50ch] text-body-lg text-ink">{service.tagline}</p>
                <p className="mt-4 max-w-[60ch] text-ink-muted">{service.summary}</p>
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <LinkButton href={routes.service(service.slug)} variant="outline" icon={<ArrowRight />}>
                    {showcaseContent.explore} {service.shortName}
                  </LinkButton>
                  <LinkButton href={routes.quote(service.slug)} variant="link">
                    {showcaseContent.quote}
                  </LinkButton>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
