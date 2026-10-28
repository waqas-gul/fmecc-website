import { Plus } from "lucide-react";

import { cn } from "@/shared/lib/utils";

/*
 * Each item is a native <details> disclosure: it works without JavaScript, the browser exposes the
 * expanded state, find-in-page opens a matching answer, and no client code ships. Where
 * `::details-content` and `interpolate-size` are supported the answer's height and opacity
 * animate (250 ms; opacity only and 150 ms with reduced motion); elsewhere it opens at once.
 */
const itemClasses = [
  "group/item border-b border-line [interpolate-size:allow-keywords]",
  "details-content:h-0 details-content:overflow-clip details-content:opacity-0",
  "details-content:transition-[height,opacity,content-visibility] details-content:transition-discrete details-content:duration-250 details-content:ease-standard",
  "open:details-content:h-auto open:details-content:opacity-100",
  "motion-reduce:details-content:transition-[opacity,content-visibility] motion-reduce:details-content:duration-150",
].join(" ");

/**
 * Disclosure list for FAQs (planning/DESIGN.md §7.4). Answers stay in the HTML, so they are
 * indexable and need no extra request. Each question is an `h3` inside its `summary`.
 */
export function Accordion({
  items,
  defaultOpenId,
  className,
}: {
  items: { id: string; title: string; content: React.ReactNode }[];
  defaultOpenId?: string;
  className?: string;
}) {
  return (
    <div className={cn("border-t border-line", className)}>
      {items.map((item, index) => (
        <details key={item.id} open={item.id === defaultOpenId} className={itemClasses}>
          <summary className="group/summary flex cursor-pointer list-none items-start gap-5 py-6 [&::-webkit-details-marker]:hidden">
            {/* Decorative counter: the question alone names the control. w-6 + gap-5 = the answer's pl-11. */}
            <span aria-hidden className="type-label w-6 shrink-0 pt-1.5 text-highlight tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="flex-1 text-heading-sm font-semibold text-ink transition-colors duration-150 group-hover/summary:text-accent-text">
              {item.title}
            </h3>
            <Plus
              aria-hidden
              className="mt-0.5 size-5 shrink-0 text-ink-muted transition-transform duration-250 ease-out-expo group-open/item:rotate-45 motion-reduce:transition-none"
            />
          </summary>
          <div className="max-w-[65ch] pb-7 pl-11 text-body text-ink-muted">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
