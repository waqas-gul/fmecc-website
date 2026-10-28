import { ViewTransition } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { routes, serviceNav } from "@/shared/config";
import { cn } from "@/shared/lib/utils";
import { MediaImage, Reveal } from "@/shared/ui";

import { conceptMediaTransition, conceptNumber } from "../model/registry";
import type { ProjectConcept } from "../model/types";

type Layout = "wide" | "tall-end" | "tall-start" | "panorama";

// Four compositions in turn, so neighbouring features never repeat: a wide frame beside the text, a
// tall frame on the right, a tall frame on the left, then a full-width panorama with the text below.
// Chosen by the concept's place in the whole list, so a feature keeps its composition when filtered.
const LAYOUTS: readonly Layout[] = ["wide", "tall-end", "tall-start", "panorama"];

// The wide frame sits on the baseline of the text column, so the number rises above its top edge.
const frameClasses: Record<Layout, string> = {
  wide: "lg:col-span-7 lg:self-end lg:aspect-[4/3]",
  "tall-end": "lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:aspect-[4/5]",
  "tall-start": "lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:aspect-[4/5]",
  panorama: "lg:col-span-12 lg:aspect-[21/9]",
};

const textClasses: Record<Layout, string> = {
  wide: "lg:col-span-4 lg:col-start-9",
  "tall-end": "lg:col-span-5 lg:col-start-2 lg:row-start-1",
  "tall-start": "lg:col-span-5 lg:col-start-7 lg:row-start-1",
  panorama: "lg:col-span-12 lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-8",
};

// Width the 16:9 hero renders at: it covers every frame, so tall and 4:3 frames show it wider than
// the frame itself (a 4:5 frame is 2.2 times its width tall in image terms; 4:3 is 1.33 times).
const sizes: Record<Layout, string> = {
  wide: "(min-width: 1024px) 62vw, 134vw",
  "tall-end": "(min-width: 1024px) 88vw, 134vw",
  "tall-start": "(min-width: 1024px) 88vw, 134vw",
  panorama: "(min-width: 1536px) 1440px, (min-width: 1024px) 96vw, 134vw",
};

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Editorial portfolio feature for one concept (planning/DESIGN.md §9.3): a large framed image, an
 * oversized outlined number, the discipline, a display title, the one-line summary, a short spec
 * row and an "Explore concept" control. The frame always carries the "Illustrative concept" label.
 *
 * Motion: the image is wiped open by a surface-coloured cover while it settles from a slight zoom,
 * then drifts inside its frame as the page scrolls (CSS); the number's digits roll up into place and
 * drift at their own pace; the text rises in sequence. Hover or keyboard focus slowly zooms the
 * image, turns the title blue and fills the arrow disc. The whole feature is one link named by the
 * title, and with `morph` its media frame morphs into the concept page hero on navigation
 * (ARCHITECTURE.md §9). Leave `morph` off in markup that is swapped out on hydration, such as a
 * Suspense fallback: the swap would pair the frames and start a view transition on page load.
 */
