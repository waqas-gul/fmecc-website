import { MediaImage } from "@/shared/ui";
import type { Project } from "@/entities/project";

/**
 * Narrative column of a project page: the written account when FMECC supplied one, the scope of
 * work as a numbered list and an optional project film. The summary already leads the hero.
 */
export function ProjectNarrative({ project }: { project: Project }) {
  const { body = [], scope, video } = project;

  return (
    <div className="flex flex-col gap-14 lg:gap-16">
      {body.length > 0 && (
        <section aria-labelledby="project-overview-heading">
          <h2 id="project-overview-heading" className="font-display text-heading-md font-semibold">
            Overview
          </h2>
          <div className="mt-6 flex max-w-[65ch] flex-col gap-5 text-body-lg text-ink-muted">
            {body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </section>
      )}

      {scope.length > 0 && (
        <section aria-labelledby="project-scope-heading">
          <h2 id="project-scope-heading" className="font-display text-heading-md font-semibold">
            Scope of work
          </h2>
          <ol className="mt-6 border-t border-line">
            {scope.map((item, index) => (
              <li key={index} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-line py-5">
                <span aria-hidden className="type-label pt-1.5 text-highlight tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-ink">{item}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {video && (
        <section aria-labelledby="project-film-heading">
          <h2 id="project-film-heading" className="font-display text-heading-md font-semibold">
            Project film
          </h2>
          {/* User-started playback with native controls; nothing loads before play (planning/DESIGN.md §12.3). */}
          {video.placeholder ? (
            <MediaImage asset={video.poster} sizes="(min-width: 1024px) 58vw, 100vw" className="mt-6 rounded-md" />
          ) : (
            <video
              controls
              playsInline
              preload="none"
              poster={video.poster.placeholder ? undefined : video.poster.src}
              aria-label={`${project.title}: project film`}
              className="mt-6 aspect-video w-full rounded-md bg-surface-inverse"
            >
              {video.webm && <source src={video.webm} type="video/webm" />}
              <source src={video.mp4} type="video/mp4" />
            </video>
          )}
        </section>
      )}
    </div>
  );
}
