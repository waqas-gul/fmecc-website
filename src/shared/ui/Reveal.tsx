"use client";

import { mediaQueries, motionTokens } from "@/shared/lib/animation";
import { gsap, useGsap } from "@/shared/lib/gsap";

/**
 * Fade-up reveal on scroll (planning/DESIGN.md §10.4). Content is visible in the prerendered
 * HTML; motion is added only for elements still below the fold, never with reduced motion.
 * With `stagger`, direct children animate in sequence.
 *
 * Only opacity and transform change (never `visibility`), so content waiting to be revealed stays
 * in the tab order and the accessibility tree; keyboard focus inside finishes the reveal at once.
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
      if (scope.getBoundingClientRect().top < window.innerHeight) return;

      gsap.matchMedia().add(mediaQueries.motionOk, () => {
        const tween = gsap.from(stagger ? Array.from(scope.children) : scope, {
          y,
          opacity: 0,
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

        const finish = () => tween.progress(1);
        scope.addEventListener("focusin", finish);
        return () => scope.removeEventListener("focusin", finish);
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
