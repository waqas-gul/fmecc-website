"use client";

import { useEffect, useId, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

import { mainNav, type NavItem } from "@/shared/config";
import { cn } from "@/shared/lib/utils";

import { isActivePath, pad } from "../lib/nav";

// Mono labels with a 2 px accent bar for the current section (planning/DESIGN.md §6.1).
const itemClasses = cn(
  "type-label relative inline-flex h-11 items-center gap-1.5 rounded-sm px-3 text-ink-muted transition-colors duration-150 hover:text-ink",
  "after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:bg-accent",
  "after:transition-transform after:duration-250 after:ease-out-expo",
  "aria-[current=page]:text-ink aria-[current=page]:after:scale-x-100 data-[active=true]:text-ink data-[active=true]:after:scale-x-100",
);

export function DesktopNav({
  pathname,
  servicesOpen,
  onServicesOpenChange,
}: {
  pathname: string;
  servicesOpen: boolean;
  onServicesOpenChange: (open: boolean) => void;
}) {
  return (
    <nav aria-label="Main" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {mainNav.map((item) => (
          <li key={item.label}>
            {item.children ? (
              <ServicesMenu item={item} pathname={pathname} open={servicesOpen} onOpenChange={onServicesOpenChange} />
            ) : (
              <Link
                href={item.href}
                aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
                className={itemClasses}
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

const menuItems = (wrapper: HTMLElement | null) =>
  Array.from(wrapper?.querySelectorAll<HTMLAnchorElement>("[data-menu-item]") ?? []);

function focusMenuItem(wrapper: HTMLElement | null, index: number) {
  const items = menuItems(wrapper);
  items[(index + items.length) % items.length]?.focus();
}

/**
 * Disclosure navigation for the four services: opens on hover, click, Enter/Space or ArrowDown;
 * arrow keys, Home and End move between links; Escape, Tab-out and outside clicks close it.
 */
function ServicesMenu({
  item,
  pathname,
  open,
  onOpenChange,
}: {
  item: NavItem;
  pathname: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const panelId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const openedByHover = useRef(false);
  const focusFirst = useRef(false);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) onOpenChange(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open || !focusFirst.current) return;
    focusFirst.current = false;
    const frame = requestAnimationFrame(() => focusMenuItem(wrapperRef.current, 0));
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const items = menuItems(wrapperRef.current);
    const current = items.indexOf(document.activeElement as HTMLAnchorElement);
    switch (event.key) {
      case "Escape":
        if (!open) return;
        event.preventDefault();
        onOpenChange(false);
        buttonRef.current?.focus();
        return;
      case "ArrowDown":
        event.preventDefault();
        if (open) focusMenuItem(wrapperRef.current, current + 1);
        else {
          focusFirst.current = true;
          onOpenChange(true);
        }
        return;
      case "ArrowUp":
        if (!open) return;
        event.preventDefault();
        focusMenuItem(wrapperRef.current, current <= 0 ? -1 : current - 1);
        return;
      case "Home":
      case "End":
        if (!open || current === -1) return;
        event.preventDefault();
        focusMenuItem(wrapperRef.current, event.key === "Home" ? 0 : -1);
    }
  };

  const onPointerEnter = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    window.clearTimeout(closeTimer.current);
    if (!open) openedByHover.current = true;
    onOpenChange(true);
  };

  const onPointerLeave = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    closeTimer.current = window.setTimeout(() => onOpenChange(false), 150);
  };

  const onButtonClick = () => {
    // A click right after hover-open keeps the menu open instead of toggling it shut.
    if (openedByHover.current && open) openedByHover.current = false;
    else onOpenChange(!open);
  };

  const children = item.children ?? [];

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onKeyDown={onKeyDown}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onOpenChange(false);
      }}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("a")) onOpenChange(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        data-active={isActivePath(pathname, item.href)}
        onClick={onButtonClick}
        className={itemClasses}
      >
        {item.label}
        <ChevronDown
          aria-hidden
          className={cn("size-3.5 transition-transform duration-250 ease-out-expo", open && "rotate-180")}
        />
      </button>

      {/* Always mounted so it can fade out; `invisible` removes it from focus order and the a11y tree.
          Visibility flips instantly on open (so ArrowDown can focus an item) and only after the fade on close. */}
      <div
        id={panelId}
        data-scheme="light"
        className={cn(
          "absolute top-full left-1/2 w-[min(44rem,calc(100vw-2rem))] -translate-x-1/2 pt-3",
          open
            ? "visible opacity-100 [transition:opacity_250ms_var(--ease-out-expo),translate_250ms_var(--ease-out-expo),visibility_0s]"
            : "invisible opacity-0 motion-safe:translate-y-2 [transition:opacity_150ms_var(--ease-standard),translate_150ms_var(--ease-standard),visibility_0s_150ms]",
        )}
      >
        <div className="overflow-hidden rounded-md border border-line bg-surface-raised shadow-raised">
          <ul className="grid grid-cols-2 gap-px bg-line">
            {children.map((child, index) => {
              const Icon = child.icon;
              return (
                <li key={child.href} className="bg-surface-raised">
                  <Link
                    href={child.href}
                    data-menu-item=""
                    aria-current={isActivePath(pathname, child.href) ? "page" : undefined}
                    className="group/item flex h-full gap-4 p-5 transition-colors duration-150 hover:bg-surface-muted focus-visible:-outline-offset-2 aria-[current=page]:bg-surface-muted"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-sm border border-line text-highlight transition-colors duration-150 group-hover/item:border-accent group-hover/item:text-accent-text">
                      <Icon aria-hidden className="size-5" />
                    </span>
                    <span className="flex flex-col gap-1.5">
                      <span className="type-label text-ink-subtle tabular-nums">{pad(index + 1)}</span>
                      <span className="font-display text-body font-semibold text-ink">{child.label}</span>
                      <span className="text-body-sm text-ink-muted">{child.description}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="flex items-center justify-end border-t border-line bg-surface-muted px-5 py-3">
            <Link
              href={item.href}
              data-menu-item=""
              className="group/all type-label inline-flex h-9 items-center gap-2 rounded-sm text-accent-text"
            >
              All services
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform duration-150 motion-safe:group-hover/all:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
