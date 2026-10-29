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
 * Progress, 0–1, tied to anchors in document order: each pairs an element edge (`top`, viewport
 * coordinates) with the progress it marks (`at`). 0 until the first anchor reaches `line` (pixels
 * from the viewport top), linear between consecutive anchors, 1 once the last has passed it.
 */
export function anchoredProgress(anchors: readonly { top: number; at: number }[], line: number) {
  if (anchors.length === 0 || line < anchors[0].top) return 0;
  for (let index = 1; index < anchors.length; index++) {
    const from = anchors[index - 1];
    const to = anchors[index];
    if (line < to.top) return from.at + (to.at - from.at) * ((line - from.top) / (to.top - from.top));
  }
  return 1;
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
