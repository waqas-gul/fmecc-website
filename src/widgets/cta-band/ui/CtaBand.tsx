import type { Route } from "next";
import { ArrowRight } from "lucide-react";

import { contactLinks, routes } from "@/shared/config";
import type { Scheme } from "@/shared/types/scheme";
import { Container, Eyebrow, LinkButton, Section } from "@/shared/ui";

/**
 * Closing call to action before the footer (planning/DESIGN.md §8, row 7). Defaults to the
 * quotation request plus whichever direct contact channels FMECC has supplied.
 */
export function CtaBand({
  // The footer below carries "Have a project in mind?", so the band uses a different prompt.
  title = "Planning a new project?",
  description = "Tell us about the site, the scope and the timeline, and we will arrange the next step.",
  primary = { label: "Request a quotation", href: routes.quote() },
  scheme = "brand",
}: {
  title?: string;
  description?: string;
  primary?: { label: string; href: Route };
  scheme?: Scheme;
}) {
  return (
    // `next-step` also lets the floating quote shortcut step aside while this band is on screen.
    <Section id="next-step" scheme={scheme} guides container={false}>
      {/* Spectrum rule along the top edge (planning/DESIGN.md §2.4). */}
      <span aria-hidden className="spectrum-fill absolute inset-x-0 top-0 h-0.5" />
      <Container className="relative grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-8">
          <Eyebrow>Next step</Eyebrow>
          <h2 className="mt-6 max-w-[18ch] font-display text-display-lg font-bold">{title}</h2>
          <p className="mt-6 max-w-[55ch] text-body-lg text-ink-muted">{description}</p>
        </div>
        <div className="flex flex-col gap-6 lg:col-span-4 lg:items-end">
          <LinkButton href={primary.href} size="lg" icon={<ArrowRight />}>
            {primary.label}
          </LinkButton>
          {contactLinks.length > 0 && (
            <ul className="flex flex-wrap gap-x-6 gap-y-2 lg:justify-end">
              {contactLinks.map((link) => (
                <li key={link.kind}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-11 items-center gap-2 rounded-sm text-body-sm text-ink-muted transition-colors duration-150 hover:text-ink"
                  >
                    <span className="type-label text-highlight">{link.label}</span>
                    {link.value}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </Section>
  );
}
