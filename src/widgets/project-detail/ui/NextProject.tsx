import { ViewTransition } from "react";
import type { Route } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { ImageAsset } from "@/shared/types/media";
import { MediaImage, Reveal, Section } from "@/shared/ui";

/**
 * Closing navigation of a case study (planning/DESIGN.md §9.3): one cinematic panel for the next
 * entry, its image across the full width with the title set over it. The whole panel is one link.
 * The image frame carries the next entry's `mediaTransition`, so following the link morphs it into
 * that page's hero (ARCHITECTURE.md §9). Hover or focus slowly zooms the image and fills the arrow.
 */
export function NextProject({
  heading,
  position,
  category,
  title,
  href,
  media,
  mediaTransition,
}: {
  heading: string;
  /** For example "03 / 04". */
  position?: string;
  category?: string;
  title: string;
  href: Route;
  media: ImageAsset;
  mediaTransition?: string;
}) {
  // The title names the link; the image repeats it, so it is decorative here.
  const frame = (
    <div className="absolute inset-0">
      <MediaImage
        asset={{ ...media, alt: "" }}
        fill
        sizes="(min-width: 1536px) 1440px, (min-width: 1024px) 96vw, 134vw"
        className="parallax-media object-cover transition-[scale] duration-1200 ease-out-expo lg:object-[50%_20%] motion-safe:group-hover:scale-[1.04] motion-safe:group-focus-visible:scale-[1.04]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-linear-to-t from-navy-950/90 via-navy-950/35 to-navy-950/10" />
    </div>
  );

  return (
    <Section scheme="dark" container="wide" guides>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="type-label flex items-center gap-3 text-ink-muted">
          <span aria-hidden className="h-px w-6 shrink-0 bg-highlight" />
          {heading}
          {position && <span className="text-highlight tabular-nums">{position}</span>}
        </h2>
        {category && <p className="type-label text-ink-subtle">{category}</p>}
      </div>

      <Reveal variant="media-scale" className="mt-8 lg:mt-10">
        <Link
          href={href}
          aria-label={`${heading}: ${title}`}
          className="group parallax-frame relative block aspect-[4/3] overflow-hidden bg-navy-900 max-lg:-mx-(--gutter) sm:aspect-[16/9] lg:aspect-[21/9] lg:rounded-md"
        >
          {mediaTransition ? (
            <ViewTransition name={mediaTransition} share="morph" default="none">
              {frame}
            </ViewTransition>
          ) : (
            frame
          )}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-5 sm:p-8 lg:p-12">
            <p className="max-w-[16ch] font-display text-display-lg font-bold text-white">{title}</p>
            <span
              aria-hidden
              className="grid size-14 shrink-0 place-items-center rounded-full border border-white/40 text-white transition-[background-color,border-color] duration-300 ease-standard group-hover:border-accent group-hover:bg-accent group-focus-visible:border-accent group-focus-visible:bg-accent lg:size-16"
            >
              <ArrowRight className="size-5 transition-[translate] duration-500 ease-out-expo motion-safe:group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </Reveal>
    </Section>
  );
}
