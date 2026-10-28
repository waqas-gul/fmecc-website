import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { routes, serviceNav } from "@/shared/config";
import { cn } from "@/shared/lib/utils";
import { Badge, MediaImage } from "@/shared/ui";

import type { Project } from "../model/types";

const serviceLabel = (slug: string) => serviceNav.find((service) => service.slug === slug)?.label ?? slug;

const sizes = {
  default: "(min-width: 1280px) 420px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  featured: "(min-width: 1280px) 860px, (min-width: 1024px) 66vw, 100vw",
} as const;

/**
 * Project tile (planning/DESIGN.md §7.2): 3:2 media, service badges, title and the facts that exist.
 * The whole card is one link named by the title; its focus ring outlines the card, not just the text.
 */
export function ProjectCard({
  project,
  variant = "default",
  className,
}: {
  project: Project;
  variant?: "default" | "featured";
  className?: string;
}) {
  const meta = [project.location, project.year, project.status === "ongoing" && "Ongoing"].filter(Boolean).join(" · ");

  return (
    <article className={cn("group relative flex flex-col", variant === "featured" && "lg:col-span-2", className)}>
      <div className="relative overflow-hidden rounded-md bg-surface-muted">
        <MediaImage
          asset={project.hero}
          sizes={sizes[variant]}
          className="aspect-[3/2] w-full object-cover transition-transform duration-600 ease-out-expo motion-safe:group-hover:scale-[1.04]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-navy-950/70 via-navy-950/10 to-transparent opacity-0 transition-opacity duration-250 group-hover:opacity-100"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 pt-5">
        <div className="flex flex-wrap gap-2">
          {project.placeholder && <Badge tone="accent">Sample</Badge>}
          {project.services.map((slug) => (
            <Badge key={slug}>{serviceLabel(slug)}</Badge>
          ))}
        </div>
        <h3
          className={cn(
            "font-display font-semibold text-ink",
            variant === "featured" ? "text-heading-md" : "text-heading-sm",
          )}
        >
          <Link
            href={routes.project(project.slug)}
            className="after:absolute after:inset-0 after:rounded-md focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-focus"
          >
            {project.title}
          </Link>
        </h3>
        {meta && <p className="text-body-sm text-ink-muted">{meta}</p>}
        <span aria-hidden className="type-label mt-auto inline-flex items-center gap-2 pt-2 text-accent-text">
          View project
          <ArrowRight className="size-4 transition-transform duration-150 motion-safe:group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
