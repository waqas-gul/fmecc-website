/** Motion tokens (planning/DESIGN.md §2.4, §10). Durations are in seconds. */
export const motionTokens = {
  duration: { micro: 0.15, ui: 0.25, reveal: 0.6, cinematic: 1.2 },
  /** GSAP ease names matching the CSS easing tokens. */
  ease: { outExpo: "expo.out", inOutQuart: "power3.inOut", standard: "power2.out" },
  /** Cubic-bezier tuples of the same easings, for Motion. */
  bezier: {
    outExpo: [0.16, 1, 0.3, 1],
    inOutQuart: [0.76, 0, 0.24, 1],
    standard: [0.2, 0, 0, 1],
  },
} as const;

export const mediaQueries = {
  reduced: "(prefers-reduced-motion: reduce)",
  motionOk: "(prefers-reduced-motion: no-preference)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
} as const;
