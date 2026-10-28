import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registered once for the whole app (planning/ARCHITECTURE.md §11). Import GSAP from here only.
// SplitText is not registered here: this module is a side effect of every GSAP island, and only
// Home's line reveal splits text, so it registers SplitText itself (see ./index.ts).
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "expo.out", duration: 0.6 });
  // Web fonts change line heights; re-measure trigger positions once they are ready.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

export { gsap, ScrollTrigger };
