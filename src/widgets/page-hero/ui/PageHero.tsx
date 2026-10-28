import type { Route } from "next";

import { cn } from "@/shared/lib/utils";
import type { ImageAsset, VideoAsset } from "@/shared/types/media";
import type { Scheme } from "@/shared/types/scheme";
import { Breadcrumbs, Eyebrow, MediaImage, Section, VideoBackground } from "@/shared/ui";

const isVideo = (media: ImageAsset | VideoAsset): media is VideoAsset => "mp4" in media;

/**
 * Hero for inner pages (planning/DESIGN.md §9.1): breadcrumbs, numbered eyebrow, display title,
 * lede and actions, with optional 16:9 media. Sits under the overlay header and owns the page's h1.
 */
export function PageHero({
  eyebrow,
  index,
  title,
  lede,
  media,
  scheme = "brand",
  breadcrumbs,
  actions,
}: {
  eyebrow?: string;
  index?: number;
  title: string;
  lede?: string;
  media?: ImageAsset | VideoAsset;
  scheme?: Scheme;
  breadcrumbs?: { label: string; href?: Route }[];
  actions?: React.ReactNode;
}) {
  return (
    <Section scheme={scheme} spacing="none" container={false} guides className="overflow-hidden">
      <div className="shell-content relative flex flex-col justify-end pt-[calc(var(--header-h)+2.5rem)] pb-14 lg:min-h-[60svh] lg:pt-[calc(var(--header-h)+4rem)] lg:pb-20">
        {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} className="mb-10 lg:mb-auto" />}

        <div className={cn("grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8", breadcrumbs && "lg:pt-16")}>
          <div className={media ? "lg:col-span-6" : "lg:col-span-10"}>
            {(eyebrow || index !== undefined) && (
              <Eyebrow index={index} className="motion-safe:animate-rise">
                {eyebrow}
              </Eyebrow>
            )}
            <h1 className="mt-6 max-w-[20ch] font-display text-display-lg font-bold motion-safe:animate-rise motion-safe:[animation-delay:80ms]">
              {title}
            </h1>
            {lede && (
              <p className="mt-6 max-w-[60ch] text-body-lg text-ink-muted motion-safe:animate-rise motion-safe:[animation-delay:160ms]">
                {lede}
              </p>
            )}
            {actions && (
              <div className="mt-10 flex flex-wrap gap-3 motion-safe:animate-rise motion-safe:[animation-delay:240ms]">
                {actions}
              </div>
            )}
          </div>

          {media && (
            <div className="lg:col-span-6">
              <div className="relative aspect-video overflow-hidden rounded-md">
                {isVideo(media) ? (
                  <VideoBackground video={media} preload />
                ) : (
                  <MediaImage asset={media} fill preload sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ruled base line with a short cyan tick (planning/DESIGN.md §1). */}
      <div aria-hidden className="shell-content relative">
        <div className="relative h-px bg-line">
          <span className="absolute top-0 left-0 h-px w-16 origin-left bg-highlight motion-safe:animate-draw motion-safe:[animation-delay:300ms]" />
        </div>
      </div>
    </Section>
  );
}
