import Link from "next/link";
import { ArrowRight, ArrowUp } from "lucide-react";

import { contactLinks, footerNav, routes, site } from "@/shared/config";
import { BrandLogo, ColumnGuides, Container, LinkButton } from "@/shared/ui";

// 44 px tall rows: the links are touch targets (planning/DESIGN.md §5), so the rows carry the spacing.
const linkClasses = "inline-flex min-h-11 items-center rounded-sm text-body-sm text-ink-muted transition-colors duration-150 hover:text-ink";

/** Site footer on the brand scheme (planning/DESIGN.md §6.2). Contact details render only when supplied. */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer data-scheme="brand" className="relative overflow-hidden border-t border-line bg-surface text-ink">
      <ColumnGuides />
      <p
        aria-hidden
        className="pointer-events-none absolute -right-[0.04em] -bottom-[0.22em] hidden font-display text-[clamp(10rem,24vw,24rem)] leading-none font-extrabold tracking-tighter text-ink opacity-[0.04] select-none lg:block"
      >
        {site.name}
      </p>

      <Container className="relative pt-16 pb-10 lg:pt-24">
        <div className="flex flex-col gap-6 border-b border-line pb-12 lg:flex-row lg:items-end lg:justify-between">
          <Link href={routes.home} className="self-start rounded-sm">
            <BrandLogo size="lg" />
          </Link>
          <p className="max-w-md text-body-sm text-ink-muted">{site.description}</p>
        </div>

        <div className="grid gap-x-8 gap-y-12 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
          {footerNav.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h2 className="type-label text-ink-subtle">{group.heading}</h2>
              <ul className="mt-2 flex flex-col">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClasses}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="type-label text-ink-subtle">Contact</h2>
            <ul className="mt-2 flex flex-col">
              {contactLinks.map((link) => (
                <li key={link.kind}>
                  <a href={link.href} className={linkClasses}>
                    <span className="sr-only">{link.label}: </span>
                    {link.value}
                  </a>
                </li>
              ))}
              {site.contact.address && (
                <li className="py-3 text-body-sm whitespace-pre-line text-ink-muted">{site.contact.address}</li>
              )}
              {site.contact.hours && (
                <li className="py-3 text-body-sm whitespace-pre-line text-ink-muted">{site.contact.hours}</li>
              )}
              {contactLinks.length === 0 && (
                <li>
                  <Link href={routes.contact} className={linkClasses}>
                    Send an enquiry
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className="flex flex-col items-start gap-6">
            <h2 className="font-display text-heading-sm font-semibold">Have a project in mind?</h2>
            {/* Outline: the CTA band directly above already carries the page's primary quote button (DESIGN.md §7.1). */}
            <LinkButton href={routes.quote()} variant="outline" icon={<ArrowRight />}>
              Request a quotation
            </LinkButton>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body-sm text-ink-subtle">
            © {year} {site.legalName}
          </p>
          <a
            href="#top"
            className="type-label inline-flex min-h-11 items-center gap-2 self-start rounded-sm text-ink-muted transition-colors duration-150 hover:text-ink sm:self-auto"
          >
            Back to top
            <ArrowUp aria-hidden className="size-4" />
          </a>
        </div>
      </Container>
    </footer>
  );
}
