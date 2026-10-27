import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { routes } from "@/shared/config";
import { LinkButton, Section } from "@/shared/ui";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/** 404 on the brand scheme with routes back into the site (planning/DESIGN.md §9.3). */
export default function NotFound() {
  return (
    <Section scheme="brand" spacing="none" container={false} guides>
      <div className="shell-content relative flex min-h-[80svh] flex-col justify-center pt-[calc(var(--header-h)+3rem)] pb-20">
        <p aria-hidden className="font-mono text-[clamp(5rem,16vw,11rem)] leading-none text-highlight tabular-nums">
          404
        </p>
        <h1 className="mt-8 max-w-[18ch] font-display text-display-lg font-bold">This page could not be found.</h1>
        <p className="mt-6 max-w-[55ch] text-body-lg text-ink-muted">
          The link may be out of date or the page may have moved. Continue with our services, or contact us
          directly.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <LinkButton href={routes.services} size="lg" icon={<ArrowRight />}>
            Explore services
          </LinkButton>
          <LinkButton href={routes.contact} size="lg" variant="outline">
            Contact FMECC
          </LinkButton>
        </div>
      </div>
    </Section>
  );
}
