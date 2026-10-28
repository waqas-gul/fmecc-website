"use client";

import { useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { mediaQueries } from "@/shared/lib/animation";
import { gsap, useGsap } from "@/shared/lib/gsap";
import { cn } from "@/shared/lib/utils";
import type { ImageAsset } from "@/shared/types/media";
import { MediaImage } from "@/shared/ui";

/** Plain service fields; a `Service` holds an icon component and cannot cross into the client. */
export interface SwitcherItem {
  slug: string;
  index: number;
  name: string;
  shortName: string;
  summary: string;
  href: Route;
  media: ImageAsset;
}

// Pin only where the list and the media panel fit the viewport, and only when motion is allowed.
const PIN_QUERY = `${mediaQueries.lg} and (min-height: 700px) and ${mediaQueries.motionOk}`;

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Desktop services switcher (planning/DESIGN.md §8, row 3). The list and a 4:5 media panel pin
 * while scrolling; scroll progress selects the active service and a cyan rule fills alongside.
 * Hover and keyboard focus also select a service, which is the whole interaction when the
 * section does not pin (reduced motion, short viewports). The first service is the resting state.
 */
export function ServiceSwitcher({ items, className }: { items: SwitcherItem[]; className?: string }) {
  const [active, setActive] = useState(0);
  const count = items.length;

  const scopeRef = useGsap<HTMLDivElement>(
    (_ctx, scope) => {
      const pinned = scope.querySelector("[data-animate='switcher-pin']");
      const fill = scope.querySelector("[data-animate='switcher-fill']");
      if (!pinned || !fill || count < 2) return;

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
    },
    [count],
  );

  return (
    <div ref={scopeRef} className={className}>
      <div data-animate="switcher-pin" className="grid grid-cols-12 items-center gap-8">
        <div className="relative col-span-5">
          <div aria-hidden className="absolute inset-y-0 left-0 w-px bg-line">
            <span data-animate="switcher-fill" className="absolute inset-0 origin-top bg-highlight opacity-0" />
          </div>

          <ol>
            {items.map((item, index) => {
              const isActive = index === active;
              return (
                <li
                  key={item.slug}
                  onPointerEnter={() => setActive(index)}
                  className="group/item relative grid grid-cols-[2rem_1fr] items-baseline py-4 ps-8 xl:py-5"
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

        <div className="col-span-6 col-start-7">
          <div className="relative aspect-[4/5] max-h-[calc(100svh_-_var(--header-h)_*_2)] w-full overflow-hidden rounded-md bg-navy-800">
            {items.map((item, index) => {
              const isActive = index === active;
              return (
                <div
                  key={item.slug}
                  aria-hidden={!isActive}
                  className={cn(
                    "absolute inset-0 transition-[opacity,scale] duration-500 ease-out-expo motion-reduce:duration-150",
                    isActive ? "opacity-100" : "opacity-0 motion-safe:scale-104",
                  )}
                >
                  <MediaImage asset={item.media} fill sizes="(min-width: 1280px) 39rem, 50vw" className="object-cover" />
                  <div
                    data-scheme="dark"
                    className="absolute inset-x-0 top-0 flex items-start justify-between gap-6 bg-linear-to-b from-navy-950/60 to-transparent p-6 pb-20"
                  >
                    <span className="type-label text-highlight tabular-nums">
                      {pad(item.index)} / {pad(count)}
                    </span>
                    <span className="type-label text-right">{item.shortName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
