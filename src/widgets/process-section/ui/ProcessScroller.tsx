"use client";

import { useState, type CSSProperties } from "react";

import { mediaQueries, motionTokens } from "@/shared/lib/animation";
import { gsap, ScrollTrigger, useGsap } from "@/shared/lib/gsap";
import { cn } from "@/shared/lib/utils";
import { LazyScene, type SceneLoader } from "@/shared/three";
import type { ImageAsset } from "@/shared/types/media";
import { MediaImage } from "@/shared/ui";

/** Viewport line the process fill follows: a step lights up when its node crosses it. */
const LINE = "60%";

const pad = (value: number) => String(value).padStart(2, "0");

const corners = [
  "top-3 left-3 border-t border-l",
  "top-3 right-3 border-t border-r",
  "bottom-3 left-3 border-b border-l",
  "bottom-3 right-3 border-b border-r",
] as const;

/** LazyScene's poster `sizes`, so the poster bands reuse the image it downloads. */
const POSTER_SIZES = "(min-width: 1024px) 50vw, 100vw";

// Poster assembly, for whenever no 3D scene is drawing: the tower poster in horizontal bands,
// bottom to top, as fractions of its height. The ground band (fence, shelter, foundations) lands
// first, seven lattice sections follow, the antenna crown comes last; each band has a progress
// window [at, at + span], and neighbouring windows overlap so the build reads as continuous.
const GROUND = 0.79;
const CROWN = 0.27;
const SECTIONS = 7;
const SECTION_RANGE = [0.2, 0.8] as const;
const sectionHeight = (GROUND - CROWN) / SECTIONS;
const sectionSlot = (SECTION_RANGE[1] - SECTION_RANGE[0]) / SECTIONS;
const bands = [
  { top: GROUND, bottom: 1, at: 0.03, span: 0.15 },
  ...Array.from({ length: SECTIONS }, (_, index) => ({
    top: GROUND - sectionHeight * (index + 1),
    bottom: GROUND - sectionHeight * index,
    at: SECTION_RANGE[0] + sectionSlot * index,
    span: sectionSlot * 1.5,
  })),
  { top: 0, bottom: CROWN, at: 0.8, span: 0.15 },
];
// A hair of overlap between bands, so no seam shows where they meet.
const bandClip = ({ top, bottom }: { top: number; bottom: number }) =>
  `inset(${Math.max(0, top * 100 - 0.2)}% 0 ${Math.max(0, (1 - bottom) * 100 - 0.2)}% 0)`;

// Each band turns the frame's `--progress` (unset: 1, the finished tower) into its own eased amount
// `--k` over its window and drops into place from just above: opacity and transform only.
const BAND =
  "absolute inset-0 [--t:clamp(0,calc((var(--progress,1)_-_var(--at))/var(--span)),1)] [--k:calc(var(--t)*var(--t)*(3_-_2*var(--t)))] [opacity:var(--k)] [transform:translateY(calc((1_-_var(--k))*-0.75rem))]";

/**
 * Scroll layer of the process section (planning/DESIGN.md §8, row 4). Children are the
 * server-rendered step list; this island scrubs the rail segments between nodes, lights each node
 * as it crosses the viewport line, marks each step done, current or upcoming (`data-state`, styled
 * by the list) and passes the same progress (0–1) to the tower scene, which assembles as the steps
 * advance and comes apart again when scrolling back, as on the service pages. Whenever the scene is
 * not drawing (still loading, no WebGL, low-tier device) the poster does the same in bands: ground
 * first, then the lattice section by section, then the antenna crown, and back down in reverse.
 * The visual stays in view with CSS `position: sticky`, so the section never pins. Without
 * JavaScript or with reduced motion, everything rests in its end state: every segment filled,
 * every node lit, the tower complete.
 */
