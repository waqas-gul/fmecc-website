"use client";

import { useEffect, useRef, useState } from "react";
import { MoveVertical } from "lucide-react";

import { mediaQueries } from "@/shared/lib/animation";
import { cn } from "@/shared/lib/utils";
import { LazyScene, type SceneLoader } from "@/shared/three";
import type { ImageAsset } from "@/shared/types/media";

import { anchoredProgress, onScrollFrame, scrollProgress } from "../lib/scroll";
import type { ShowcaseStage } from "../model/showcases";

const round = (value: number) => Math.round(value * 1000) / 1000;

const pad = (value: number) => String(value).padStart(2, "0");

/** Viewport line, as a share of its height, a stage row crosses to become current when pinned. */
const LINE = 0.6;

/** The stage that is current at `progress`: the last one whose start has been reached. */
const currentStage = (stages: readonly ShowcaseStage[], progress: number) =>
  stages.reduce((current, stage, index) => (progress >= stage.at ? index : current), 0);

/**
 * Scroll-driven 3D showcase (planning/DESIGN.md §9.1, §10.5): the visual sticks beside the stage
 * list on desktop (CSS sticky, no pinning) and assembles as the list scrolls past. Below 1024 px in
 * portrait, a short frame pins under a header-high band above the list, as the Home process section
 * does: each stage starts as its row crosses the viewport line, so the row at the line is the stage
 * on screen, and scrolling back takes the model apart again. Landscape phones keep the frame in
 * flow, assembling as it crosses the viewport. Prerendered HTML and reduced motion show the
 * finished state, with every stage complete.
 */
