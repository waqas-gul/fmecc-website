import { Fragment } from "react";
import type { Route } from "next";

import { cn } from "@/shared/lib/utils";
import type { ImageAsset } from "@/shared/types/media";
import { Breadcrumbs, ColumnGuides, Eyebrow, MediaImage, Section } from "@/shared/ui";

/*
 * Entrance as CSS transitions from `@starting-style`, as on Home: they run on first paint, before
 * hydration, and need no animation library. The render is the LCP element, so it only settles from
 * a slight zoom (never from opacity 0). Reduced motion, and browsers without `@starting-style`, show
 * the end state at once.
 */
const lineUp = "block transition-[translate] duration-1000 ease-out-expo starting:translate-y-[110%] motion-reduce:transition-none";
const fadeUp =
  "transition-[opacity,translate] duration-600 ease-out-expo starting:translate-y-4 starting:opacity-0 motion-reduce:transition-none";
const riseUp = "transition-[translate] duration-600 ease-out-expo starting:translate-y-4 motion-reduce:transition-none";
const delay = (ms: number) => ({ transitionDelay: `${ms}ms` });

const corners = [
  "top-0 left-0 border-t border-l",
  "top-0 right-0 border-t border-r",
  "bottom-0 left-0 border-b border-l",
  "bottom-0 right-0 border-b border-r",
] as const;

/**
 * Opening of the portfolio (planning/DESIGN.md §9.3): unlike the full-bleed video on Home, an
 * oversized two-line display title is set against a frameless 3D render that melts into the dark
 * surface inside cyan corner marks. Breadcrumbs above; below, the lede, the illustrative notice, a
 * row of plain facts and a scroll cue. Title lines rise out of masks in turn, the render settles
 * from a slight zoom, and as the hero leaves the viewport the render sinks and dims (CSS scroll
 * timeline). The page's h1 lives here.
 */
export function PortfolioHero({
  eyebrow,
  title,
  lede,
  notice,
  media,
  caption,
  facts = [],
  breadcrumbs,
  scrollTo,
}: {
  eyebrow: string;
  /** Display lines; every second line is indented. */
  title: readonly string[];
  lede: string;
  notice?: string;
  /** The page's LCP image: a render on the dark surface (4:5). */
  media: ImageAsset;
  caption?: string;
  facts?: readonly { label: string; value: string }[];
  breadcrumbs: { label: string; href?: Route }[];
  scrollTo?: { href: `#${string}`; label: string; description: string };
}) {
  return (
    <Section scheme="dark" spacing="none" container={false} className="overflow-hidden">
      <ColumnGuides size="wide" />
      <div className="shell-wide relative flex flex-col pt-[calc(var(--header-h)+1.5rem)] lg:min-h-svh">
        <Breadcrumbs items={breadcrumbs} />

        <div className="grid flex-1 items-center gap-y-14 pt-8 pb-14 lg:grid-cols-12 lg:gap-x-8 lg:pt-6 lg:pb-12">
          {/* Placed explicitly: the text spans the render's columns 8–9, and auto-placement would push it into new columns. */}
          <div className="relative z-(--z-raised) lg:col-span-9 lg:col-start-1 lg:row-start-1">
            <div className={fadeUp}>
              <Eyebrow>{eyebrow}</Eyebrow>
            </div>
            <h1 className="mt-8 font-display text-display-2xl font-bold lg:mt-10">
              {title.map((line, index) => (
                <Fragment key={line}>
                  {/* Mask with room for descenders; each line rises into it. */}
                  <span className={cn("-mb-[0.12em] block overflow-hidden pb-[0.12em]", index % 2 === 1 && "ps-[0.9em]")}>
                    <span className={lineUp} style={delay(120 + index * 110)}>
                      {line}
                    </span>
                  </span>{" "}
                </Fragment>
              ))}
            </h1>
            <div className="mt-10 flex max-w-xl flex-col gap-6 lg:mt-12 lg:max-w-[min(36rem,60%)]">
              <p className={cn("text-body-lg text-ink-muted", riseUp)} style={delay(300)}>
                {lede}
              </p>
              {notice && (
                <p className={cn("border-l border-highlight ps-4 text-body-sm text-ink-muted", fadeUp)} style={delay(380)}>
                  {notice}
                </p>
              )}
            </div>
          </div>

          {/* From 1024 px the render is 4:5 and as tall as the space left under the header, so it never crops. */}
          <figure className="flex flex-col lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:items-end">
            <div className="scroll-exit w-full lg:w-[min(100%,calc((100svh_-_var(--header-h)_-_14rem)*0.8))]">
              <div className="relative aspect-square w-full overflow-hidden sm:aspect-[4/5]">
                <div className="absolute inset-0 transition-[scale] duration-1600 ease-out-expo starting:scale-112 motion-reduce:transition-none">
                  <MediaImage asset={media} fill preload sizes="(min-width: 1024px) 36vw, 100vw" className="object-cover" />
                </div>
                {corners.map((corner) => (
                  <span
                    key={corner}
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute size-5 border-highlight transition-opacity duration-600 starting:opacity-0 motion-reduce:transition-none",
                      corner,
                    )}
                    style={delay(400)}
                  />
                ))}
              </div>
            </div>
            {caption && (
              <figcaption className="type-label mt-4 flex w-full items-center gap-3 text-ink-subtle lg:w-[min(100%,calc((100svh_-_var(--header-h)_-_14rem)*0.8))]">
                <span aria-hidden className="h-px w-6 shrink-0 bg-highlight" />
                {caption}
              </figcaption>
            )}
          </figure>
        </div>

        {(facts.length > 0 || scrollTo) && (
          <div className="relative flex flex-col gap-4 border-t border-line py-5 sm:flex-row sm:items-center sm:justify-between">
            {/* Ruled base line with a short cyan tick (planning/DESIGN.md §1). */}
            <span
              aria-hidden
              className="absolute -top-px left-0 h-px w-16 origin-left bg-highlight motion-safe:animate-draw motion-safe:[animation-delay:300ms]"
            />
            {facts.length > 0 && (
              <dl className="flex flex-wrap gap-x-10 gap-y-3">
                {facts.map((fact) => (
                  <div key={fact.label} className="flex items-baseline gap-3">
                    <dt className="type-label text-ink-subtle">{fact.label}</dt>
                    <dd className="type-label text-ink tabular-nums">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {scrollTo && (
              <a
                href={scrollTo.href}
                className="type-label flex min-h-11 items-center gap-4 self-start text-ink-muted transition-colors duration-150 hover:text-ink sm:self-auto"
              >
                {scrollTo.label}
                <span className="sr-only"> {scrollTo.description}</span>
                <span aria-hidden className="relative h-10 w-px overflow-hidden bg-line">
                  <span className="absolute inset-0 bg-highlight motion-safe:animate-cue" />
                </span>
              </a>
            )}
          </div>
        )}
      </div>
    </Section>
  );
}
