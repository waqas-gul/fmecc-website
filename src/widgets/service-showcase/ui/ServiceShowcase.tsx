import type { Service } from "@/entities/service";
import { cn } from "@/shared/lib/utils";
import { MediaImage, Section, SectionHeader } from "@/shared/ui";

import { showcaseScenes } from "../model/scenes";
import { showcases } from "../model/showcases";
import { CoverageDiagram } from "../scenes/CoverageDiagram";
import { SceneShowcase } from "./SceneShowcase";

/**
 * Service page showcase (planning/DESIGN.md §9.1 step 5, §9.2). `service.showcase` selects the
 * 3D scene (tower, building, bollard) or the coverage diagram; a key without a showcase falls back
 * to the service gallery, and with no gallery either nothing renders. Every variant is complete
 * without JavaScript: scenes show their poster, the diagram its finished plan.
 * Server Component: only plain fields reach the client islands.
 */
export function ServiceShowcase({ service }: { service: Service }) {
  const content = showcases[service.showcase];

  if (!content) return <ServiceGallery images={service.gallery} />;

  const header = <SectionHeader eyebrow={content.eyebrow} title={content.title} lede={content.lede} />;

  if (content.kind === "diagram") {
    return (
      <Section id="showcase" scheme="dark" guides>
        {header}
        <CoverageDiagram caption={content.caption} />
      </Section>
    );
  }

  const scene = showcaseScenes[content.scene];
  return (
    <Section id="showcase" scheme="dark" guides>
      {header}
      <SceneShowcase
        load={scene.load}
        poster={scene.poster}
        label={scene.label}
        caption={content.caption}
        stages={content.stages}
      />
    </Section>
  );
}

/**
 * Fallback for a showcase key without a scene or diagram: the service gallery in uniform 3:2
 * frames, 1 / 2 / 3 columns. With an odd count, the first image spans both columns at tablet width
 * so the grid has no gap. Renders nothing without images.
 */
function ServiceGallery({ images }: { images: Service["gallery"] }) {
  if (images.length === 0) return null;
  const oddCount = images.length % 2 === 1;

  return (
    <Section id="showcase" scheme="light">
      <SectionHeader eyebrow="Gallery" title="On site" />

      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-6">
        {images.map((image, index) => (
          <li
            key={`${image.src}-${index}`}
            className={cn(
              "relative aspect-[3/2] overflow-hidden rounded-md",
              oddCount && index === 0 && "sm:col-span-2 lg:col-span-1",
            )}
          >
            <MediaImage
              asset={image}
              fill
              sizes={
                oddCount && index === 0
                  ? "(min-width: 1024px) 33vw, 100vw"
                  : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              }
              className="object-cover"
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}
