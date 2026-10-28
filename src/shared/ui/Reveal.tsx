"use client";

import { useLayoutEffect, useRef } from "react";

import { mediaQueries, motionTokens } from "@/shared/lib/animation";

const easing = `cubic-bezier(${motionTokens.bezier.outExpo.join(", ")})`;

/**
 * Reveal catalogue (planning/DESIGN.md §10.4). `fade-up` rises and fades in; `media-scale` does
 * the same for a media frame while every image inside settles from 1.08 to 1 over the cinematic
 * duration; `rule-draw` draws a divider from its transform origin (set `origin-left` on it).
 */
export type RevealVariant = "fade-up" | "media-scale" | "rule-draw";

type Step = { target: Element; keyframes: Keyframe[]; duration: number; delay: number };

function steps(targets: Element[], variant: RevealVariant, y: number, delay: number, stagger: number): Step[] {
  const reveal = motionTokens.duration.reveal * 1000;
  const cinematic = motionTokens.duration.cinematic * 1000;
  return targets.flatMap((target, index) => {
    const start = (delay + index * stagger) * 1000;
    if (variant === "rule-draw") {
      return [{ target, keyframes: [{ transform: "scaleX(0)" }, { transform: "none" }], duration: cinematic, delay: start }];
    }
    const rise: Step = {
      target,
      keyframes: [
        { opacity: 0, transform: `translateY(${y}px)` },
        { opacity: 1, transform: "none" },
      ],
      duration: reveal,
      delay: start,
    };
    if (variant === "fade-up") return [rise];
    // `scale`, not `transform`: hover zooms and scroll parallax own the images' transforms.
    const settle = Array.from(target.querySelectorAll("img"), (image) => ({
      target: image,
      keyframes: [{ scale: "1.08" }, { scale: "1" }],
      duration: cinematic + 200,
      delay: start,
    }));
    return [rise, ...settle];
  });
}

/**
 * Scroll reveal (planning/DESIGN.md §10.4). Content is visible in the prerendered HTML; motion is
 * added only for elements still below the fold, never with reduced motion. With `stagger`, direct
 * children animate in sequence.
 *
 * Only opacity and transforms change (never `visibility`), so content waiting to be revealed stays
 * in the tab order and the accessibility tree; keyboard focus inside finishes the reveal at once.
 *
 * Built on IntersectionObserver and the Web Animations API rather than GSAP, so pages whose only
 * scroll motion is reveals (the service pages) ship no animation library.
 */
export function Reveal({
  as: Tag = "div",
  variant = "fade-up",
  delay = 0,
  y = 24,
  stagger,
  once = true,
  className,
  children,
}: {
  as?: "div" | "span" | "li" | "section";
  variant?: RevealVariant;
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

    // Paused at the start with backwards fill: each target holds the first frame until played.
    const targets = stagger ? Array.from(scope.children) : [scope];
    const animations = steps(targets, variant, y, delay, stagger ?? 0).map(({ target, keyframes, duration, delay: wait }) => {
      const animation = target.animate(keyframes, { duration, delay: wait, easing, fill: "both" });
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
  }, [variant, delay, y, stagger, once]);

  return (
    <Tag ref={scopeRef as React.Ref<never>} className={className}>
      {children}
    </Tag>
  );
}
