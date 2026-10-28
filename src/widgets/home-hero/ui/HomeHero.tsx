import { Fragment } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { routes } from "@/shared/config";
import { cn } from "@/shared/lib/utils";
import { ColumnGuides, Eyebrow, LinkButton, VideoBackground } from "@/shared/ui";
import { services } from "@/entities/service";

import { heroContent, heroVideo } from "../data/content";
import { HeroMotion } from "./HeroMotion";

/*
 * Entrance (planning/DESIGN.md §8, row 1) as CSS transitions from `@starting-style`: they run on first
 * paint, before hydration, so the headline (the LCP element until a poster exists) is never held back
 * by JavaScript. Browsers without `@starting-style`, and reduced motion, show the end state at once.
 */
const fadeUp =
  "transition-[opacity,translate] duration-600 ease-out-expo starting:translate-y-4 starting:opacity-0 motion-reduce:transition-none";
// The lede is the LCP element at phone widths: it rises without fading, so it paints on the first
// frame instead of waiting for an opacity transition (Chrome does not count opacity-0 paints for LCP).
const riseUp = "transition-[translate] duration-600 ease-out-expo starting:translate-y-4 motion-reduce:transition-none";
const delay = (ms: number) => ({ transitionDelay: `${ms}ms` });

// Quick-link cells: two columns below 1024 px, four in a row above, separated by 1 px rules.
const cellClasses = [
  "",
  "border-l ps-4 lg:ps-6",
  "max-lg:border-t lg:border-l lg:ps-6",
  "border-l ps-4 max-lg:border-t lg:ps-6",
] as const;

const pad = (value: number) => String(value).padStart(2, "0");

/** Full-viewport Home hero: media, headline, two CTAs and a strip of service quick links. */
export function HomeHero() {
  return (
    <HeroMotion labelledBy="home-hero-title" className="relative flex min-h-svh flex-col overflow-hidden bg-surface text-ink">
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <div data-animate="hero-media" className="absolute inset-0">
          <div className="absolute inset-0 transition-transform duration-1600 ease-out-expo starting:scale-108 motion-reduce:transition-none">
            <VideoBackground video={heroVideo} overlay="dark" preload />
          </div>
        </div>
        <ColumnGuides />

        <div className="shell-content relative flex flex-1 flex-col justify-end pt-[calc(var(--header-h)+3rem)] pb-16 lg:pb-20">
          {/* The 2 px spectrum rule is Home's one purple accent (planning/DESIGN.md §2.2). */}
          <span
            aria-hidden
            className="spectrum-fill block h-0.5 w-24 origin-left transition-transform duration-1200 ease-out-expo starting:scale-x-0 motion-reduce:transition-none"
          />
          <div className={cn("mt-8", fadeUp)}>
            <Eyebrow>{heroContent.eyebrow}</Eyebrow>
          </div>

          {/* Slightly tighter tracking below 640 px keeps each authored line on one line at 360 px. */}
          <h1 id="home-hero-title" className="mt-6 font-display text-display-xl font-bold max-sm:tracking-[-0.04em]">
            {heroContent.headline.map((line, index) => (
              <Fragment key={line}>
                {/* Mask with room for descenders; each line rises into it. */}
                <span className="-mb-[0.2em] block overflow-hidden pb-[0.2em]">
                  <span
                    className="block transition-transform duration-900 ease-out-expo starting:translate-y-[120%] motion-reduce:transition-none"
                    style={delay(80 + index * 80)}
                  >
                    {line}
                  </span>
                </span>{" "}
              </Fragment>
            ))}
          </h1>

          <p className={cn("mt-6 max-w-[56ch] text-body-lg text-ink-muted", riseUp)} style={delay(320)}>
            {heroContent.lede}
          </p>

          <div className={cn("mt-10 flex flex-col gap-3 sm:flex-row", fadeUp)} style={delay(400)}>
            <LinkButton href={routes.quote()} size="lg" icon={<ArrowRight />} className="max-sm:w-full">
              {heroContent.primaryCta}
            </LinkButton>
            <LinkButton href={routes.services} size="lg" variant="outline" className="max-sm:w-full">
              {heroContent.secondaryCta}
            </LinkButton>
          </div>
        </div>
      </div>

      <nav
        aria-label={heroContent.quickLinksLabel}
        className={cn("relative border-t border-line bg-surface", fadeUp)}
        style={delay(400)}
      >
        <div className="shell-content flex">
          <ul className="grid flex-1 grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <li key={service.slug} className={cn("border-line", cellClasses[index % cellClasses.length])}>
                <Link
                  href={routes.service(service.slug)}
                  className="group flex h-full min-h-16 items-center gap-3 py-4 pe-3 text-body-sm font-semibold text-ink lg:gap-4 lg:py-6 lg:pe-6"
                >
                  <span aria-hidden className="type-label text-highlight tabular-nums">{pad(service.index)}</span>
                  <span className="flex-1">{service.shortName}</span>
                  <ArrowRight
                    aria-hidden
                    className="size-4 shrink-0 text-ink-subtle transition-[color,translate] duration-150 group-hover:text-ink motion-safe:group-hover:translate-x-1 max-sm:hidden"
                  />
                </Link>
              </li>
            ))}
          </ul>

          <a
            href="#intro"
            className="type-label ms-6 flex min-h-11 items-center gap-4 border-l border-line ps-6 text-ink-muted transition-colors duration-150 hover:text-ink max-lg:hidden"
          >
            {heroContent.scrollCue}
            <span className="sr-only"> to the introduction</span>
            <span aria-hidden className="relative h-10 w-px overflow-hidden bg-line">
              <span data-animate="hero-cue" className="absolute inset-0 bg-highlight" />
            </span>
          </a>
        </div>
      </nav>
    </HeroMotion>
  );
}
