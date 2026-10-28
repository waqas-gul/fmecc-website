"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquareQuote } from "lucide-react";

import { routes, SERVICE_SLUGS, type ServiceSlug } from "@/shared/config";
import { cn } from "@/shared/lib/utils";

/** Sections that already offer the quotation request; the shortcut steps aside while one is on screen. */
const QUOTE_ZONES = ["#next-step", "#site-footer"];

/** Share of the first viewport to scroll past before the shortcut appears (the header CTA covers the top). */
const SHOW_AFTER = 0.6;

/** On a service page the quote form opens with that service preselected. */
function serviceFor(pathname: string): ServiceSlug | undefined {
  const [section, slug] = pathname.split("/").filter(Boolean);
  return section === "services" ? SERVICE_SLUGS.find((candidate) => candidate === slug) : undefined;
}

/**
 * Floating "Get a quote" shortcut (planning/MASTER_PLAN.md §2: the quote CTA within one tap from
 * any page). Bottom-right, clear of the safe-area insets; it appears once the visitor has scrolled
 * past the top of the page and steps aside over the closing CTA band and the footer, which carry
 * the same request. Not rendered on the contact page. Hidden states use `visibility`, so it is
 * out of the tab order and the accessibility tree while invisible; with reduced motion it only
 * fades. The mobile menu, a modal dialog, covers it.
 */
export function QuoteShortcut() {
  const pathname = usePathname();
  const onContact = pathname.replace(/\/+$/, "") === routes.contact;
  const [past, setPast] = useState(false);
  const [inQuoteZone, setInQuoteZone] = useState(false);

  useEffect(() => {
    if (onContact) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      setPast(window.scrollY > window.innerHeight * SHOW_AFTER);
    };
    const schedule = () => {
      frame ||= requestAnimationFrame(measure);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    const showing = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? showing.add(entry.target) : showing.delete(entry.target)));
      setInQuoteZone(showing.size > 0);
    });
    QUOTE_ZONES.forEach((selector) => {
      const zone = document.querySelector(selector);
      if (zone) observer.observe(zone);
    });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, [onContact, pathname]);

  if (onContact) return null;
  const shown = past && !inQuoteZone;

  return (
    <Link
      href={routes.quote(serviceFor(pathname))}
      className={cn(
        "group fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-(--z-overlay) inline-flex h-12 items-center gap-3 rounded-full border border-white/15 bg-accent ps-1.5 pe-5 text-body-sm font-semibold text-accent-ink shadow-raised lg:right-8 lg:bottom-8 print:hidden",
        "transition-[opacity,translate,visibility,background-color] duration-250 ease-out-expo hover:bg-accent-hover",
        // Visible on light and dark sections alike: a navy ring inside a cyan outline.
        "focus-visible:ring-2 focus-visible:ring-navy-950 focus-visible:outline-cyan-500",
        shown ? "visible opacity-100" : "invisible translate-y-4 opacity-0 motion-reduce:translate-y-0",
      )}
    >
      <span
        aria-hidden
        className="grid size-9 place-items-center rounded-full bg-navy-950 text-cyan-500 transition-transform duration-250 ease-out-expo motion-safe:group-hover:-rotate-8"
      >
        <MessageSquareQuote className="size-[18px]" />
      </span>
      Get a quote
    </Link>
  );
}
