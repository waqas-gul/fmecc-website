import { ArrowRight } from "lucide-react";

import { routes } from "@/shared/config";
import { LinkButton, Reveal, Section, SectionHeader } from "@/shared/ui";
import { ServiceCard, services } from "@/entities/service";

import { showcaseContent } from "../data/content";
import { ServiceSwitcher, type SwitcherItem } from "./ServiceSwitcher";

/**
 * The four services with strong media on Home (planning/DESIGN.md §8, row 3): pinned scroll
 * switcher at ≥ 1024 px, stacked `ServiceCard`s below. The services overview page uses
 * `ServicePanels` from service-detail instead.
 */
export function ServicesShowcase() {
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
