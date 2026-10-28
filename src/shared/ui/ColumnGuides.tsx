import { cn } from "@/shared/lib/utils";

/**
 * Decorative 12-column guides for dark sections, hidden below 1024 px (planning/DESIGN.md §4):
 * one line on each column's start edge, where content aligns, and one closing the last column.
 */
export function ColumnGuides({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 hidden lg:block", className)}>
      <div className="shell-content grid h-full grid-cols-12 gap-8">
        {Array.from({ length: 12 }, (_, column) => (
          <span key={column} className={cn("border-l border-line opacity-50", column === 11 && "border-r")} />
        ))}
      </div>
    </div>
  );
}
