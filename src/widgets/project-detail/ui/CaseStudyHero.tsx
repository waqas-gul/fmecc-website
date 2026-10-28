import { ViewTransition } from "react";
import type { Route } from "next";

import { cn } from "@/shared/lib/utils";
import type { ImageAsset } from "@/shared/types/media";
import { Breadcrumbs, ColumnGuides, MediaImage, Section } from "@/shared/ui";

/*
 * Entrance in CSS only (`@starting-style` transitions and the `rise` keyframes, as in PageHero); the
 * image is the LCP element, so it only settles from a slight zoom. Reduced motion shows the end state.
 */
const fadeUp =
  "transition-[opacity,translate] duration-600 ease-out-expo starting:translate-y-4 starting:opacity-0 motion-reduce:transition-none";

/**
 * Case-study opening for a project or concept page (planning/DESIGN.md §9.3): breadcrumbs, a meta
 * line (number and discipline) with an optional status pill, an oversized title, the lede beside
 * the actions, then the hero image across the full width. `mediaTransition` names the image frame
 * for the morph from the card or feature that links here (React <ViewTransition>, ARCHITECTURE.md
 * §9). `label` is printed on the image, `caption` under it. The page's h1 lives here.
 */
export function CaseStudyHero({
  meta,
  category,
  status,
  title,
  lede,
  media,
  mediaTransition,
  label,
  caption,
  breadcrumbs,
  actions,
}: {
  meta?: string;
  category?: string;
  status?: string;
  title: string;
  lede?: string;
  media: ImageAsset;
  mediaTransition?: string;
  label?: string;
  caption?: string;
  breadcrumbs: { label: string; href?: Route }[];
  actions?: React.ReactNode;
}) {
  const frame = (
    <div className="relative aspect-[4/3] overflow-hidden bg-navy-900 max-lg:-mx-(--gutter) lg:aspect-[2/1] lg:rounded-md">
      <div className="absolute inset-0 transition-[scale] duration-1600 ease-out-expo starting:scale-108 motion-reduce:transition-none">
        <MediaImage
          asset={media}
          fill
          preload
          sizes="(min-width: 1536px) 1440px, (min-width: 1024px) 96vw, 134vw"
          className="object-cover lg:object-[50%_20%]"
        />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-linear-to-t from-navy-950/40 via-navy-950/0 to-navy-950/20" />
      <div aria-hidden className="pointer-events-none absolute inset-0 ring-1 ring-white/10 ring-inset lg:rounded-md" />
      {label && (
        <span className="type-label absolute top-4 left-4 rounded-full border border-white/30 bg-navy-950/55 px-3 py-1.5 whitespace-nowrap text-white backdrop-blur-sm sm:top-6 sm:left-6">
          {label}
        </span>
      )}
    </div>
  );

  return (
    <Section scheme="dark" spacing="none" container={false} className="overflow-hidden">
      <ColumnGuides size="wide" />
      <div className="shell-wide relative pt-[calc(var(--header-h)+1.5rem)] pb-16 lg:pb-24">
        <Breadcrumbs items={breadcrumbs} />

        <div className="mt-10 grid gap-y-8 lg:mt-14 lg:grid-cols-12 lg:gap-x-8">
          {(meta || category || status) && (
            <div className={cn("flex flex-wrap items-center justify-between gap-4 lg:col-span-12", fadeUp)}>
              <p className="type-label flex flex-wrap items-center gap-x-3 gap-y-2 text-ink-muted">
                <span aria-hidden className="h-px w-6 shrink-0 bg-highlight" />
                {meta && <span className="text-highlight tabular-nums">{meta}</span>}
                {meta && category && (
                  <span aria-hidden className="text-ink-subtle max-sm:hidden">
                    —
                  </span>
                )}
                {/* Its own line on phones, under the number. */}
                {category && <span className="max-sm:basis-full">{category}</span>}
              </p>
              {status && (
                <span className="type-label rounded-full border border-line-strong px-3 py-1.5 whitespace-nowrap text-ink">
                  {status}
                </span>
              )}
            </div>
          )}
          <h1
            className="max-w-[18ch] font-display text-display-xl font-bold motion-safe:animate-rise motion-safe:[animation-delay:80ms] lg:col-span-10"
          >
            {title}
          </h1>
          {lede && (
            <p className="max-w-[52ch] text-body-lg text-ink-muted motion-safe:animate-rise motion-safe:[animation-delay:160ms] lg:col-span-6 lg:self-end">
              {lede}
            </p>
          )}
          {actions && (
            <div className="flex flex-wrap gap-3 motion-safe:animate-rise motion-safe:[animation-delay:240ms] lg:col-span-5 lg:col-start-8 lg:justify-end lg:self-end">
              {actions}
            </div>
          )}
        </div>

        <figure className="mt-12 lg:mt-16">
          {mediaTransition ? (
            <ViewTransition name={mediaTransition} share="morph" default="none">
              {frame}
            </ViewTransition>
          ) : (
            frame
          )}
          {caption && (
            <figcaption className="type-label mt-4 flex items-center gap-3 text-ink-subtle">
              <span aria-hidden className="h-px w-6 shrink-0 bg-highlight" />
              {caption}
            </figcaption>
          )}
        </figure>
      </div>
    </Section>
  );
}
