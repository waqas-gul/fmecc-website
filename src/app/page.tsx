// TEMPORARY WS-0 STUB. WS-1 owns this file and replaces it with the Home page
// (planning/MASTER_PLAN.md §5). It renders shared foundation pieces only, so the build can be reviewed.
import { ArrowRight } from "lucide-react";

import { routes, site } from "@/shared/config";
import { buildMetadata } from "@/shared/lib/seo";
import { LinkButton } from "@/shared/ui";
import { CtaBand } from "@/widgets/cta-band";
import { PageHero } from "@/widgets/page-hero";

export const metadata = buildMetadata({ title: site.legalName, description: site.description, path: routes.home });

export default function HomePage() {
  return (
    <>
      <PageHero
        eyebrow={site.legalName}
        title={site.tagline}
        lede={site.description}
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
      <CtaBand />
    </>
  );
}
