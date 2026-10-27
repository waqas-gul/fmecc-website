import { cn } from "@/shared/lib/utils";

export type ContainerSize = "content" | "wide" | "full";

const sizeClasses: Record<ContainerSize, string> = {
  content: "shell-content",
  wide: "shell-wide",
  full: "shell-full",
};

/** Horizontal layout frame: 1280 px (content) or 1440 px (wide) plus responsive gutters. */
export function Container({
  size = "content",
  as: Tag = "div",
  className,
  children,
}: {
  size?: ContainerSize;
  as?: "div" | "section" | "nav" | "header" | "footer";
  className?: string;
  children: React.ReactNode;
}) {
  return <Tag className={cn(sizeClasses[size], className)}>{children}</Tag>;
}
