import { Info } from "lucide-react";

import type { ImageAsset } from "@/shared/types/media";
import { Reveal, Section, SectionHeader } from "@/shared/ui";

import { comparisonContent, conceptDrawing } from "../data/content";
import { ComparisonSlider } from "./ComparisonSlider";

/**
 * "From concept to construction" (Home): one illustrative building shown as a concept drawing and
 * as a rendered construction stage, compared with a draggable divider. `render` is the building
 * scene's poster (widgets/service-showcase), passed in by the page; the drawing is traced from it,
 * so the two views line up exactly. Labelled as an illustration wherever it appears: no real site,
 * no before/after photography, no FMECC project. Complete without WebGL.
 */
export function ConceptComparison({ render }: { render: ImageAsset }) {
  const content = comparisonContent;

  return (
    <Section id="concept-to-construction" scheme="dark" guides>
      <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
        <div className="lg:col-span-5">
          <SectionHeader eyebrow={content.eyebrow} title={content.title} lede={content.lede} />
          <Reveal stagger={0.08} className="mt-10 border-t border-line lg:mt-12">
            {content.points.map((point) => (
              <div key={point.title} className="border-b border-line py-5">
                <h3 className="type-label text-highlight">{point.title}</h3>
                <p className="mt-3 max-w-[46ch] text-body-sm text-ink-muted">{point.text}</p>
              </div>
            ))}
          </Reveal>
          <p className="mt-8 flex max-w-[52ch] gap-3 text-body-sm text-ink-subtle">
            <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-highlight" />
            {content.notice}
          </p>
        </div>

        <figure className="lg:col-span-6 lg:col-start-7">
          {/* 4:5 like the scene posters; on short desktop screens the width follows the available height. */}
          <Reveal variant="media-scale" className="mx-auto w-full max-w-[34rem] lg:w-[min(100%,calc((100svh_-_var(--header-h)_-_7rem)*0.8))] lg:max-w-none">
            <ComparisonSlider
              before={conceptDrawing}
              after={render}
              beforeLabel={content.beforeLabel}
              afterLabel={content.afterLabel}
              label={content.sliderLabel}
            />
          </Reveal>
          <figcaption className="mx-auto mt-4 max-w-[34rem] text-center text-body-sm text-ink-subtle lg:max-w-none">
            {content.hint}
          </figcaption>
        </figure>
      </div>
    </Section>
  );
}
