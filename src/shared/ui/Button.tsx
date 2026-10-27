import type { Route } from "next";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";

import { cn } from "@/shared/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "link";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
  className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-ink hover:bg-accent-hover",
  secondary: "bg-surface-inverse text-ink-inverse hover:bg-surface-inverse-hover",
  outline: "border border-line-strong text-ink hover:border-ink",
  ghost: "text-ink hover:bg-surface-muted",
  link: "text-accent-text decoration-1 underline-offset-4 hover:underline",
};

// Boxed sizes are 36 / 44 / 52 px tall (planning/DESIGN.md §7.1); the link variant keeps text metrics only.
const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 type-label",
  md: "h-11 px-5 text-body",
  lg: "h-13 px-7 text-body",
};

const linkSizeClasses: Record<ButtonSize, string> = {
  sm: "type-label",
  md: "text-body",
  lg: "text-body-lg",
};

export function buttonClassName({ variant = "primary", size = "md", fullWidth, className }: ButtonStyleProps): string {
  return cn(
    "group/button inline-flex items-center justify-center gap-2 rounded-sm font-semibold whitespace-nowrap",
    "transition-[background-color,border-color,color] duration-150 ease-standard",
    "disabled:pointer-events-none disabled:opacity-50",
    variant === "link" ? cn("py-1", linkSizeClasses[size]) : sizeClasses[size],
    variantClasses[variant],
    fullWidth && "w-full",
    className,
  );
}

function ButtonContent({
  children,
  icon,
  iconPosition = "end",
  loading = false,
}: Pick<ButtonStyleProps, "icon" | "iconPosition"> & { children: React.ReactNode; loading?: boolean }) {
  const glyph = loading ? <LoaderCircle className="motion-safe:animate-spin" /> : icon;
  const slot = glyph ? (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 [&>svg]:size-[18px]",
        iconPosition === "end" &&
          !loading &&
          "motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover/button:translate-x-1",
      )}
    >
      {glyph}
    </span>
  ) : null;
  const start = loading || iconPosition === "start";

  return (
    <>
      {start && slot}
      {children}
      {!start && slot}
    </>
  );
}

export function Button({
  variant,
  size,
  fullWidth,
  icon,
  iconPosition,
  className,
  loading = false,
  disabled,
  type = "button",
  children,
  ...rest
}: ButtonStyleProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClassName({ variant, size, fullWidth, className })}
      {...rest}
    >
      <ButtonContent icon={icon} iconPosition={iconPosition} loading={loading}>
        {children}
      </ButtonContent>
    </button>
  );
}

export type LinkButtonHref = Route | `http${string}` | `tel:${string}` | `mailto:${string}`;

export function LinkButton({
  href,
  external = false,
  variant,
  size,
  fullWidth,
  icon,
  iconPosition,
  className,
  children,
}: ButtonStyleProps & { href: LinkButtonHref; children: React.ReactNode; external?: boolean }) {
  const classes = buttonClassName({ variant, size, fullWidth, className });
  const content = (
    <ButtonContent icon={icon} iconPosition={iconPosition}>
      {children}
    </ButtonContent>
  );

  if (href.startsWith("/") && !external) {
    return (
      <Link href={href as Route} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} className={classes} {...(external && { target: "_blank", rel: "noopener noreferrer" })}>
      {content}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
