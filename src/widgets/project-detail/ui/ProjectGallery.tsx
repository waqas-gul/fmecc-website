import { cn } from "@/shared/lib/utils";
import type { ImageAsset } from "@/shared/types/media";
import { MediaImage, Reveal, Section, SectionHeader } from "@/shared/ui";

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Lightbox-free gallery (planning/DESIGN.md §9.3) on the dark scheme: the header holds the left
 * columns (sticky from 1024 px) while the images run beside it in two staggered columns, each at its
 * own ratio, so mixed 3:2 and 4:5 photography sits without cropping; a single image takes the full
 * width. Each frame is wiped open as it enters while its image settles from a slight zoom, then
 * drifts gently with the scroll. Renders nothing without images. `title`, `lede` and `label` let
 * concept pages mark their imagery as illustrative: `label` is printed on every image.
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
  const single = images.length === 1;

  return (
    <Section scheme="dark" container="wide" guides>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:col-span-4 lg:self-start">
          <SectionHeader
            eyebrow={`${pad(images.length)} ${single ? "image" : "images"}`}
            title={title}
            lede={lede}
          />
        </div>

        <ul className={cn("grid gap-10 lg:col-span-7 lg:col-start-6", !single && "sm:grid-cols-2 sm:gap-x-6 lg:gap-x-8")}>
          {images.map((image, index) => (
            <li key={`${image.src}-${index}`} className={cn(!single && index % 2 === 1 && "sm:mt-24 lg:mt-40")}>
              <figure>
                <Reveal variant="media-mask" className="parallax-frame relative overflow-hidden rounded-md bg-navy-900">
                  <MediaImage
                    asset={image}
                    sizes={
                      single
                        ? "(min-width: 1536px) 820px, (min-width: 1024px) 56vw, 100vw"
                        : "(min-width: 1536px) 400px, (min-width: 1024px) 28vw, (min-width: 640px) 50vw, 100vw"
                    }
                    className="parallax-media block h-auto w-full"
                  />
                  {label && (
                    <span className="type-label absolute top-4 left-4 rounded-full border border-white/30 bg-navy-950/60 px-3 py-1.5 whitespace-nowrap text-white backdrop-blur-sm">
                      {label}
                    </span>
                  )}
                  <span data-reveal-cover aria-hidden className="pointer-events-none absolute inset-0 origin-top bg-surface opacity-0" />
                </Reveal>
                <figcaption className="type-label mt-4 flex items-center gap-3 text-highlight tabular-nums">
                  <span aria-hidden className="h-px w-6 shrink-0 bg-highlight" />
                  Fig. {pad(index + 1)}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
