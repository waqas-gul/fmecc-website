import type { Route } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { LinkButton, Reveal, Section, SectionHeader } from "@/shared/ui";

/**
 * Related entries as a typographic index (planning/DESIGN.md §9.3): one ruled row per entry with
 * its number, title and discipline. Each row is one link; hover or focus shifts the title and fills
 * the arrow disc. Rows rise in turn as the list scrolls in.
 */
export function ProjectIndex({
  eyebrow,
  title,
  items,
  all,
}: {
  eyebrow: string;
  title: string;
  items: readonly { key: string; number: string; title: string; meta?: string; href: Route }[];
  all?: { label: string; href: Route };
}) {
  if (items.length === 0) return null;

  return (
    <Section scheme="light" container="wide">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader eyebrow={eyebrow} title={title} />
        {all && (
          <LinkButton href={all.href} variant="link" icon={<ArrowRight />} className="min-h-11 shrink-0 self-start sm:self-auto">
            {all.label}
          </LinkButton>
        )}
      </div>
      <ul className="mt-12 border-t border-line lg:mt-16">
        {items.map((item, index) => (
          <Reveal as="li" key={item.key} delay={index * 0.08} className="border-b border-line">
            <Link
              href={item.href}
              className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 py-6 sm:grid-cols-[4rem_1fr_auto_auto] sm:gap-x-8 lg:py-8"
            >
              <span className="type-label text-highlight tabular-nums">{item.number}</span>
              <span className="font-display text-heading-md font-bold text-ink transition-[color,translate] duration-300 ease-out-expo group-hover:text-accent-text group-focus-visible:text-accent-text motion-safe:group-hover:translate-x-2">
                {item.title}
              </span>
              {item.meta && <span className="type-label text-ink-subtle max-sm:hidden">{item.meta}</span>}
              <span
                aria-hidden
                className="grid size-11 place-items-center rounded-full border border-line-strong text-ink transition-[background-color,border-color,color] duration-300 ease-standard group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink group-focus-visible:border-accent group-focus-visible:bg-accent group-focus-visible:text-accent-ink"
              >
                <ArrowUpRight className="size-4 transition-[rotate] duration-500 ease-out-expo motion-safe:group-hover:rotate-45" />
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
