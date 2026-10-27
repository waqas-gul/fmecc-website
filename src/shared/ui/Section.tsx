import { cn } from "@/shared/lib/utils";
import type { Scheme } from "@/shared/types/scheme";

import { ColumnGuides } from "./ColumnGuides";
import { Container, type ContainerSize } from "./Container";

const spacingClasses = {
  none: "",
  sm: "py-[clamp(2.5rem,5vw,4rem)]",
  md: "py-[clamp(4rem,8vw,8rem)]",
} as const;

/**
 * Page section: applies a colour scheme through `data-scheme`, the vertical rhythm,
 * an optional container and optional column guides (planning/DESIGN.md §2.3, §4).
 */
export function Section({
  id,
  scheme,
  spacing = "md",
  container = "content",
  guides = false,
  as: Tag = "section",
  className,
  children,
}: {
  id?: string;
  scheme?: Scheme;
  spacing?: "none" | "sm" | "md";
  container?: ContainerSize | false;
  guides?: boolean;
  as?: "section" | "div";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag
      id={id}
      data-section=""
      data-scheme={scheme}
      className={cn("relative bg-surface text-ink", spacingClasses[spacing], className)}
    >
      {guides && <ColumnGuides />}
      {container ? (
        <Container size={container} className="relative">
          {children}
        </Container>
      ) : (
        children
      )}
    </Tag>
  );
}
