import { cn } from "@/shared/lib/utils";

import type { ContainerSize } from "./Container";

const shells: Record<ContainerSize, string> = {
  content: "shell-content",
  wide: "shell-wide",
  full: "shell-full",
};

/**
 * Decorative 12-column guides for dark sections, hidden below 1024 px (planning/DESIGN.md §4):
 * one line on each column's start edge, where content aligns, and one closing the last column.
 * `size` matches the container the content sits in, so the lines meet its column edges.
 */
export function ColumnGuides({ size = "content", className }: { size?: ContainerSize; className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 hidden lg:block", className)}>
      <div className={cn(shells[size], "grid h-full grid-cols-12 gap-8")}>
        {Array.from({ length: 12 }, (_, column) => (
          <span key={column} className={cn("border-l border-line opacity-50", column === 11 && "border-r")} />
        ))}
      </div>
    </div>
  );
}
