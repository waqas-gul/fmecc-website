import Link from "next/link";

import { routes, serviceNav } from "@/shared/config";
import { cn } from "@/shared/lib/utils";
import { Badge, MediaImage } from "@/shared/ui";

import type { Project } from "../model/types";

const serviceLabel = (slug: string) => serviceNav.find((service) => service.slug === slug)?.label ?? slug;

// Minimal version created by WS-0 (planning/ARCHITECTURE.md §12); WS-3 owns and refines it.
/** Whole card is one link; the project title is its accessible name (planning/DESIGN.md §7.2). */
export function ProjectCard({
  project,
  variant = "default",
  className,
}: {
  project: Project;
  variant?: "default" | "featured";
  className?: string;
}) {
  const meta = [project.location, project.year].filter(Boolean).join(" · ");

  return (
    <article className={cn("group relative flex flex-col gap-5", variant === "featured" && "lg:col-span-2", className)}>
      <div className="relative overflow-hidden rounded-md">
        <MediaImage
          asset={project.hero}
          sizes={variant === "featured" ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          className="aspect-[3/2] w-full object-cover transition-transform duration-600 ease-out-expo motion-safe:group-hover:scale-[1.04]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-navy-950/60 to-transparent opacity-0 transition-opacity duration-250 group-hover:opacity-100"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {project.placeholder && <Badge tone="accent">Sample</Badge>}
        {project.services.map((slug) => (
          <Badge key={slug}>{serviceLabel(slug)}</Badge>
        ))}
      </div>
      <h3 className="font-display text-heading-sm font-semibold text-ink">
        <Link href={routes.project(project.slug)} className="after:absolute after:inset-0">
          {project.title}
        </Link>
      </h3>
      {meta && <p className="-mt-2 text-body-sm text-ink-muted">{meta}</p>}
    </article>
  );
}
