import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { routes } from "@/shared/config";
import { cn } from "@/shared/lib/utils";
import { IconTile, MediaImage } from "@/shared/ui";

import type { Service } from "../model/types";

/**
 * Whole card is one link; the service name is its accessible name (planning/DESIGN.md §7.2).
 * Shows the one-line `tagline`: `summary` is a full positioning sentence for the service page.
 */
export function ServiceCard({
  service,
  variant = "default",
  className,
}: {
  service: Service;
  variant?: "default" | "compact";
  className?: string;
}) {
  const Icon = service.icon;

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-md border border-line bg-surface-raised transition-[border-color] duration-250 hover:border-line-strong",
        className,
      )}
    >
      {variant === "default" ? (
        // The frame sets the 4:3 crop so real images and placeholder panels match.
        <div className="parallax-frame relative aspect-[4/3] overflow-hidden rounded-t-md">
          <MediaImage
            asset={service.hero}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="parallax-media object-cover transition-[scale] duration-600 ease-out-expo motion-safe:group-hover:scale-[1.04]"
          />
        </div>
      ) : (
        <IconTile icon={Icon} className="mx-6 mt-6 lg:mx-8 lg:mt-8" />
      )}
      <div className="flex flex-1 flex-col gap-3 p-6 lg:p-8">
        <span className="type-label text-highlight tabular-nums">{String(service.index).padStart(2, "0")}</span>
        <h3 className="font-display text-heading-sm font-semibold text-ink">
          <Link href={routes.service(service.slug)} className="after:absolute after:inset-0 after:rounded-md">
            {service.shortName}
          </Link>
        </h3>
        <p className="line-clamp-3 text-body-sm text-ink-muted">{service.tagline}</p>
        <span aria-hidden className="type-label mt-auto inline-flex items-center gap-2 pt-3 text-accent-text">
          Explore
          <ArrowRight className="size-4 transition-transform duration-150 motion-safe:group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
