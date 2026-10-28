import type { LucideIcon } from "lucide-react";

/** 40 px icon tile with a cyan glyph (planning/DESIGN.md §7.2, FeatureItem). Decorative. */
export function IconTile({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span aria-hidden className="inline-flex size-10 shrink-0 items-center justify-center rounded-sm border border-line text-highlight">
      <Icon className="size-[18px]" />
    </span>
  );
}
