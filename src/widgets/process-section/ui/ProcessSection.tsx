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
        className="mt-14 lg:mt-20"
      >
        <ol data-animate="process-list" className="relative">
          {steps.map((step, index) => (
            <li key={step.title} className="relative grid grid-cols-[15px_1fr] gap-x-6 pb-10 last:pb-0 lg:gap-x-8 lg:pb-12">
              {/* Rail segment from this node to the next; its inner span is the scrubbed fill. */}
              {index < steps.length - 1 && (
                <span
                  aria-hidden
                  data-animate="process-segment"
                  className="absolute top-[7px] bottom-0 left-[7px] w-px bg-line"
                >
                  <span className="absolute inset-0 origin-top bg-highlight" />
                </span>
              )}
              <span
                aria-hidden
                data-animate="process-node"
                className="relative -mt-0.5 size-[15px] rounded-full border border-line-strong bg-surface"
              >
                <span className="absolute inset-[3px] rounded-full bg-highlight" />
              </span>
              <div>
                <span className="type-label text-highlight tabular-nums">{pad(index + 1)}</span>
                <h3 className="mt-3 font-display text-heading-sm font-semibold">{step.title}</h3>
                <p className="mt-2 max-w-[48ch] text-ink-muted">{step.description}</p>
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
