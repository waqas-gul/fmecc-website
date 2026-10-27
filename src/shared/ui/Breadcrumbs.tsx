import type { Route } from "next";
import Link from "next/link";

import { breadcrumbJsonLd, JsonLd } from "@/shared/lib/seo";
import { cn } from "@/shared/lib/utils";

/** Breadcrumb trail plus its BreadcrumbList structured data. The last item is the current page. */
export function Breadcrumbs({ items, className }: { items: { label: string; href?: Route }[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-body-sm text-ink-muted">
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !current ? (
                <Link href={item.href} className="rounded-sm transition-colors duration-150 hover:text-ink">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={current ? "page" : undefined} className={cn(current && "text-ink")}>
                  {item.label}
                </span>
              )}
              {!current && (
                <span aria-hidden className="text-ink-subtle">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <JsonLd data={breadcrumbJsonLd(items)} />
    </nav>
  );
}
