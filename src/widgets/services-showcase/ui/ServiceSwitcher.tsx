"use client";

import { useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { mediaQueries } from "@/shared/lib/animation";
import { gsap, ScrollTrigger, useGsap } from "@/shared/lib/gsap";
import { cn } from "@/shared/lib/utils";
import type { ImageAsset } from "@/shared/types/media";
import { MediaImage, Reveal } from "@/shared/ui";

/** Plain service fields; a `Service` holds an icon component and cannot cross into the client. */
export interface SwitcherItem {
  slug: string;
  index: number;
  name: string;
  shortName: string;
  summary: string;
  href: Route;
  /** 4:5 image for the desktop panel. */
  media: ImageAsset;
  /** Landscape image for the short frame below 1024 px. */
  wideMedia: ImageAsset;
}

// Pin only where the list and the media panel fit the viewport, and only when motion is allowed.
const PIN_QUERY = `${mediaQueries.lg} and (min-height: 700px) and ${mediaQueries.motionOk}`;
// Below 1024 px (Tailwind's `max-lg`) the frame stays in view and scroll position picks the service.
const STACK_QUERY = "(width < 64rem)";
/** Viewport line, as a fraction of its height, a service crosses to become active below 1024 px. */
const LINE = 0.6;

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Services switcher (planning/DESIGN.md §8, row 3). From 1024 px the list and a 4:5 media panel pin
 * while scrolling; scroll progress selects the active service and a cyan rule fills alongside.
 * Below 1024 px a short frame leads the list and, in portrait, pins under a header-high band while
 * the services scroll beneath it; each becomes active as it crosses the viewport line, in either
 * direction. Hover and keyboard focus also select a service, which is the whole interaction when
 * the desktop section does not pin (reduced motion, short viewports). The first service is the
 * resting state.
 */
export function ServiceSwitcher({ items, className }: { items: SwitcherItem[]; className?: string }) {
  const [active, setActive] = useState(0);
  const [tracking, setTracking] = useState(false);
  const count = items.length;

  const scopeRef = useGsap<HTMLDivElement>(
    (_ctx, scope) => {
      const pinned = scope.querySelector("[data-animate='switcher-pin']");
      const fill = scope.querySelector("[data-animate='switcher-fill']");
      const list = scope.querySelector("[data-animate='switcher-list']");
      const rows = gsap.utils.toArray<HTMLElement>("[data-animate='switcher-item']", scope);
      if (!pinned || !fill || !list || count < 2) return;

      gsap.matchMedia().add(PIN_QUERY, () => {
        gsap.set(fill, { opacity: 1 });
        gsap.fromTo(
          fill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: pinned,
              start: "center center",
              end: "+=150%",
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              onUpdate: (self) => setActive(Math.min(count - 1, Math.floor(self.progress * count))),
            },
          },
        );
      });

      // Choosing the service is content, not decoration, so it also runs with reduced motion; only
      // the rule fill below is motion. Read from positions, so a fast scroll cannot skip a change.
      gsap.matchMedia().add(STACK_QUERY, () => {
        const pick = () => {
          const line = window.innerHeight * LINE;
          setActive(rows.reduce((current, row, index) => (row.getBoundingClientRect().top <= line ? index : current), 0));
        };
        ScrollTrigger.create({ trigger: list, start: "top bottom", end: "bottom top", onUpdate: pick, onRefresh: pick });
        setTracking(true);
        pick();
        return () => {
          setTracking(false);
          setActive(0);
        };
      });

      gsap.matchMedia().add(`${STACK_QUERY} and ${mediaQueries.motionOk}`, () => {
        gsap.set(fill, { opacity: 1 });
        gsap.fromTo(
          fill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: list, start: `top ${LINE * 100}%`, end: `bottom ${LINE * 100}%`, scrub: 0.6 },
          },
        );
      });
    },
    [count],
  );

  return (
    <div ref={scopeRef} className={className}>
      {/* Flex below 1024 px: a sticky grid item could not leave its own row. */}
      <div data-animate="switcher-pin" className="flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:items-center">
        <div className="relative lg:col-span-5">
          <div aria-hidden className="absolute inset-y-0 left-0 w-px bg-line">
            <span data-animate="switcher-fill" className="absolute inset-0 origin-top bg-highlight opacity-0" />
          </div>

          <ol data-animate="switcher-list">
            {items.map((item, index) => {
              const isActive = index === active;
              return (
                <li
                  key={item.slug}
                  data-animate="switcher-item"
                  // Mouse only: a finger starting a scroll on a row must not select it.
                  onPointerEnter={(event) => event.pointerType === "mouse" && setActive(index)}
                  className="group/item relative grid grid-cols-[2rem_1fr] items-baseline py-7 ps-8 lg:py-4 xl:py-5"
                >
                  <span
                    className={cn(
                      "type-label tabular-nums transition-colors duration-250",
                      isActive ? "text-highlight" : "text-ink-subtle",
                    )}
                  >
                    {pad(item.index)}
                  </span>
                  <h3
                    className={cn(
                      "flex items-center gap-3 font-display text-heading-md font-semibold transition-colors duration-250",
                      isActive ? "text-ink" : "text-ink-muted",
                    )}
                  >
                    <Link href={item.href} onFocus={() => setActive(index)} className="after:absolute after:inset-0">
                      {item.shortName}
                    </Link>
                    {/* "Explore" cue: visible on the active item, on hover elsewhere. */}
                    <ArrowRight
                      aria-hidden
                      className={cn(
                        "size-5 shrink-0 text-accent-text transition-[opacity,translate] duration-250",
                        isActive
                          ? "opacity-100"
                          : "opacity-0 motion-safe:-translate-x-1 group-hover/item:translate-x-0 group-hover/item:opacity-100",
                      )}
                    />
                  </h3>
                  <p className="col-start-2 mt-2 line-clamp-2 max-w-[44ch] text-body-sm text-ink-muted">{item.summary}</p>
                </li>
              );
            })}
          </ol>
        </div>

        <div
          className={cn(
            "max-lg:order-first max-lg:bg-surface max-lg:pt-[calc(var(--header-h)_+_0.75rem)] max-lg:pb-4 lg:col-span-6 lg:col-start-7",
            tracking && "max-lg:portrait:sticky max-lg:portrait:top-0 max-lg:portrait:z-(--z-raised)",
          )}
        >
          {/* 4:5 from 1024 px; below, a short full-width frame showing each service's landscape image. */}
          <Reveal
            variant="media-scale"
            className="relative h-[clamp(12rem,32svh,20rem)] w-full overflow-hidden rounded-md bg-navy-800 lg:aspect-[4/5] lg:h-auto lg:max-h-[calc(100svh_-_var(--header-h)_*_2)]"
          >
            {items.map((item, index) => {
              const isActive = index === active;
              return (
                <div
                  key={item.slug}
                  aria-hidden={!isActive}
                  className={cn(
                    "absolute inset-0 transition-[opacity,scale] duration-700 ease-out-expo motion-reduce:duration-150",
                    isActive ? "opacity-100" : "opacity-0 motion-safe:scale-106",
                  )}
                >
                  <MediaImage asset={item.wideMedia} fill sizes="100vw" className="object-cover lg:hidden" />
                  <MediaImage asset={item.media} fill sizes="(min-width: 1280px) 39rem, 50vw" className="object-cover max-lg:hidden" />
                  <div
                    data-scheme="dark"
                    className="absolute inset-x-0 top-0 flex items-start justify-between gap-6 bg-linear-to-b from-navy-950/75 to-transparent p-5 pb-12 lg:from-navy-950/60 lg:p-6 lg:pb-20"
                  >
                    <span className="type-label text-highlight tabular-nums">
                      {pad(item.index)} / {pad(count)}
                    </span>
                    <span className="type-label text-right">{item.shortName}</span>
                  </div>
                </div>
              );
            })}
          </Reveal>

          {/* Soft edge the services fade under while the frame is pinned. */}
          {tracking && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-full h-6 bg-linear-to-b from-surface to-transparent lg:hidden landscape:hidden"
            />
          )}
        </div>
      </div>
    </div>
  );
}
