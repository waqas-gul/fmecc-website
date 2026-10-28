import type { Service } from "@/entities/service";
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

  if (!content) {
    if (service.gallery.length === 0) return null;
    return (
      <Section scheme="light" spacing="sm">
        <ul className="grid gap-4 sm:grid-cols-2 lg:gap-6">
          {service.gallery.map((image) => (
            <li key={image.src + image.alt}>
              <MediaImage
                asset={image}
                sizes="(min-width: 640px) 50vw, 100vw"
                className="h-auto w-full rounded-md object-cover"
              />
            </li>
          ))}
        </ul>
      </Section>
    );
  }

  const header = <SectionHeader eyebrow={content.eyebrow} title={content.title} lede={content.lede} />;

  if (content.kind === "diagram") {
    return (
      <Section scheme="dark">
        {header}
        <CoverageDiagram caption={content.caption} />
      </Section>
    );
  }

  const scene = showcaseScenes[content.scene];
  return (
    <Section scheme="dark">
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
