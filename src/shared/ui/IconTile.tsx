import type { LucideIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";

/**
 * 40 px tile with a 20 px cyan glyph: the icon slot of feature items, the services menu and contact
 * rows (planning/DESIGN.md §7.2, FeatureItem). Decorative; the adjacent text names the item.
 */
export function IconTile({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-flex size-10 shrink-0 items-center justify-center rounded-sm border border-line text-highlight", className)}
    >
      <Icon className="size-5" />
    </span>
  );
}
