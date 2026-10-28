"use client";

import { useEffect, useRef, useState } from "react";

import { mediaQueries } from "@/shared/lib/animation";
import { cn } from "@/shared/lib/utils";
import { LazyScene, type SceneLoader } from "@/shared/three";
import type { ImageAsset } from "@/shared/types/media";

import { onScrollFrame, scrollProgress } from "../lib/scroll";
import type { ShowcaseStage } from "../model/showcases";

const round = (value: number) => Math.round(value * 1000) / 1000;

/** The stage that is current at `progress`: the last one whose start has been reached. */
const currentStage = (stages: readonly ShowcaseStage[], progress: number) =>
  stages.reduce((current, stage, index) => (progress >= stage.at ? index : current), 0);

/**
 * Scroll-driven 3D showcase (planning/DESIGN.md §9.1, §10.5): the visual sticks beside the stage
 * list on desktop (CSS sticky, no pinning) and assembles as the list scrolls past; below 1024 px it
 * assembles as it crosses the viewport. Prerendered HTML and reduced motion show the finished
 * state, with every stage complete.
 */
export function SceneShowcase({
  load,
  poster,
  label,
  caption,
  stages,
}: {
  load: SceneLoader;
  poster: ImageAsset;
  label: string;
  caption: string;
  stages: ShowcaseStage[];
}) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(1);
  const [tracking, setTracking] = useState(false);

  // Desktop: progress runs while the stage list passes (top at 55 % → bottom at 85 % of the
  // viewport). Below 1024 px: while the visual crosses the viewport. Reduced motion: finished state.
  useEffect(() => {
    const scope = scopeRef.current;
    const visual = visualRef.current;
    if (!scope || !visual) return;
    const desktop = window.matchMedia(mediaQueries.lg);
    const reduced = window.matchMedia(mediaQueries.reduced);
    return onScrollFrame(() => {
      const viewport = window.innerHeight;
      setTracking(desktop.matches && !reduced.matches);
      if (reduced.matches) setProgress(1);
      else if (desktop.matches) setProgress(round(scrollProgress(scope.getBoundingClientRect(), viewport, 0.55, 0.85)));
      else setProgress(round(scrollProgress(visual.getBoundingClientRect(), viewport, 0.85, 0.4)));
    }, [desktop, reduced]);
  }, []);

  const current = currentStage(stages, progress);

  return (
    <div ref={scopeRef} className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-8">
      <div ref={visualRef} className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:self-start">
        <figure className="mx-auto w-full max-w-[30rem] lg:max-w-none">
          <div className="relative mx-auto aspect-[4/5] w-full lg:h-[min(calc(100svh-var(--header-h)-7rem),48rem)] lg:w-auto lg:max-w-full">
            <LazyScene load={load} poster={poster} label={label} progress={progress} className="h-full w-full" />
            {/* Registration marks at the frame corners: technical detail, not content. */}
            <span aria-hidden className="pointer-events-none absolute top-0 left-0 size-3 border-t border-l border-highlight" />
            <span aria-hidden className="pointer-events-none absolute top-0 right-0 size-3 border-t border-r border-highlight" />
            <span aria-hidden className="pointer-events-none absolute bottom-0 left-0 size-3 border-b border-l border-highlight" />
            <span aria-hidden className="pointer-events-none absolute right-0 bottom-0 size-3 border-r border-b border-highlight" />
          </div>
          <figcaption className="mt-4 text-center text-body-sm text-ink-subtle lg:text-start">{caption}</figcaption>
        </figure>
      </div>

      <div className="relative lg:col-span-4 lg:col-start-1 lg:row-start-1">
        {/* Progress rail: a cyan fill scaled with scroll progress (transform only). */}
        <div aria-hidden className="absolute top-0 bottom-0 left-0 w-px bg-line max-lg:hidden">
          <div
            className="h-full w-full origin-top bg-highlight"
            style={{ transform: `scaleY(${tracking ? progress : 1})` }}
          />
        </div>
        <ol className="flex flex-col gap-8 lg:gap-0 lg:py-[12svh] lg:pl-8">
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
