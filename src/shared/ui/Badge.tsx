import { cn } from "@/shared/lib/utils";

const toneClasses = {
  neutral: "border-line-strong text-ink-muted",
  accent: "border-accent text-accent-text",
  brand: "border-transparent bg-surface-inverse text-ink-inverse",
} as const;

export function Badge({ tone = "neutral", children }: { tone?: keyof typeof toneClasses; children: React.ReactNode }) {
  return (
    <span className={cn("type-label inline-flex items-center rounded-full border px-3 py-1.5", toneClasses[tone])}>
      {children}
    </span>
  );
}
