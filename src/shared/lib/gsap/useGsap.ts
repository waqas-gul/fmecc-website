import { useLayoutEffect, useRef, type DependencyList, type RefObject } from "react";

import { gsap } from "./gsap";

/**
 * Runs GSAP setup inside a `gsap.context` scoped to the returned ref. Everything created in
 * `setup` (tweens, timelines, ScrollTriggers, SplitText) is reverted on unmount or when `deps` change.
 */
export function useGsap<T extends HTMLElement = HTMLDivElement>(
  setup: (ctx: gsap.Context, scope: T) => void,
  deps: DependencyList = [],
): RefObject<T | null> {
  const scopeRef = useRef<T>(null);
  const setupRef = useRef(setup);

  useLayoutEffect(() => {
    setupRef.current = setup;
  });

  useLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;
    const ctx = gsap.context((self) => setupRef.current(self, scope), scope);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- callers choose when setup re-runs
  }, deps);

  return scopeRef;
}
