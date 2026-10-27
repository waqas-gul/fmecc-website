import { cn } from "@/shared/lib/utils";

/** Numbered eyebrow led by a cyan tick: "01 — Building Construction" (planning/DESIGN.md §1, §3). */
export function Eyebrow({ index, className, children }: { index?: number; className?: string; children: React.ReactNode }) {
  return (
    <p className={cn("type-label flex items-center gap-3 text-ink-muted", className)}>
      <span aria-hidden className="h-px w-6 shrink-0 bg-highlight" />
      {index !== undefined && (
        <>
          <span className="text-highlight tabular-nums">{String(index).padStart(2, "0")}</span>
          {children && (
            <span aria-hidden className="text-ink-subtle">
              —
            </span>
          )}
        </>
      )}
      {children && <span>{children}</span>}
    </p>
  );
}
