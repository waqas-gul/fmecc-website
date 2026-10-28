import { ArrowRight } from "lucide-react";

import { company } from "@/entities/company";
import { services } from "@/entities/service";
import { routes, site } from "@/shared/config";
import { placeholderImage } from "@/shared/lib/media";
import { buildMetadata } from "@/shared/lib/seo";
import { LinkButton } from "@/shared/ui";
import {
  AboutApproach,
  AboutRegistrations,
  AboutServices,
  AboutStandards,
  AboutStory,
  AboutTeam,
  AboutValues,
} from "@/widgets/about-sections";
import { CtaBand } from "@/widgets/cta-band";
import { PageHero } from "@/widgets/page-hero";

// Replaced by FMECC site photography (planning/DESIGN.md §12.4); flagged `placeholder: true`.
const heroMedia = placeholderImage("Construction site photography", "16:9");

export const metadata = buildMetadata({
  title: "About us",
  description:
    "Who Future Middle East Construction Company is, how it delivers, and the quality and safety principles behind its building, telecom, security and bollard work.",
  path: routes.about,
  image: heroMedia,
});

/** About (planning/DESIGN.md §9.3). Leadership, registrations and figures render only when FMECC supplies them. */
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
      <AboutValues values={company.values} />
      <AboutApproach steps={company.process} />
      <AboutServices services={services} />
      <AboutStandards />
      <AboutTeam leadership={company.leadership} />
      <AboutRegistrations registrations={company.registrations} />
      <CtaBand />
    </>
  );
}
