// Import GSAP only from here, and only in client components that animate with it.
export { gsap, ScrollTrigger } from "./gsap";
// Side-effect free (gsap declares `sideEffects: false`), so it is bundled only where it is used.
// Call `gsap.registerPlugin(SplitText)` before the first split.
export { SplitText } from "gsap/SplitText";
export { useGsap } from "./useGsap";