export function SceneShowcase({
  load,
  poster,
  label,
  caption,
  hint,
  stages,
}: {
  load: SceneLoader;
  poster: ImageAsset;
  label: string;
  caption: string;
  hint: string;
  stages: ShowcaseStage[];
}) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(1);
  const [tracking, setTracking] = useState(false);
  const [pinned, setPinned] = useState(false);

  // Desktop: progress runs while the stage list passes (top at 55 % → bottom at 85 % of the
  // viewport). Pinned: from the stage rows crossing the line. Landscape below 1024 px: while the
  // visual crosses the viewport. Reduced motion: finished state.
  useEffect(() => {
    const scope = scopeRef.current;
    const visual = visualRef.current;
    const list = listRef.current;
    if (!scope || !visual || !list) return;
    const desktop = window.matchMedia(mediaQueries.lg);
    const reduced = window.matchMedia(mediaQueries.reduced);
    const portrait = window.matchMedia("(orientation: portrait)");
    return onScrollFrame(() => {
      const viewport = window.innerHeight;
      const pin = !desktop.matches && !reduced.matches && portrait.matches;
      setPinned(pin);
      setTracking(!reduced.matches && (desktop.matches || pin));
      if (reduced.matches) setProgress(1);
      else if (desktop.matches) setProgress(round(scrollProgress(scope.getBoundingClientRect(), viewport, 0.55, 0.85)));
      else if (pin) {
        const rows = Array.from(list.children, (row, index) => ({ top: row.getBoundingClientRect().top, at: stages[index]?.at ?? 1 }));
        setProgress(round(anchoredProgress([...rows, { top: list.getBoundingClientRect().bottom, at: 1 }], viewport * LINE)));
      } else setProgress(round(scrollProgress(visual.getBoundingClientRect(), viewport, 0.85, 0.4)));
    }, [desktop, reduced, portrait]);
  }, [stages]);

  const current = currentStage(stages, progress);

  return (
    // Flex below 1024 px so the pinned visual can stick across the list (a grid item cannot leave
    // its row); the visual's header band is the top spacing there.
    <div ref={scopeRef} className="flex flex-col gap-10 lg:mt-16 lg:grid lg:grid-cols-12 lg:gap-8">
      <div
        ref={visualRef}
        className={cn(
          "max-lg:bg-surface max-lg:pt-[calc(var(--header-h)+0.75rem)] max-lg:pb-4",
          "lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:self-start",
          pinned && "max-lg:sticky max-lg:top-0 max-lg:z-(--z-raised)",
        )}
      >
        {/* lg:w-fit: the figure takes the frame's height-derived width, so the caption starts at the frame's edge. */}
        <figure className={cn("mx-auto w-full lg:w-fit lg:max-w-full", !pinned && "max-w-[30rem]")}>
          {/* Pinned: short and full width; the scene keeps the whole model in view and the poster is letterboxed. */}
          <div
            className={cn(
              "relative w-full lg:mx-auto lg:aspect-[4/5] lg:h-[min(calc(100svh-var(--header-h)-7rem),48rem)] lg:w-auto lg:max-w-full",
              pinned ? "h-[clamp(11rem,28svh,17rem)] [&_img]:object-contain" : "mx-auto aspect-[4/5]",
            )}
          >
            <LazyScene load={load} poster={poster} label={label} progress={progress} className="h-full w-full" />
            {/* Scroll hint until the model starts moving. Prerendered HTML and reduced motion rest at
                progress 1, so it never shows there; the scene's text alternative covers it for screen
                readers. Pinned, the stage label takes its place. */}
            <span
              aria-hidden
              className={cn(
                "type-label pointer-events-none absolute top-4 left-4 flex items-center gap-2 rounded-full border border-line-strong bg-surface/70 px-3 py-2 text-ink backdrop-blur-sm transition-opacity duration-500 ease-standard sm:top-5 sm:left-5",
                progress < 0.25 && !pinned ? "opacity-100" : "opacity-0",
              )}
            >
              <MoveVertical className="size-3.5 text-highlight" />
              {hint}
            </span>
            {pinned && (
              <div
                aria-hidden
                data-scheme="dark"
                className="absolute inset-x-0 top-0 flex items-start justify-between gap-6 bg-linear-to-b from-navy-950/60 to-transparent p-5 pb-10"
              >
                <span className="type-label text-highlight tabular-nums">
                  Step {pad(current + 1)} / {pad(stages.length)}
                </span>
                <span className="type-label text-right">{stages[current]?.title}</span>
              </div>
            )}
            {/* Registration marks at the frame corners: technical detail, not content. */}
            <span aria-hidden className="pointer-events-none absolute top-0 left-0 size-3 border-t border-l border-highlight" />
            <span aria-hidden className="pointer-events-none absolute top-0 right-0 size-3 border-t border-r border-highlight" />
            <span aria-hidden className="pointer-events-none absolute bottom-0 left-0 size-3 border-b border-l border-highlight" />
            <span aria-hidden className="pointer-events-none absolute right-0 bottom-0 size-3 border-r border-b border-highlight" />
          </div>
          <figcaption className={cn("text-center text-body-sm text-ink-subtle lg:text-start", pinned ? "mt-2" : "mt-4")}>
            {caption}
          </figcaption>
        </figure>

        {/* Soft edge the stages fade under while the frame is pinned. */}
        {pinned && (
          <span aria-hidden className="pointer-events-none absolute inset-x-0 top-full h-6 bg-linear-to-b from-surface to-transparent" />
        )}
      </div>

      <div className="relative lg:col-span-4 lg:col-start-1 lg:row-start-1">
        {/* Progress rail: a cyan fill scaled with scroll progress (transform only). */}
        <div aria-hidden className="absolute top-0 bottom-0 left-0 w-px bg-line max-lg:hidden">
          <div
            className="h-full w-full origin-top bg-highlight"
            style={{ transform: `scaleY(${tracking ? progress : 1})` }}
          />
        </div>
        {/* Pinned: roomier rows, and space after the last so the build completes before the frame lets go. */}
        <ol
          ref={listRef}
          className={cn("flex flex-col lg:gap-0 lg:py-[12svh] lg:pl-8", pinned ? "gap-12 pb-[15svh]" : "gap-8")}
        >
          {stages.map((stage, index) => {
            const state = !tracking ? "static" : index < current ? "done" : index === current ? "current" : "upcoming";
            return (
              <li
                key={stage.title}
                data-state={state}
                aria-current={state === "current" ? "step" : undefined}
                className="flex gap-5 lg:min-h-[34svh] lg:items-center"
              >
                <span
                  className={cn(
                    "type-label pt-1 tabular-nums transition-colors duration-250",
                    state === "upcoming" ? "text-ink-subtle" : "text-highlight",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-2">
                  <h3
                    className={cn(
                      "font-display text-heading-sm font-semibold transition-colors duration-250",
                      state === "upcoming" ? "text-ink-subtle" : state === "done" ? "text-ink-muted" : "text-ink",
                    )}
                  >
                    {stage.title}
                  </h3>
                  <p
                    className={cn(
                      "max-w-[40ch] text-body-sm transition-colors duration-250",
                      state === "upcoming" ? "text-ink-subtle" : "text-ink-muted",
                    )}
                  >
                    {stage.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
