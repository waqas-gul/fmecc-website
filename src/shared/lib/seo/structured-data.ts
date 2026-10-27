import { brandLogo, contactLinks, routes, site, type ServiceSlug } from "@/shared/config";

import { absoluteUrl } from "./url";

const CONTEXT = "https://schema.org";

/** Organization data built only from fields FMECC has supplied (planning/MASTER_PLAN.md §8). */
export function organizationJsonLd(): object {
  const phone = contactLinks.find((link) => link.kind === "phone")?.value;
  const email = contactLinks.find((link) => link.kind === "email")?.value;
  const sameAs = Object.values(site.social).filter((url): url is string => Boolean(url));

  return {
    "@context": CONTEXT,
    "@type": "Organization",
    name: site.legalName,
    alternateName: site.name,
    url: absoluteUrl(routes.home),
    description: site.description,
    ...(brandLogo && { logo: new URL(brandLogo.src, `${site.url}/`).toString() }),
    ...(site.contact.address && { address: site.contact.address }),
    ...((phone || email) && {
      contactPoint: [
        { "@type": "ContactPoint", contactType: "sales", ...(phone && { telephone: phone }), ...(email && { email }) },
      ],
    }),
    ...(sameAs.length > 0 && { sameAs }),
  };
}

/** Accepts any service entity: only these fields are read. */
export function serviceJsonLd(service: { slug: ServiceSlug; name: string; summary: string }): object {
  return {
    "@context": CONTEXT,
    "@type": "Service",
    name: service.name,
    serviceType: service.name,
    description: service.summary,
    url: absoluteUrl(routes.service(service.slug)),
    provider: { "@type": "Organization", name: site.legalName, url: absoluteUrl(routes.home) },
  };
}

export function breadcrumbJsonLd(items: { label: string; href?: string }[]): object {
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href && { item: absoluteUrl(item.href) }),
    })),
  };
}
