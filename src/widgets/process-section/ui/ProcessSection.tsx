import { ArrowRight } from "lucide-react";

import { routes } from "@/shared/config";
import type { SceneLoader } from "@/shared/three";
import type { ImageAsset } from "@/shared/types/media";
import type { Scheme } from "@/shared/types/scheme";
import { LinkButton, Section, SectionHeader } from "@/shared/ui";
import type { CompanyContent } from "@/entities/company";

import { processContent } from "../data/content";
import { ProcessScroller } from "./ProcessScroller";

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * "How we deliver" (planning/DESIGN.md §8, row 4): numbered steps on a rail beside a sticky visual.
 * The visual is the tower scene when `scene` is given (lazy, poster first), otherwise the poster;
 * without a poster the steps take the full width. Shared by Home and About.
 */
export function ProcessSection({
  steps,
  scene,
  poster,
  scheme = "dark",
}: {
  steps: CompanyContent["process"];
  scene?: SceneLoader;
  poster?: ImageAsset;
  scheme?: Scheme;
}) {
  if (steps.length === 0) return null;

  return (
    <Section id="process" scheme={scheme} guides>
      <SectionHeader eyebrow={processContent.eyebrow} title={processContent.title} lede={processContent.lede} />

      <ProcessScroller
        stepTitles={steps.map((step) => step.title)}
        scene={scene}
        poster={poster}
        sceneLabel={processContent.sceneLabel}
        stepLabel={processContent.stepLabel}
        // With a scene, the pinned frame's header band is the top spacing below 1024 px.
        className={scene ? "lg:mt-20" : "mt-14 lg:mt-20"}
      >
        {/* Each step carries `data-state` (done, current, upcoming) while the scroller tracks it;
            without it, as in the prerendered HTML or with reduced motion, every step reads as complete. */}
        <ol data-animate="process-list" className="relative">
          {steps.map((step, index) => (
            <li
              key={step.title}
              data-animate="process-step"
              className="group/step relative grid grid-cols-[2.25rem_1fr] gap-x-5 pb-10 last:pb-0 lg:gap-x-7 lg:pb-12"
            >
              {/* Rail segment from this node to the next; its inner span is the scrubbed fill. */}
              {index < steps.length - 1 && (
                <span
                  aria-hidden
                  data-animate="process-segment"
                  className="absolute top-[1.125rem] bottom-0 left-[1.125rem] w-px -translate-x-1/2 bg-line"
                >
                  <span className="absolute inset-0 origin-top bg-highlight" />
                </span>
              )}
              {/* Numbered node: the cyan ring lights as the step is reached; the halo marks the current step. */}
              <span
                aria-hidden
                data-animate="process-node"
                className="relative grid size-9 place-items-center rounded-full border border-line-strong bg-surface"
              >
                <span className="absolute inset-[-1px] rounded-full border border-highlight" />
                <span className="absolute -inset-1.5 rounded-full bg-highlight/15 opacity-0 transition-opacity duration-250 group-data-[state=current]/step:opacity-100" />
                <span className="type-label relative text-highlight tabular-nums transition-colors duration-250 group-data-[state=upcoming]/step:text-ink-subtle">
                  {pad(index + 1)}
                </span>
              </span>
              <div className="pt-1.5">
                <h3 className="font-display text-heading-sm font-semibold transition-colors duration-250 group-data-[state=done]/step:text-ink-muted group-data-[state=upcoming]/step:text-ink-subtle">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-[48ch] text-ink-muted transition-colors duration-250 group-data-[state=upcoming]/step:text-ink-subtle">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-col items-start gap-4 border-t border-line pt-10 sm:flex-row sm:items-center sm:gap-6 lg:mt-14">
          <LinkButton href={routes.quote()} size="lg" icon={<ArrowRight />}>
            {processContent.cta}
          </LinkButton>
          <p className="text-body-sm text-ink-muted">{processContent.ctaNote}</p>
        </div>
      </ProcessScroller>
    </Section>
  );
}
