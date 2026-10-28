import { cn } from "@/shared/lib/utils";

import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";

/** Eyebrow, title and lede; below the fold they rise in sequence as the section enters (DESIGN.md §10.4). */
export function SectionHeader({
  eyebrow,
  index,
  title,
  lede,
  align = "start",
  titleAs: Title = "h2",
  className,
}: {
  eyebrow?: string;
  index?: number;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "start" | "center";
  titleAs?: "h1" | "h2" | "h3";
  className?: string;
}) {
  const centered = align === "center";

  return (
    <Reveal stagger={0.08} className={cn("flex flex-col gap-5", centered && "items-center text-center", className)}>
      {(eyebrow || index !== undefined) && <Eyebrow index={index}>{eyebrow}</Eyebrow>}
      <Title className="max-w-[20ch] font-display text-display-lg font-bold">{title}</Title>
      {lede && <p className="mt-1 max-w-[65ch] text-body-lg text-ink-muted">{lede}</p>}
    </Reveal>
  );
}
