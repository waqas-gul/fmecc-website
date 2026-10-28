"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

import { contactLinks, mainNav, routes } from "@/shared/config";
import { BrandLogo, LinkButton } from "@/shared/ui";

import { isActivePath, pad } from "../lib/nav";

// Entrance stagger with @starting-style: no animation library on the every-page bundle.
const staggerClasses =
  "transition-[opacity,translate] duration-500 ease-out-expo starting:opacity-0 motion-safe:starting:translate-y-4 [transition-delay:calc(var(--i)*50ms_+_60ms)]";

/**
 * Full-screen menu below 1024 px (planning/DESIGN.md §6.1). A modal <dialog> provides focus
 * containment and an inert page; Escape closes it, focus returns to the trigger, scroll is locked.
 * Browsers without @starting-style open and close it without the fade.
 */
export function MobileMenu({
  id,
  open,
  onClose,
  returnFocusRef,
  pathname,
}: {
  id: string;
  open: boolean;
  onClose: () => void;
  returnFocusRef: React.RefObject<HTMLButtonElement | null>;
  pathname: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!open) {
      if (dialog.open) dialog.close();
      return;
    }

    if (!dialog.open) dialog.showModal();
    closeRef.current?.focus();

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const desktop = window.matchMedia("(min-width: 1024px)");
    const onDesktop = () => {
      if (desktop.matches) onClose();
    };
    desktop.addEventListener("change", onDesktop);

    return () => {
      root.style.overflow = previousOverflow;
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open, onClose]);

  return (
    <dialog
      ref={dialogRef}
      id={id}
      aria-label="Site menu"
      data-scheme="brand"
      // Fires for Escape, programmatic close and link navigation alike.
      onClose={() => {
        onClose();
        returnFocusRef.current?.focus();
      }}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("a")) onClose();
      }}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-surface p-0 opacity-0 transition-[opacity,display,overlay] transition-discrete duration-250 ease-standard backdrop:bg-transparent open:opacity-100 starting:open:opacity-0"
    >
      <div className="flex h-full flex-col overflow-y-auto">
        <div className="shell-content flex h-16 shrink-0 items-center justify-between">
          <Link href={routes.home} className="rounded-sm">
            <BrandLogo size="sm" plate />
          </Link>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-sm"
          >
            <X aria-hidden className="size-6" />
            <span className="sr-only">Close menu</span>
          </button>
        </div>

        <nav aria-label="Main" className="shell-content flex-1 pt-4 pb-10">
          <ul className="flex flex-col">
            {mainNav.map((item, index) => (
              <li
                key={item.label}
                style={{ "--i": index } as React.CSSProperties}
                className={`border-b border-line ${staggerClasses}`}
              >
                <Link
                  href={item.href}
                  aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
                  className="group flex items-center justify-between gap-4 py-5 font-display text-display-lg font-bold aria-[current=page]:text-accent-text"
                >
                  {item.label}
                  <ArrowRight
                    aria-hidden
                    className="size-6 shrink-0 text-highlight transition-transform duration-150 motion-safe:group-hover:translate-x-1"
                  />
                </Link>
                {item.children && (
                  <ul className="flex flex-col gap-1 pb-6">
                    {item.children.map((child, childIndex) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          aria-current={isActivePath(pathname, child.href) ? "page" : undefined}
                          className="flex items-baseline gap-4 rounded-sm py-2 text-body-lg text-ink-muted transition-colors duration-150 hover:text-ink aria-[current=page]:text-ink"
                        >
                          <span aria-hidden className="type-label text-highlight tabular-nums">{pad(childIndex + 1)}</span>
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div
          style={{ "--i": mainNav.length } as React.CSSProperties}
          className={`shell-content shrink-0 border-t border-line py-6 ${staggerClasses}`}
        >
          {contactLinks.length > 0 && (
            <ul className="mb-5 flex flex-wrap gap-x-6 gap-y-3">
              {contactLinks.map((link) => (
                <li key={link.kind}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-11 items-center gap-2 text-body-sm text-ink-muted hover:text-ink"
                  >
                    <span className="type-label text-highlight">{link.label}</span>
                    {link.value}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <LinkButton href={routes.quote()} size="lg" fullWidth icon={<ArrowRight />}>
            Request a quotation
          </LinkButton>
        </div>
      </div>
    </dialog>
  );
}
