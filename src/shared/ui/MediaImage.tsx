import Image, { type ImageProps } from "next/image";

import { cn } from "@/shared/lib/utils";
import type { ImageAsset } from "@/shared/types/media";

export type MediaImageProps = Omit<ImageProps, "src" | "alt" | "width" | "height"> & {
  asset: ImageAsset;
  sizes: string;
};

// Faint 40 px drafting grid: a placeholder reads as a deliberate stand-in, not a missing image.
const draftingGrid =
  "bg-size-[2.5rem_2.5rem] bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)]";

/**
 * The only way to render content images. Real assets go through next/image and the custom
 * loader; placeholder assets render as a labelled navy panel and request no file. The label
 * names the intended shot (the asset's alt text) from 640 px up, so the panel doubles as the brief.
 */
export function MediaImage({ asset, sizes, fill, className, style, ...rest }: MediaImageProps) {
  if (asset.placeholder) {
    return (
      <div
        role="img"
        aria-label={asset.alt}
        data-scheme="brand"
        data-placeholder="media"
        className={cn("flex items-end overflow-hidden bg-navy-800 p-4", draftingGrid, fill ? "absolute inset-0" : "w-full", className)}
        style={fill ? style : { aspectRatio: `${asset.width} / ${asset.height}`, ...style }}
      >
        <span aria-hidden className="flex min-w-0 items-center gap-3">
          <span className="h-px w-6 shrink-0 bg-highlight" />
          <span className="type-label shrink-0 text-ink-subtle">Media placeholder</span>
          <span className="truncate text-body-sm text-ink-subtle max-sm:hidden">{asset.alt}</span>
        </span>
      </div>
    );
  }

  const unoptimized = asset.src.startsWith("/images/brand/");

  return fill ? (
    <Image
      src={asset.src}
      alt={asset.alt}
      fill
      sizes={sizes}
      unoptimized={unoptimized}
      className={className}
      style={style}
      {...rest}
    />
  ) : (
    <Image
      src={asset.src}
      alt={asset.alt}
      width={asset.width}
      height={asset.height}
      sizes={sizes}
      unoptimized={unoptimized}
      className={className}
      style={style}
      {...rest}
    />
  );
}
