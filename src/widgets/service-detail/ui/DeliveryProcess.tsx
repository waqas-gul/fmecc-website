import { cn } from "@/shared/lib/utils";
import { Reveal, Section, SectionHeader } from "@/shared/ui";

// Six steps sit in two rows of three between 1024 and 1279 px, where one row would be too narrow.
const columnClasses: Record<number, string> = {
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-3 xl:grid-cols-6",
};

/**
 * Numbered delivery steps on the dark scheme (planning/DESIGN.md §9.1, step 4): a vertical rule
 * with cyan nodes below 1024 px, a horizontal rule above it. Steps reveal as they scroll in, and a
 * cyan progress rule fills along each step's rule with the scroll (CSS scroll-driven; static where
 * unsupported or with reduced motion).
 * Used by `ServiceProcess` and, with the shared company process, by the services overview page.
 */
export function DeliveryProcess({
  id = "process",
  eyebrow,
  title,
  lede,
  steps,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  lede?: string;
  steps: readonly { title: string; description: string }[];
  /** Rendered below the steps, e.g. the maintenance note. */
  children?: React.ReactNode;
}) {
  if (steps.length === 0) return null;

  return (
    <Section id={id} scheme="dark" guides>
      <SectionHeader eyebrow={eyebrow} title={title} lede={lede} />

      <ol className={cn("mt-14 lg:mt-20 lg:grid lg:gap-y-14", columnClasses[steps.length] ?? "lg:grid-cols-3")}>
        {steps.map((step, index) => (
          <Reveal
            as="li"
            key={step.title}
            delay={index * 0.08}
            className="relative border-l border-line pb-10 pl-8 last:pb-0 lg:border-t lg:border-l-0 lg:pt-8 lg:pr-6 lg:pb-0 lg:pl-0"
          >
            {/* Progress rule over the step's own rule: fills as the step scrolls in (CSS only). */}
            <span
              aria-hidden
              className="absolute top-0 bottom-0 -left-px w-px bg-highlight max-lg:rule-scroll-y lg:-top-px lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto lg:rule-scroll-x"
            />
            <span
              aria-hidden
              className="absolute top-1 -left-[4.5px] size-2 rounded-full bg-highlight lg:-top-[4.5px] lg:left-0"
            />
            <span aria-hidden className="type-label text-highlight tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 font-display text-heading-sm font-semibold">{step.title}</h3>
            <p className="mt-3 max-w-[48ch] text-body-sm text-ink-muted">{step.description}</p>
          </Reveal>
        ))}
      </ol>

      {children}
    </Section>
  );
}
