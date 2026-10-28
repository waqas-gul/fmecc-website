import type { Route } from "next";
import Link from "next/link";
import { Info } from "lucide-react";

import { Reveal, Section } from "@/shared/ui";

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Overview and scope of a case study (planning/DESIGN.md §9.3) on the light scheme. A facts column,
 * sticky from 1024 px, sits beside the written overview, whose first paragraph leads in display
 * type; an optional notice follows the text. Below, the scope reads as a numbered specification:
 * one work package per cell, each under a rule whose cyan tick draws as it scrolls in.
 */
export function CaseStudyBrief({
  overviewTitle = "Overview",
  paragraphs,
  facts,
  notice,
  scopeTitle = "Scope of work",
  scope,
}: {
  overviewTitle?: string;
  paragraphs: string[];
  facts: readonly { label: string; value: string; href?: Route }[];
  notice?: string;
  scopeTitle?: string;
  scope: string[];
}) {
  return (
    <Section id="overview" scheme="light" container="wide">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:col-span-4 lg:self-start">
          <h2 className="type-label flex items-center gap-3 text-ink-muted">
            <span aria-hidden className="h-px w-6 shrink-0 bg-highlight" />
            {overviewTitle}
          </h2>
          <dl className="mt-8 border-t border-line">
            {facts.map((fact) => (
              <div key={fact.label} className="grid grid-cols-[minmax(0,10rem)_1fr] gap-4 border-b border-line py-4">
                <dt className="type-label pt-1 text-ink-subtle">{fact.label}</dt>
                <dd className="text-body text-ink">
                  {fact.href ? (
                    <Link
                      href={fact.href}
                      className="font-medium text-accent-text underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-accent-hover"
                    >
                      {fact.value}
                    </Link>
                  ) : (
                    fact.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <Reveal stagger={0.08} className="flex flex-col gap-8">
            {paragraphs.map((paragraph, index) => (
              <p
                key={paragraph}
                className={
                  index === 0
                    ? "max-w-[34ch] font-display text-heading-md font-semibold text-ink"
                    : "max-w-[62ch] text-body-lg text-ink-muted"
                }
              >
                {paragraph}
              </p>
            ))}
          </Reveal>
          {notice && (
            <p className="mt-12 flex max-w-[62ch] gap-3 rounded-md border border-line-strong bg-surface-muted p-5 text-body-sm text-ink">
              <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-highlight" />
              {notice}
            </p>
          )}
        </div>
      </div>

      {scope.length > 0 && (
        <div className="mt-24 lg:mt-36">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="max-w-[20ch] font-display text-display-lg font-bold">{scopeTitle}</h2>
            <p className="type-label text-ink-subtle tabular-nums">
              {pad(scope.length)} {scope.length === 1 ? "work package" : "work packages"}
            </p>
          </div>
          <ol className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-y-16">
            {scope.map((item, index) => (
              <Reveal as="li" key={item} delay={(index % 3) * 0.08} className="flex flex-col gap-5">
                <span aria-hidden className="relative block h-px bg-line">
                  <span className="rule-scroll-x absolute inset-y-0 left-0 w-12 bg-highlight" />
                </span>
                <span aria-hidden className="type-label text-highlight tabular-nums">
                  {pad(index + 1)}
                </span>
                <p className="max-w-[26ch] font-display text-heading-sm font-semibold text-ink">{item}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      )}
    </Section>
  );
}
