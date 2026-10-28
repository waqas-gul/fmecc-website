"use client";

import { mediaQueries } from "@/shared/lib/animation";
import { gsap, useGsap } from "@/shared/lib/gsap";
import { cn } from "@/shared/lib/utils";

/**
 * Featured projects track (planning/DESIGN.md §8, row 5). Below 1024 px, and with reduced motion,
 * it is a native horizontal scroller with snap points. At ≥ 1024 px it pins and vertical scroll
 * scrubs it sideways, for at most 150 % of the viewport height; keyboard focus on an off-screen
 * card scrolls the page to the position that brings the card into view.
 */
export function ProjectRail({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  const scopeRef = useGsap<HTMLDivElement>((_ctx, scope) => {
    const track = scope.querySelector<HTMLElement>("[data-animate='rail-track']");
    const items = gsap.utils.toArray<HTMLElement>("[data-animate='rail-item']", scope);
    if (!track || items.length === 0) return;

    gsap.matchMedia().add(`${mediaQueries.lg} and ${mediaQueries.motionOk}`, () => {
      const first = items[0];
      const last = items[items.length - 1];
      // Scroll the last card until its right edge meets the content edge (the track's end padding).
      const distance = () =>
        Math.max(0, last.offsetLeft + last.offsetWidth + parseFloat(getComputedStyle(track).paddingRight) - track.clientWidth);
      if (distance() < 1) return;

      gsap.set(track, { overflowX: "visible", scrollSnapType: "none" });
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: scope,
          start: "center center",
          end: () => `+=${Math.min(distance(), window.innerHeight * 1.5)}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      let frame = 0;
      const onFocusIn = (event: FocusEvent) => {
        const item = (event.target as HTMLElement).closest<HTMLElement>("[data-animate='rail-item']");
        const trigger = tween.scrollTrigger;
        if (!item || !trigger) return;
        const progress = gsap.utils.clamp(0, 1, (item.offsetLeft - first.offsetLeft) / distance());
        // After the browser's own focus scroll, which runs once this event has been dispatched.
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() =>
          window.scrollTo({ top: trigger.start + progress * (trigger.end - trigger.start), behavior: "instant" }),
        );
      };
      track.addEventListener("focusin", onFocusIn);
      return () => {
        cancelAnimationFrame(frame);
        track.removeEventListener("focusin", onFocusIn);
      };
    });
  });

  return (
    <div ref={scopeRef} className={cn("overflow-x-clip", className)}>
      <ul
        aria-label={label}
        data-animate="rail-track"
        className="relative flex snap-x snap-mandatory scroll-ps-[max(var(--gutter),calc((100%_-_80rem)/2))] gap-6 overflow-x-auto ps-[max(var(--gutter),calc((100%_-_80rem)/2))] pe-[max(var(--gutter),calc((100%_-_80rem)/2))] pb-4 lg:gap-8"
      >
        {children}
      </ul>
    </div>
  );
}
