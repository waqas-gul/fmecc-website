import { ArrowRight } from "lucide-react";

import { routes } from "@/shared/config";
import { buildMetadata } from "@/shared/lib/seo";
import { LinkButton } from "@/shared/ui";
import { company } from "@/entities/company";
import { services } from "@/entities/service";
import { CtaBand } from "@/widgets/cta-band";
import { PageHero } from "@/widgets/page-hero";
import { DeliveryProcess, ServicePanels } from "@/widgets/service-detail";

// TODO(content): confirm the overview headline, lede and process introduction with FMECC.
export const metadata = buildMetadata({
  title: "Construction, Telecom and Security Services",
  description:
    "FMECC's four services: building construction, telecom tower rollout, security system installation and maintenance, and hydraulic parking bollards.",
  path: routes.services,
});

/** Services overview (planning/DESIGN.md §9.3): hero, four alternating service panels, shared process, CTA. */
export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Four services, from foundations to access control"
        lede="Building construction, telecom tower rollout, security systems and hydraulic parking bollards. Compare the scope of each service, then request a quotation for the work you need."
        breadcrumbs={[{ label: "Home", href: routes.home }, { label: "Services" }]}
        actions={
          <LinkButton href={routes.quote()} size="lg" icon={<ArrowRight />}>
            Request a quotation
          </LinkButton>
        }
      />
      <ServicePanels services={services} />
      <DeliveryProcess
        eyebrow="How we work"
        title="One delivery process"
        lede="Every service follows these stages. Each service page sets out the detail for that discipline."
        steps={company.process}
      />
      <CtaBand />
    </>
  );
}
