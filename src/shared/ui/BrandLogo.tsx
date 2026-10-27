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
 * `plate` puts it on a white plate for dark surfaces until an inverse version exists.
 * Until public/images/brand/logo.png is added and `npm run images` has run, a clearly marked
 * temporary text logo is rendered instead; it is not a redrawn logo.
 */
export function BrandLogo({
  size = "md",
  plate = false,
  className,
}: {
  size?: keyof typeof heightClasses;
  plate?: boolean;
  className?: string;
}) {
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
    <span className={cn("inline-flex", plate && "rounded-sm bg-white p-3", className)}>
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
