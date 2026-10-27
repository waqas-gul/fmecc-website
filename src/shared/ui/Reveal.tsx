"use client";

import { mediaQueries, motionTokens } from "@/shared/lib/animation";
import { gsap, useGsap } from "@/shared/lib/gsap";

/**
 * Fade-up reveal on scroll (planning/DESIGN.md §10.4). Content is visible in the prerendered
 * HTML; motion is added only for elements still below the fold, never with reduced motion.
 * With `stagger`, direct children animate in sequence.
 */
export function Reveal({
  as: Tag = "div",
  delay = 0,
  y = 24,
  stagger,
  once = true,
  className,
  children,
}: {
  as?: "div" | "span" | "li" | "section";
  delay?: number;
  y?: number;
  stagger?: number;
  once?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const scopeRef = useGsap<HTMLElement>(
    (_ctx, scope) => {
      if (window.matchMedia(mediaQueries.reduced).matches) return;
      if (scope.getBoundingClientRect().top < window.innerHeight) return;

      gsap.from(stagger ? Array.from(scope.children) : scope, {
        y,
        autoAlpha: 0,
        delay,
        duration: motionTokens.duration.reveal,
        ease: motionTokens.ease.outExpo,
        stagger: stagger ?? 0,
        scrollTrigger: {
          trigger: scope,
          start: "top 80%",
          toggleActions: once ? "play none none none" : "play none none reverse",
        },
      });
    },
    [delay, y, stagger, once],
  );

  return (
    <Tag ref={scopeRef as React.Ref<never>} className={className}>
      {children}
    </Tag>
  );
}
