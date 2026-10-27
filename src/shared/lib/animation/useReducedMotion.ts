import { useSyncExternalStore } from "react";

import { mediaQueries } from "./tokens";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(mediaQueries.reduced);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(mediaQueries.reduced).matches;

/** True when the user asks for reduced motion. Prerendered HTML assumes motion is allowed. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
