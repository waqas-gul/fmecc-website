"use client";

import { useLayoutEffect, useRef } from "react";

import { mediaQueries, motionTokens } from "@/shared/lib/animation";

const easing = `cubic-bezier(${motionTokens.bezier.outExpo.join(", ")})`;

/**
 * Fade-up reveal on scroll (planning/DESIGN.md §10.4). Content is visible in the prerendered
 * HTML; motion is added only for elements still below the fold, never with reduced motion.
 * With `stagger`, direct children animate in sequence.
 *
 * Only opacity and transform change (never `visibility`), so content waiting to be revealed stays
 * in the tab order and the accessibility tree; keyboard focus inside finishes the reveal at once.
 *
 * Built on IntersectionObserver and the Web Animations API rather than GSAP, so pages whose only
 * scroll motion is reveals (the service pages) ship no animation library.
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
  const scopeRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const scope = scopeRef.current;
    const motionOk = window.matchMedia(mediaQueries.motionOk);
    if (!scope || !motionOk.matches || typeof scope.animate !== "function") return;
    if (scope.getBoundingClientRect().top < window.innerHeight) return;

    // Paused at the start with backwards fill: each target holds the first frame (opacity 0) until played.
    const animations = (stagger ? Array.from(scope.children) : [scope]).map((target, index) => {
      const animation = target.animate(
        [
          { opacity: 0, transform: `translateY(${y}px)` },
          { opacity: 1, transform: "none" },
        ],
        {
          duration: motionTokens.duration.reveal * 1000,
          delay: (delay + index * (stagger ?? 0)) * 1000,
          easing,
          fill: "both",
        },
      );
      animation.pause();
      // A one-time reveal drops its effect when done: the element rests on its own styles again.
      if (once) animation.onfinish = () => animation.cancel();
      return animation;
    });

    // The reveal line sits at 80 % of the viewport height, like ScrollTrigger's "top 80%".
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play(1);
        // Jumped past it (anchor link, Home/End): show it at once rather than make the reader wait.
        else if (entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0)) finish();
        else if (!once) play(-1);
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    let settled = false;
    const settle = () => {
      if (!once) return;
      settled = true;
      observer.disconnect();
    };
    function play(rate: 1 | -1) {
      if (settled) return;
      settle();
      animations.forEach((animation) => {
        animation.playbackRate = rate;
        animation.play();
      });
    }
    function finish() {
      settle();
      animations.forEach((animation) => animation.finish());
    }
    observer.observe(scope);

    const onMotionChange = () => !motionOk.matches && finish();
    scope.addEventListener("focusin", finish);
    motionOk.addEventListener("change", onMotionChange);
    return () => {
      observer.disconnect();
      scope.removeEventListener("focusin", finish);
      motionOk.removeEventListener("change", onMotionChange);
      animations.forEach((animation) => animation.cancel());
    };
  }, [delay, y, stagger, once]);

  return (
    <Tag ref={scopeRef as React.Ref<never>} className={className}>
      {children}
    </Tag>
  );
}
