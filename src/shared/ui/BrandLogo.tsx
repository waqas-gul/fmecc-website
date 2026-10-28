import Image from "next/image";

import { brandLogo, site } from "@/shared/config";
import { cn } from "@/shared/lib/utils";

const heightClasses = {
  sm: "h-8",
  md: "h-8 lg:h-10",
  lg: "h-12",
} as const;

/**
 * FMECC logo lockup exactly as supplied, never recoloured or separated (planning/DESIGN.md §2.1).
 * The supplied PNG is transparent and its wordmarks are dark blue, so on dark schemes it sits on a
 * compact white plate (`--logo-plate`); on light surfaces the plate is transparent. The padding is
 * constant, so the header does not shift when it changes scheme on scroll.
 * Until public/images/brand/logo.png is added and `npm run images` has run, a clearly marked
 * temporary text logo is rendered instead; it is not a redrawn logo.
 */
export function BrandLogo({ size = "md", className }: { size?: keyof typeof heightClasses; className?: string }) {
  if (!brandLogo) {
    return (
      <span
        data-placeholder="logo"
        title="Temporary text logo: add public/images/brand/logo.png and run npm run images"
        className={cn("inline-flex items-center font-display leading-none font-extrabold tracking-tight text-ink", className)}
      >
        <span aria-hidden className={cn("flex items-center text-[1.625rem]", size === "lg" && "text-[2rem]")}>
          {site.name}
        </span>
        <span className="sr-only">
          {site.name} — {site.legalName}
        </span>
      </span>
    );
  }

  return (
    <span className={cn("inline-flex rounded-md bg-logo-plate px-2.5 py-1.5 transition-colors duration-300", className)}>
      <Image
        src={brandLogo.src}
        alt={brandLogo.alt}
        width={brandLogo.width}
        height={brandLogo.height}
        unoptimized
        loading="eager"
        className={cn("w-auto", heightClasses[size])}
      />
    </span>
  );
}