export function ProcessScroller({
  stepTitles,
  scene,
  poster,
  sceneLabel,
  stepLabel,
  className,
  children,
}: {
  stepTitles: string[];
  scene?: SceneLoader;
  poster?: ImageAsset;
  sceneLabel: string;
  stepLabel: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [progress, setProgress] = useState(0);
  const [reached, setReached] = useState(stepTitles.length);
  const [scrubbing, setScrubbing] = useState(false);
  const total = stepTitles.length;
  const current = Math.min(Math.max(reached, 1), total);

  const scopeRef = useGsap<HTMLDivElement>(
    (_ctx, scope) => {
      const list = scope.querySelector("[data-animate='process-list']");
      const frame = scope.querySelector("[data-animate='process-frame']");
      const nodes = gsap.utils.toArray<HTMLElement>("[data-animate='process-node']", scope);
      const segments = gsap.utils.toArray<HTMLElement>("[data-animate='process-segment']", scope);
      const steps = gsap.utils.toArray<HTMLElement>("[data-animate='process-step']", scope);
      if (!list || nodes.length === 0) return;

      gsap.matchMedia().add(mediaQueries.motionOk, () => {
        const nodeTriggers: ScrollTrigger[] = [];
        // Counted from the scroll position, not toggle callbacks: a fast jump can pass a node's
        // whole trigger range without toggling it. The last reached step is current; before the
        // first node crosses the line, the first step is.
        const sync = () => {
          const count = nodeTriggers.filter((trigger) => trigger.scroll() >= trigger.start).length;
          const active = Math.max(count, 1) - 1;
          steps.forEach((step, index) => {
            step.dataset.state = index < active ? "done" : index === active ? "current" : "upcoming";
          });
          setReached(count);
        };

        segments.forEach((segment) => {
          gsap.fromTo(
            segment.firstElementChild,
            { scaleY: 0 },
            { scaleY: 1, ease: "none", scrollTrigger: { trigger: segment, start: `top ${LINE}`, end: `bottom ${LINE}`, scrub: 0.6 } },
          );
        });

        nodes.forEach((node) => {
          const tween = gsap.fromTo(
            node.firstElementChild,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: motionTokens.duration.ui,
              ease: motionTokens.ease.outExpo,
              scrollTrigger: {
                trigger: node,
                start: `center ${LINE}`,
                toggleActions: "play none none reverse",
                onToggle: sync,
                onRefresh: sync,
              },
            },
          );
          if (tween.scrollTrigger) nodeTriggers.push(tween.scrollTrigger);
        });

        // Whole-list progress: drives the scene and re-counts reached nodes on every scroll update.
        ScrollTrigger.create({
          trigger: list,
          start: `top ${LINE}`,
          endTrigger: nodes[nodes.length - 1],
          end: `center ${LINE}`,
          onUpdate: (self) => {
            if (scene) setProgress(Math.round(self.progress * 100) / 100);
            sync();
          },
          onRefresh: sync,
        });

        // The poster bands read `--progress` from the frame: same range as the scene, so whichever
        // is showing builds in step with the list. Reverting removes it and the tower stands whole.
        if (frame) {
          gsap.fromTo(
            frame,
            { "--progress": 0 },
            {
              "--progress": 1,
              ease: "none",
              scrollTrigger: { trigger: list, start: `top ${LINE}`, endTrigger: nodes[nodes.length - 1], end: `center ${LINE}`, scrub: 0.6 },
            },
          );
        }

        setScrubbing(true);
        sync();
        return () => {
          steps.forEach((step) => delete step.dataset.state);
          setScrubbing(false);
          setReached(total);
        };
      });
    },
    [scene, total],
  );

  // Below 1024 px the steps and the visual stack. A scene leads in a short frame that, in portrait,
  // pins under a header-high band while the steps scroll beneath it, so the tower is seen assembling.
  // A poster alone follows the steps on phones and leads them on tablets.
  const pinned = Boolean(scene);

  return (
    <div
      ref={scopeRef}
      // Flex when pinned below 1024 px: a sticky grid item cannot leave its own row.
      className={cn("grid gap-12 lg:grid-cols-12 lg:gap-8", pinned && "max-lg:flex max-lg:flex-col", className)}
    >
      <div className={poster ? "lg:col-span-6 xl:col-span-5" : "lg:col-span-8"}>{children}</div>

      {poster && (
        <div
          className={cn(
            "lg:col-span-6 lg:col-start-7",
            pinned
              ? "max-lg:order-first max-lg:bg-surface max-lg:pt-[calc(var(--header-h)_+_0.75rem)] max-lg:pb-4"
              : "md:max-lg:order-first",
            pinned && scrubbing && "max-lg:portrait:sticky max-lg:portrait:top-0 max-lg:portrait:z-(--z-raised)",
          )}
        >
          {/* Always 4:5 from 1024 px, matching the scene posters: on short screens the width follows
              the available height, so neither the poster nor the scene is cropped. Pinned below
              1024 px, the frame is short and full width: the scene keeps the whole tower in view and
              the poster is letterboxed. The poster itself stays in place for its alt text, but the
              bands above it draw the tower. */}
          <div
            data-animate="process-frame"
            className={cn(
              "group relative w-full overflow-hidden rounded-md border border-line",
              "lg:sticky lg:top-[calc(var(--header-h)_+_2rem)] lg:mx-auto lg:aspect-[4/5] lg:h-auto lg:w-[min(100%,calc((100svh_-_var(--header-h)_-_4rem)*0.8))] lg:max-w-none",
              "[&_[data-scene-state]>img]:opacity-0",
              pinned ? "h-[clamp(12rem,32svh,20rem)] max-lg:[&_img]:object-contain" : "mx-auto aspect-[4/5] md:max-w-md",
            )}
          >
            {scene ? (
              <div className="absolute inset-0">
                <LazyScene load={scene} poster={poster} label={sceneLabel} progress={progress} className="h-full w-full" />
              </div>
            ) : (
              <MediaImage asset={poster} fill sizes={POSTER_SIZES} className="object-cover opacity-0" />
            )}

            {/* Poster assembly over a faint ghost of the planned tower, so the first step is not an
                empty frame; fades out as the 3D scene fades in, and returns if the scene fails. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 transition-opacity duration-700 ease-standard group-has-[[data-scene-state=scene]]:opacity-0"
            >
              <MediaImage asset={{ ...poster, alt: "" }} fill sizes={POSTER_SIZES} className="object-cover opacity-15" />
              {bands.map((band) => (
                <div
                  key={band.top}
                  className={BAND}
                  style={{ "--at": band.at, "--span": band.span, clipPath: bandClip(band) } as CSSProperties}
                >
                  <MediaImage asset={{ ...poster, alt: "" }} fill sizes={POSTER_SIZES} className="object-cover" />
                </div>
              ))}
            </div>

            {corners.map((corner) => (
              <span key={corner} aria-hidden className={cn("pointer-events-none absolute size-4 border-highlight", corner)} />
            ))}

            {scrubbing && (
              <div
                aria-hidden
                data-scheme="dark"
                className="absolute inset-x-0 top-0 flex items-start justify-between gap-6 bg-linear-to-b from-navy-950/60 to-transparent p-6 pb-12 transition-opacity duration-250 starting:opacity-0 lg:p-8 lg:pb-16"
              >
                <span className="type-label text-highlight tabular-nums">
                  {stepLabel} {pad(current)} / {pad(total)}
                </span>
                <span className="type-label text-right">{stepTitles[current - 1]}</span>
              </div>
            )}
          </div>

          {/* Soft edge the steps fade under while the frame is pinned. */}
          {pinned && scrubbing && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-full h-6 bg-linear-to-b from-surface to-transparent lg:hidden landscape:hidden"
            />
          )}
        </div>
      )}
    </div>
  );
}
