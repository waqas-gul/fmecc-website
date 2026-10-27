import type { Route } from "next";
import Link from "next/link";

import { cn } from "@/shared/lib/utils";

/** Base surface for cards: raised surface, 1 px line, radius md; lifts 2 px when interactive. */
export function Card({
  as: Tag = "div",
  href,
  interactive = false,
  className,
  children,
}: {
  as?: "article" | "div" | "li";
  href?: Route;
  interactive?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const lifts = interactive || Boolean(href);
  const classes = cn(
    "relative rounded-md border border-line bg-surface-raised",
    lifts &&
      "transition-[border-color,translate] duration-250 ease-out-expo hover:border-line-strong motion-safe:hover:-translate-y-0.5",
    className,
  );

  if (href) {
    return (
      <Tag className={classes}>
        <Link href={href} className="block h-full rounded-md p-6 lg:p-8">
          {children}
        </Link>
      </Tag>
    );
  }

  return <Tag className={cn(classes, "p-6 lg:p-8")}>{children}</Tag>;
}
