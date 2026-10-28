import type { ImageAsset } from "@/shared/types/media";
import { MediaImage, Reveal, Section, SectionHeader } from "@/shared/ui";

/**
 * Lightbox-free gallery (planning/DESIGN.md §9.3) on the dark scheme: two balanced columns that
 * keep each image's own ratio, so mixed 3:2 and 4:5 photography sits without cropping. Each image
 * fades up as it enters the viewport. Renders nothing without images.
 */
export function ProjectGallery({ images }: { images: ImageAsset[] }) {
  if (images.length === 0) return null;

  return (
    <Section scheme="dark" container="wide" guides>
      <SectionHeader eyebrow={`${images.length} ${images.length === 1 ? "image" : "images"}`} title="Project gallery" />
      <ul className="mt-12 columns-1 gap-4 sm:columns-2 lg:mt-16 lg:gap-6">
        {images.map((image, index) => (
          <Reveal as="li" key={`${image.src}-${index}`} className="mb-4 break-inside-avoid lg:mb-6">
            <MediaImage
              asset={image}
              sizes="(min-width: 1536px) 708px, (min-width: 640px) 50vw, 100vw"
              className="h-auto w-full rounded-md"
            />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
