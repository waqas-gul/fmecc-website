import type { ImageAsset } from "@/shared/types/media";
import { MediaImage, Reveal, Section, SectionHeader } from "@/shared/ui";

/**
 * Lightbox-free gallery (planning/DESIGN.md §9.3) on the dark scheme: two balanced columns that
 * keep each image's own ratio, so mixed 3:2 and 4:5 photography sits without cropping. Each frame
 * fades up as it enters the viewport while its image settles from a slight zoom. Renders nothing
 * without images. `title`, `lede` and `label` let concept pages mark their imagery as illustrative:
 * `label` is printed on every image.
 */
export function ProjectGallery({
  images,
  title = "Project gallery",
  lede,
  label,
}: {
  images: ImageAsset[];
  title?: string;
  lede?: string;
  label?: string;
}) {
  if (images.length === 0) return null;

  return (
    <Section scheme="dark" container="wide" guides>
      <SectionHeader eyebrow={`${images.length} ${images.length === 1 ? "image" : "images"}`} title={title} lede={lede} />
      <ul className="mt-12 columns-1 gap-4 sm:columns-2 lg:mt-16 lg:gap-6">
        {images.map((image, index) => (
          <Reveal
            as="li"
            key={`${image.src}-${index}`}
            variant="media-scale"
            delay={(index % 2) * 0.08}
            className="parallax-frame relative mb-4 break-inside-avoid overflow-hidden rounded-md lg:mb-6"
          >
            <MediaImage
              asset={image}
              sizes="(min-width: 1536px) 708px, (min-width: 640px) 50vw, 100vw"
              className="parallax-media h-auto w-full"
            />
            {label && (
              <span className="type-label absolute top-4 left-4 rounded-full border border-white/30 bg-navy-950/60 px-3 py-1.5 text-white backdrop-blur-sm">
                {label}
              </span>
            )}
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
