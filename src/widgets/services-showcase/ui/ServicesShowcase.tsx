import { ArrowRight } from "lucide-react";

import { routes } from "@/shared/config";
import { LinkButton, Section, SectionHeader } from "@/shared/ui";
import { services } from "@/entities/service";

import { showcaseContent } from "../data/content";
import { ServiceSwitcher, type SwitcherItem } from "./ServiceSwitcher";

/**
 * The four services with strong media on Home (planning/DESIGN.md §8, row 3): a scroll switcher at
 * every width, pinned at ≥ 1024 px and with a pinned frame above the list below. The services
 * overview page uses `ServicePanels` from service-detail instead.
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
    wideMedia: service.hero,
  }));

  return (
    <Section id="services" scheme="light">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader eyebrow={showcaseContent.eyebrow} title={showcaseContent.title} lede={showcaseContent.lede} />
        <LinkButton href={routes.services} variant="link" icon={<ArrowRight />} className="shrink-0 self-start lg:self-auto">
          {showcaseContent.allServices}
        </LinkButton>
      </div>

      {/* Below 1024 px the pinned frame's header band is the top spacing. */}
      <ServiceSwitcher items={items} className="lg:mt-16" />
    </Section>
  );
}
