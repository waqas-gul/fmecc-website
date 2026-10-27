import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { routes } from "@/shared/config";
import { cn } from "@/shared/lib/utils";
import { MediaImage } from "@/shared/ui";

import type { Service } from "../model/types";

// Minimal version created by WS-0 (planning/ARCHITECTURE.md §12); WS-2 owns and refines it.
/** Whole card is one link; the service name is its accessible name (planning/DESIGN.md §7.2). */
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
        <div className="overflow-hidden rounded-t-md">
          <MediaImage
            asset={service.showcaseMedia.placeholder ? service.hero : service.showcaseMedia}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="aspect-[4/3] w-full object-cover transition-transform duration-600 ease-out-expo motion-safe:group-hover:scale-[1.04]"
          />
        </div>
      ) : (
        <span className="mx-6 mt-6 inline-flex size-10 items-center justify-center rounded-sm border border-line text-highlight lg:mx-8 lg:mt-8">
          <Icon aria-hidden className="size-5" />
        </span>
      )}
      <div className="flex flex-1 flex-col gap-3 p-6 lg:p-8">
        <span className="type-label text-highlight tabular-nums">{String(service.index).padStart(2, "0")}</span>
        <h3 className="font-display text-heading-sm font-semibold text-ink">
          <Link href={routes.service(service.slug)} className="after:absolute after:inset-0 after:rounded-md">
            {service.shortName}
          </Link>
        </h3>
        <p className="line-clamp-2 text-body-sm text-ink-muted">{service.summary}</p>
        <span aria-hidden className="type-label mt-auto inline-flex items-center gap-2 pt-3 text-accent-text">
          Explore
          <ArrowRight className="size-4 transition-transform duration-150 motion-safe:group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
