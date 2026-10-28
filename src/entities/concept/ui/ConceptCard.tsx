import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { routes, serviceNav } from "@/shared/config";
import { cn } from "@/shared/lib/utils";
import { Badge, MediaImage } from "@/shared/ui";

import { conceptNumber } from "../model/registry";
import type { ProjectConcept } from "../model/types";

const sizes = {
  default: "(min-width: 1280px) 620px, (min-width: 640px) 50vw, 100vw",
  compact: "(min-width: 1280px) 420px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  featured: "(min-width: 1280px) 860px, (min-width: 1024px) 66vw, 100vw",
} as const;

/**
 * Concept tile: large media with an always-visible "Illustrative concept" label, so the card can
 * never be read as a delivered FMECC project. The whole card is one link named by the title; its
 * focus ring outlines the card. Hover zooms the image slightly and nudges the arrow.
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

  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className="relative overflow-hidden rounded-md bg-surface-muted">
        <MediaImage
          asset={concept.hero}
          sizes={sizes[variant]}
          className={cn(
            "w-full object-cover transition-transform duration-700 ease-out-expo motion-safe:group-hover:scale-[1.04]",
            variant === "featured" ? "aspect-[3/2]" : "aspect-[4/3]",
          )}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-linear-to-t from-navy-950/70 via-navy-950/5 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4 sm:p-5">
          {/* The number is decorative; on narrow cards it gives way so the label stays on one line. */}
          <span aria-hidden className="type-label whitespace-nowrap text-white tabular-nums max-sm:hidden">
            Concept {number}
          </span>
          <span className="type-label ms-auto rounded-full border border-white/30 bg-navy-950/55 px-3 py-1.5 whitespace-nowrap text-white backdrop-blur-sm">
            Illustrative concept
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 pt-5">
        <div className="flex flex-wrap gap-2">
          <Badge>{service}</Badge>
        </div>
        <h3
          className={cn(
            "font-display font-semibold text-ink",
            variant === "featured" ? "text-heading-md" : "text-heading-sm",
          )}
        >
          <Link
            href={routes.concept(concept.slug)}
            className="after:absolute after:inset-0 after:rounded-md focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-focus"
          >
            {concept.title}
          </Link>
        </h3>
        <p className="max-w-[52ch] text-body-sm text-ink-muted">{concept.summary}</p>
        <span aria-hidden className="type-label mt-auto inline-flex items-center gap-2 pt-2 text-accent-text">
          View concept
          <ArrowRight className="size-4 transition-transform duration-150 motion-safe:group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
