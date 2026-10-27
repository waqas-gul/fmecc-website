import Image, { type ImageProps } from "next/image";

import { cn } from "@/shared/lib/utils";
import type { ImageAsset } from "@/shared/types/media";

export type MediaImageProps = Omit<ImageProps, "src" | "alt" | "width" | "height"> & {
  asset: ImageAsset;
  sizes: string;
};

/**
 * The only way to render content images. Real assets go through next/image and the custom
 * loader; placeholder assets render as a labelled navy panel and request no file.
 */
export function MediaImage({ asset, sizes, fill, className, style, ...rest }: MediaImageProps) {
  if (asset.placeholder) {
    return (
      <div
        role="img"
        aria-label={asset.alt}
        data-scheme="brand"
        data-placeholder="media"
        className={cn("flex items-end bg-navy-800 p-4", fill ? "absolute inset-0" : "w-full", className)}
        style={fill ? style : { aspectRatio: `${asset.width} / ${asset.height}`, ...style }}
      >
        <span aria-hidden className="type-label text-ink-subtle">
          Media placeholder
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
