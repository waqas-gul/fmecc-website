import type { Service } from "@/entities/service";
import { cn } from "@/shared/lib/utils";
import { MediaImage, Section, SectionHeader } from "@/shared/ui";

/**
 * Service page section 5 until WS-5 delivers `ServiceShowcase` (planning/ARCHITECTURE.md §13.4):
 * the service's gallery in uniform 3:2 frames, 1 / 2 / 3 columns. With an odd count, the first
 * image spans both columns at tablet width so the grid has no gap. Renders nothing without images.
 */
export function ServiceGallery({ service }: { service: Service }) {
  if (service.gallery.length === 0) return null;
  const oddCount = service.gallery.length % 2 === 1;

  return (
    <Section id="gallery" scheme="light">
      <SectionHeader eyebrow="Gallery" title="On site" />

      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-6">
        {service.gallery.map((image, index) => (
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
