import { ArrowDown } from "lucide-react";

import { ContactChannels } from "@/features/contact-channels";
import { QuoteRequestForm } from "@/features/quote-request";
import { routes } from "@/shared/config";
import { buildMetadata } from "@/shared/lib/seo";
import { LinkButton, Section } from "@/shared/ui";
import { ContactPanel } from "@/widgets/contact-panel";
import { CtaBand } from "@/widgets/cta-band";
import { PageHero } from "@/widgets/page-hero";

export const metadata = buildMetadata({
  title: "Contact and quotation",
  description:
    "Request a quotation from FMECC for building construction, telecom tower rollout, security systems or hydraulic parking bollards.",
  path: routes.contact,
});

/**
 * Contact and quotation (planning/DESIGN.md §9.3): channels and location beside the quote form,
 * stacked with channels first on mobile. The hero repeats the direct channels so they are visible
 * without scrolling at phone width (planning/MASTER_PLAN.md §2).
 */
export default function ContactPage() {
  return (
    <>
      {/* TODO(content): FMECC to confirm the hero and closing copy. */}
      <PageHero
        eyebrow="Contact and quotation"
        title="Tell us about your project."
        lede="Share the site, the scope and the timing, and we will come back to you with the next step."
        breadcrumbs={[{ label: "Home", href: routes.home }, { label: "Contact" }]}
        actions={
          <>
            <LinkButton href={routes.quote()} size="lg" icon={<ArrowDown />}>
              Start a quotation request
            </LinkButton>
            <ContactChannels layout="inline" />
          </>
        }
      />
      <Section scheme="light">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5 lg:pr-6">
            <ContactPanel />
          </div>
          <div className="min-w-0 lg:col-span-7">
            <QuoteRequestForm />
          </div>
        </div>
      </Section>
      <CtaBand
        title="Want to see how we work first?"
        description="Explore the four service areas and the way we deliver each one."
        primary={{ label: "Explore services", href: routes.services }}
      />
    </>
  );
}
