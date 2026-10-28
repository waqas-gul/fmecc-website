// Scroll-linked progress without GSAP. The showcase only needs one number per frame, and GSAP +
// ScrollTrigger would add ~46 KB gz to every service page (MASTER_PLAN §8 budget).

/**
 * ScrollTrigger-style progress, 0–1: 0 when the element's top reaches `start` (share of the
 * viewport height from the top), 1 when the point `anchor` down the element (0 top, 0.5 centre,
 * 1 bottom) reaches `end`.
 */
export function scrollProgress(rect: DOMRect, viewport: number, start: number, end: number, anchor = 1) {
  const from = viewport * start;
  const to = viewport * end - rect.height * anchor;
  if (from <= to) return rect.top <= to ? 1 : 0;
  return Math.min(1, Math.max(0, (from - rect.top) / (from - to)));
}

/**
 * Runs `measure` once per animation frame while the page scrolls or resizes, or a media query
 * flips, and once immediately. Passive listeners; returns the cleanup.
 */
export function onScrollFrame(measure: () => void, queries: readonly MediaQueryList[] = []) {
  let frame = 0;
  const schedule = () => {
    frame ||= requestAnimationFrame(() => {
      frame = 0;
      measure();
    });
  };
  schedule();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  queries.forEach((query) => query.addEventListener("change", schedule));
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    queries.forEach((query) => query.removeEventListener("change", schedule));
  };
}
