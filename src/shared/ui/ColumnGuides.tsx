import { cn } from "@/shared/lib/utils";

/** Decorative 12-column guides for dark sections, hidden below 1024 px (planning/DESIGN.md §4). */
export function ColumnGuides({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 hidden lg:block", className)}>
      <div className="shell-content grid h-full grid-cols-12 gap-8">
        {Array.from({ length: 12 }, (_, column) => (
          <span key={column} className="border-x border-line opacity-50" />
        ))}
      </div>
    </div>
  );
}