export function ConceptFeature({
  concept,
  morph = true,
  className,
}: {
  concept: ProjectConcept;
  morph?: boolean;
  className?: string;
}) {
  const position = conceptNumber(concept.slug);
  const layout = LAYOUTS[(position - 1) % LAYOUTS.length];
  const panorama = layout === "panorama";
  const service = serviceNav.find((item) => item.slug === concept.service)?.label ?? concept.service;
  const number = pad(position);
  const media = (
    <div className="absolute inset-0">
      <MediaImage
        asset={concept.hero}
        fill
        sizes={sizes[layout]}
        className={cn(
          "parallax-media object-cover transition-[scale] duration-1200 ease-out-expo motion-safe:group-hover:scale-[1.04] motion-safe:group-has-focus-visible:scale-[1.04]",
          panorama && "lg:object-top",
        )}
      />
      {/* A light grade and an inner hairline keep daylight photographs and dark renders balanced. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-linear-to-t from-navy-950/45 via-navy-950/0 to-navy-950/25" />
      <div aria-hidden className="pointer-events-none absolute inset-0 ring-1 ring-white/10 ring-inset lg:rounded-md" />
      <span className="type-label absolute top-4 left-4 rounded-full border border-white/30 bg-navy-950/55 px-3 py-1.5 whitespace-nowrap text-white backdrop-blur-sm sm:top-6 sm:left-6">
        Illustrative concept
      </span>
    </div>
  );

  return (
    <article
      id={`concept-${concept.slug}`}
      className={cn("group relative grid gap-y-8 sm:gap-y-10 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-12", className)}
    >
      <Reveal
        variant="media-mask"
        className={cn(
          "parallax-frame relative aspect-[4/3] overflow-hidden bg-navy-900 max-lg:-mx-(--gutter) lg:rounded-md",
          frameClasses[layout],
        )}
      >
        {morph ? (
          <ViewTransition name={conceptMediaTransition(concept.slug)} share="morph" default="none">
            {media}
          </ViewTransition>
        ) : (
          media
        )}
        <span data-reveal-cover aria-hidden className="pointer-events-none absolute inset-0 origin-top bg-surface opacity-0" />
      </Reveal>

      <div className={cn("flex flex-col lg:justify-between", textClasses[layout])}>
        <div
          className={cn(
            "flex items-end justify-between gap-6 lg:flex-col lg:items-start lg:justify-start",
            panorama && "lg:col-span-3 lg:self-stretch lg:justify-between",
          )}
        >
          <div aria-hidden className="parallax-drift">
            <Reveal
              as="span"
              variant="mask"
              stagger={0.09}
              className={cn(
                "-mb-[0.06em] flex overflow-hidden pb-[0.06em] font-display text-display-2xl font-bold tabular-nums",
                "text-transparent transition-[-webkit-text-stroke-color] duration-500 [-webkit-text-stroke:1.5px_var(--line-strong)] group-hover:[-webkit-text-stroke-color:var(--accent)]",
              )}
            >
              {number.split("").map((digit, index) => (
                <span key={index}>{digit}</span>
              ))}
            </Reveal>
          </div>
          <p className="type-label flex items-center gap-3 pb-2 text-ink-muted lg:pb-0">
            <span aria-hidden className="h-px w-6 shrink-0 bg-highlight" />
            <span className="sr-only">Concept {number}: </span>
            {service}
          </p>
        </div>

        <Reveal
          stagger={0.08}
          className={cn(
            "mt-6 flex flex-col gap-6 lg:mt-10",
            panorama && "lg:col-span-9 lg:mt-0 lg:grid lg:grid-cols-9 lg:gap-x-8",
          )}
        >
          <h3
            className={cn(
              "max-w-[15ch] font-display text-display-lg font-bold text-ink transition-colors duration-300 ease-standard group-hover:text-accent-text",
              panorama && "lg:col-span-5 lg:row-span-3",
            )}
          >
            <Link
              href={routes.concept(concept.slug)}
              className="after:absolute after:inset-0 after:z-(--z-raised) focus-visible:outline-none focus-visible:after:rounded-md focus-visible:after:outline-2 focus-visible:after:outline-offset-8 focus-visible:after:outline-focus"
            >
              {concept.title}
            </Link>
          </h3>
          <p className={cn("max-w-[44ch] text-body-lg text-ink-muted", panorama && "lg:col-span-4 lg:col-start-6")}>
            {concept.summary}
          </p>
          <dl
            className={cn(
              "grid grid-cols-2 gap-6 border-t border-line pt-5",
              panorama && "lg:col-span-4 lg:col-start-6",
            )}
          >
            <div className="flex flex-col gap-2">
              <dt className="type-label text-ink-subtle">Hypothetical scope</dt>
              <dd className="text-body-sm text-ink">{concept.scope.length} work packages</dd>
            </div>
            <div className="flex flex-col gap-2">
              <dt className="type-label text-ink-subtle">Status</dt>
              <dd className="text-body-sm text-ink">Illustrative concept</dd>
            </div>
          </dl>
          {/* Decorative: the title link above names the whole feature. */}
          <span
            aria-hidden
            className={cn("mt-2 inline-flex items-center gap-4 self-start", panorama && "lg:col-span-4 lg:col-start-6")}
          >
            <span className="grid size-14 place-items-center rounded-full border border-line-strong text-ink transition-[background-color,border-color,color] duration-300 ease-standard group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink group-has-focus-visible:border-accent group-has-focus-visible:bg-accent group-has-focus-visible:text-accent-ink">
              <ArrowUpRight className="size-5 transition-[rotate] duration-500 ease-out-expo motion-safe:group-hover:rotate-45 motion-safe:group-has-focus-visible:rotate-45" />
            </span>
            <span className="type-label relative text-ink after:absolute after:inset-x-0 after:-bottom-2 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-[scale] after:duration-500 after:ease-out-expo group-hover:after:scale-x-100 group-has-focus-visible:after:scale-x-100">
              Explore concept
            </span>
          </span>
        </Reveal>
      </div>
    </article>
  );
}
