import { ArrowRight } from "lucide-react";

import { routes, site } from "@/shared/config";
import { buildMetadata } from "@/shared/lib/seo";
import type { ImageAsset } from "@/shared/types/media";
import { LinkButton } from "@/shared/ui";
import { company } from "@/entities/company";
import { services } from "@/entities/service";
import { AboutRegistrations, AboutServices, AboutStandards, AboutStory, AboutTeam } from "@/widgets/about-sections";
import { CtaBand } from "@/widgets/cta-band";
import { PageHero } from "@/widgets/page-hero";
import { ProcessSection } from "@/widgets/process-section";
import { showcaseScenes } from "@/widgets/service-showcase";
import { ValuesSection } from "@/widgets/values-section";

// Licensed stock photography, illustrative only (planning/MEDIA_PLAN.md); not an FMECC project.
const heroMedia: ImageAsset = {
  src: "/images/about/about-hero-steel-frame.webp",
  width: 1920,
  height: 1080,
  alt: "Structural steel frame of a building under construction against a pale sky",
};

export const metadata = buildMetadata({
  title: "About us",
  description:
    "Who Future Middle East Construction Company is, how it delivers, and the quality and safety principles behind its building, telecom, security and bollard work.",
  path: routes.about,
  image: heroMedia,
});

/**
 * About (planning/DESIGN.md §9.3). Values and the delivery process reuse Home's sections with the
 * same company data. Leadership, registrations and figures render only when FMECC supplies them.
 */
export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title={site.legalName}
        lede={site.description}
        media={heroMedia}
        breadcrumbs={[{ label: "Home", href: routes.home }, { label: "About" }]}
        actions={
          <>
            <LinkButton href={routes.quote()} size="lg" icon={<ArrowRight />}>
              Request a quotation
            </LinkButton>
            <LinkButton href={routes.services} size="lg" variant="outline">
              Explore services
            </LinkButton>
          </>
        }
      />
      <AboutStory statement={company.statement} intro={company.intro} stats={company.stats} />
      <ValuesSection values={company.values} />
      {/* Home's process section and visual: the 3D tower assembles with the steps (poster fallback). */}
      <ProcessSection steps={company.process} scene={showcaseScenes.tower.load} poster={showcaseScenes.tower.poster} />
      <AboutServices services={services} />
      <AboutStandards />
      <AboutTeam leadership={company.leadership} />
      <AboutRegistrations registrations={company.registrations} />
      <CtaBand />
    </>
  );
}
