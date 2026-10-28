import { services } from "@/entities/service";
import { contactLinks, site, type ServiceSlug } from "@/shared/config";

import { QuoteForm } from "./QuoteForm";

/**
 * Quotation request (planning/ARCHITECTURE.md §8). Rendered on the server so the client form receives
 * plain values only: service names, the delivery target from `site` and the direct channels.
 * `id` is the anchor that `routes.quote()` links to.
 */
export function QuoteRequestForm({ defaultService, id = "quote" }: { defaultService?: ServiceSlug; id?: string }) {
  return (
    <QuoteForm
      id={id}
      defaultService={defaultService}
      services={services.map(({ slug, name, shortName }) => ({ slug, name, shortName }))}
      endpoint={site.formEndpoint}
      email={site.contact.email}
      channels={contactLinks}
    />
  );
}
