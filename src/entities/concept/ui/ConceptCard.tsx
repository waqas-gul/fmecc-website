import { ViewTransition } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { routes, serviceNav } from "@/shared/config";
import { cn } from "@/shared/lib/utils";
import { Badge, MediaImage } from "@/shared/ui";

import { conceptMediaTransition, conceptNumber } from "../model/registry";
import type { ProjectConcept } from "../model/types";

const sizes = {
  default: "(min-width: 1280px) 620px, (min-width: 640px) 50vw, 100vw",
  compact: "(min-width: 1280px) 420px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  featured: "(min-width: 1280px) 860px, (min-width: 1024px) 66vw, 100vw",
} as const;

/**
 * Concept tile: large media with an always-visible "Illustrative concept" label, so the card can
 * never be read as a delivered FMECC project. The whole card is one link named by the title; its
 * focus ring outlines the card. Hover settles a slow zoom on the image, deepens the overlay and
 * nudges the arrows. A light navy grade and an inner hairline keep bright daylight photographs and
 * dark renders balanced side by side. The media frame morphs into the concept page hero on
 * navigation (React <ViewTransition>, ARCHITECTURE.md §9).
 */
export function ConceptCard({
  concept,
  variant = "default",
  className,
}: {
  concept: ProjectConcept;
  variant?: keyof typeof sizes;
  className?: string;
}) {
  const service = serviceNav.find((item) => item.slug === concept.service)?.label ?? concept.service;
  const number = String(conceptNumber(concept.slug)).padStart(2, "0");
  const compact = variant === "compact";

  return (
    <article className={cn("group relative flex flex-col", className)}>
      <ViewTransition name={conceptMediaTransition(concept.slug)} share="morph" default="none">
        <div className="relative isolate overflow-hidden rounded-md bg-navy-900">
          <MediaImage
            asset={concept.hero}
            sizes={sizes[variant]}
            className={cn(
              "w-full object-cover transition-[scale] duration-1000 ease-out-expo motion-safe:group-hover:scale-105",
              variant === "featured" ? "aspect-[3/2]" : "aspect-[4/3]",
            )}
          />
          {/* Grade and legibility: a faint navy wash, a bottom gradient for the labels, an inner hairline. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-navy-950/80 via-navy-950/10 to-navy-950/10 opacity-85 transition-opacity duration-500 ease-standard group-hover:opacity-100"
          />
          <div aria-hidden className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-white/10 ring-inset" />

          <span
            aria-hidden
            className="absolute top-4 right-4 grid size-10 place-items-center rounded-full border border-white/25 bg-navy-950/40 text-white backdrop-blur-sm transition-[background-color,border-color] duration-250 group-hover:border-white/50 group-hover:bg-navy-950/60 sm:top-5 sm:right-5"
          >
            <ArrowUpRight className="size-[18px] transition-transform duration-250 ease-out-expo motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" />
          </span>

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4 sm:p-5">
            {/* The number is decorative; on narrow cards it gives way so the label stays on one line. */}
            <span aria-hidden className={cn("type-label whitespace-nowrap text-white tabular-nums", compact ? "max-lg:hidden" : "max-sm:hidden")}>
              Concept {number}
            </span>
            <span className="type-label ms-auto rounded-full border border-white/30 bg-navy-950/55 px-3 py-1.5 whitespace-nowrap text-white backdrop-blur-sm">
              Illustrative concept
            </span>
          </div>
        </div>
      </ViewTransition>

      <div className={cn("flex flex-1 flex-col gap-3", compact ? "pt-5" : "pt-6")}>
        <div className="flex flex-wrap gap-2">
          <Badge>{service}</Badge>
        </div>
        <h3
          className={cn(
            "font-display font-semibold text-ink transition-colors duration-250 group-hover:text-accent-text",
            compact ? "text-heading-sm" : "text-heading-md",
          )}
        >
          <Link
            href={routes.concept(concept.slug)}
            className="after:absolute after:inset-0 after:rounded-md focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-focus"
          >
            {concept.title}
          </Link>
        </h3>
        <p className={cn("max-w-[52ch] text-ink-muted", compact ? "text-body-sm" : "text-body")}>{concept.summary}</p>
        <span
          aria-hidden
          className="type-label mt-auto flex items-center gap-2 border-t border-line pt-4 text-accent-text"
        >
          View concept
          <ArrowRight className="size-4 transition-transform duration-150 motion-safe:group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
