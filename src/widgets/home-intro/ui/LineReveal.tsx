"use client";

import { mediaQueries, motionTokens } from "@/shared/lib/animation";
import { gsap, SplitText, useGsap } from "@/shared/lib/gsap";

/**
 * `line-reveal` for a statement headline (planning/DESIGN.md §10.4): SplitText masks each line and
 * raises it into place on scroll. The text is complete in the prerendered HTML; the split happens
 * only for headlines still below the fold, never with reduced motion, and re-runs on reflow.
 */
export function LineReveal({
  as: Tag = "h2",
  className,
  children,
}: {
  as?: "h2" | "h3";
  className?: string;
  children: React.ReactNode;
}) {
  const scopeRef = useGsap<HTMLHeadingElement>((_ctx, scope) => {
    if (window.matchMedia(mediaQueries.reduced).matches) return;
    if (scope.getBoundingClientRect().top < window.innerHeight) return;

    gsap.registerPlugin(SplitText);
    SplitText.create(scope, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      // Returning the tween lets SplitText revert and time-sync it whenever the lines re-split.
      // The masks clip descenders at display line heights, so the original text returns once
      // the one-time reveal has finished.
      onSplit: (split) =>
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 0.9,
          ease: motionTokens.ease.outExpo,
          stagger: 0.08,
          scrollTrigger: { trigger: scope, start: "top 80%" },
          onComplete: () => gsap.delayedCall(0, () => split.revert()),
        }),
    });
  });

  return (
    <Tag ref={scopeRef} className={className}>
      {children}
    </Tag>
  );
}
