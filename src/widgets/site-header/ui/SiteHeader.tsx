"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, Phone } from "lucide-react";

import { contactLinks, routes } from "@/shared/config";
import { cn } from "@/shared/lib/utils";
import { BrandLogo, Container, LinkButton } from "@/shared/ui";

import { useHeaderScroll } from "../lib/useHeaderScroll";
import { DesktopNav } from "./DesktopNav";
import { MobileMenu } from "./MobileMenu";

/**
 * Site header (planning/DESIGN.md §6.1). `overlay` is transparent with white ink over a dark hero;
 * `solid` is a light bar and reserves its own height. Both turn compact and solid after 24 px,
 * hide on scroll-down and return on scroll-up, and stay visible while a menu is open or focused.
 * Transitions are CSS-only so no animation library ships on every page.
 */
export function SiteHeader({ variant = "solid" }: { variant?: "overlay" | "solid" }) {
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const { scrolled, hidden } = useHeaderScroll(menuOpen || servicesOpen || focusWithin);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Close menus when the route changes (covers back/forward as well as link clicks).
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
    setServicesOpen(false);
  }

  const transparent = variant === "overlay" && !scrolled;
  const phone = contactLinks.find((link) => link.kind === "phone");

  return (
    <>
      <header
        data-scheme={transparent ? "brand" : "light"}
        onFocus={() => setFocusWithin(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocusWithin(false);
        }}
        className={cn(
          "fixed inset-x-0 top-0 z-(--z-header) h-(--header-h)",
          "transition-[height,background-color,box-shadow,translate,color] duration-250 ease-out-expo",
          transparent && "bg-transparent",
          !transparent && !scrolled && "border-b border-line bg-surface",
          scrolled && "bg-surface/92 backdrop-blur-md lg:h-16",
          // The raised shadow reaches ~40 px below the bar, so a hidden header must not keep it.
          scrolled && !hidden && "shadow-raised",
          hidden && "-translate-y-full",
        )}
      >
        <Container size="wide" className="flex h-full items-center gap-4">
          <div className="flex flex-1 items-center">
            <Link href={routes.home} aria-current={pathname === "/" ? "page" : undefined} className="-m-1 rounded-sm p-1">
              <BrandLogo size="md" />
            </Link>
          </div>

          <DesktopNav pathname={pathname} servicesOpen={servicesOpen} onServicesOpenChange={setServicesOpen} />

          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
            {phone && (
              <a
                href={phone.href}
                className="hidden size-11 items-center justify-center rounded-sm text-ink-muted transition-colors duration-150 hover:text-ink xl:inline-flex"
              >
                <Phone aria-hidden className="size-[18px]" />
                <span className="sr-only">Call {phone.value}</span>
              </a>
            )}
            {/* max-lg:hidden, not `hidden lg:inline-flex`: a base display class would lose to the button's own. */}
            <LinkButton href={routes.quote()} icon={<ArrowRight />} className="max-lg:hidden">
              Request a quotation
            </LinkButton>
            <LinkButton href={routes.quote()} size="sm" className="lg:hidden">
              Get a quote
            </LinkButton>
            <button
              ref={menuButtonRef}
              type="button"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              onClick={() => setMenuOpen(true)}
              className="-mr-2 inline-flex size-11 items-center justify-center rounded-sm text-ink lg:hidden"
            >
              <Menu aria-hidden className="size-6" />
              <span className="sr-only">Open menu</span>
            </button>
          </div>
        </Container>
      </header>

      <MobileMenu id="site-menu" open={menuOpen} onClose={closeMenu} returnFocusRef={menuButtonRef} pathname={pathname} />
      {variant === "solid" && <div aria-hidden className="h-(--header-h)" />}
    </>
  );
}
