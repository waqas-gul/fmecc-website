import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { routes } from "@/shared/config";
import { buildMetadata, JsonLd, serviceJsonLd } from "@/shared/lib/seo";
import { LinkButton } from "@/shared/ui";
import { getProjectsByService } from "@/entities/project";
import { getService, services } from "@/entities/service";
import { CtaBand } from "@/widgets/cta-band";
import { PageHero } from "@/widgets/page-hero";
import { RelatedProjects, ServiceFaq, ServiceOverview, ServiceProcess, ServiceScope } from "@/widgets/service-detail";
import { ServiceShowcase } from "@/widgets/service-showcase";

// Static export serves only the four generated pages; any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return {};

  return buildMetadata({
    title: service.seo.title,
    description: service.seo.description,
    path: routes.service(service.slug),
    image: service.hero,
  });
}

/**
 * Service page template shared by all four services (planning/DESIGN.md §9.1): hero, overview,
 * scope, process, showcase, related projects, FAQ and the quotation CTA with the service preselected.
 */
export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const service = getService((await params).slug);
  if (!service) notFound();

  const quoteHref = routes.quote(service.slug);

  return (
    <>
      <PageHero
        eyebrow="Service"
        index={service.index}
        title={service.name}
        lede={service.tagline}
        media={service.video ?? service.hero}
        breadcrumbs={[
          { label: "Home", href: routes.home },
          { label: "Services", href: routes.services },
          { label: service.shortName },
        ]}
        actions={
          <LinkButton href={quoteHref} size="lg" icon={<ArrowRight />}>
            Request a quotation
          </LinkButton>
        }
      />
      <ServiceOverview service={service} />
      <ServiceScope service={service} />
      <ServiceProcess service={service} />
      <ServiceShowcase service={service} />
      <RelatedProjects service={service} projects={getProjectsByService(service.slug, 3)} />
      <ServiceFaq service={service} />
      <CtaBand primary={{ label: "Request a quotation", href: quoteHref }} />
      <JsonLd data={serviceJsonLd(service)} />
    </>
  );
}
