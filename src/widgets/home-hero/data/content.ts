import { placeholderImage } from "@/shared/lib/media";
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

// FMECC has not supplied the hero loop yet (planning/DESIGN.md §12.3). While `placeholder` is set,
// VideoBackground renders the poster panel only and requests no video file.
export const heroVideo: VideoAsset = {
  mp4: "/videos/home-hero.mp4",
  webm: "/videos/home-hero.webm",
  poster: placeholderImage("FMECC construction and telecom site footage", "16:9"),
  placeholder: true,
};
