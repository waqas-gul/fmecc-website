import type { VideoAsset } from "@/shared/types/media";

// TODO(content): draft hero copy for FMECC to confirm. It names the four services only and makes
// no claims about scale, history or clients (planning/MASTER_PLAN.md §5, row 1).
export const heroContent = {
  eyebrow: "Engineering and construction",
  /** Authored lines of the display headline (max three), revealed one by one. */
  headline: ["Buildings.", "Telecom towers.", "Secure sites."],
  lede: "Building construction, telecom tower rollout, security systems and hydraulic parking bollards, delivered from first survey to final handover.",
  primaryCta: "Request a quotation",
  secondaryCta: "Explore services",
  quickLinksLabel: "Service quick links",
  scrollCue: "Scroll",
} as const;

// Licensed stock footage, illustrative only and not an FMECC project (planning/MEDIA_PLAN.md):
// an 11.9 s forward-and-back loop (DESIGN.md §12.3). The poster is the loop's first frame, so the
// video fades in over an identical picture.
export const heroVideo: VideoAsset = {
  mp4: "/videos/home-hero.mp4",
  webm: "/videos/home-hero.webm",
  poster: {
    src: "/images/home/home-hero-poster.webp",
    width: 1920,
    height: 1080,
    alt: "Building under construction at night, with a lit tower crane against a dark blue sky",
  },
};
