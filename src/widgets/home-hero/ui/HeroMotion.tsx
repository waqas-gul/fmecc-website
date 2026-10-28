"use client";

import { mediaQueries, motionTokens } from "@/shared/lib/animation";
import { gsap, useGsap } from "@/shared/lib/gsap";

/**
 * Scroll layer of the Home hero (planning/DESIGN.md §8, row 1). The entrance runs in CSS so the
 * headline paints without waiting for JavaScript; this island only adds what needs scroll position:
 * the media parallaxes 15 % and dims as the hero leaves, and the scroll cue runs three short passes
 * (under five seconds, so it needs no pause control). Nothing runs with reduced motion.
 */
export function HeroMotion({
  labelledBy,
  className,
  children,
}: {
  labelledBy: string;
  className?: string;
  children: React.ReactNode;
}) {
  const scopeRef = useGsap<HTMLElement>((_ctx, scope) => {
    gsap.matchMedia().add(mediaQueries.motionOk, () => {
      const media = scope.querySelector("[data-animate='hero-media']");
      if (media) {
        gsap.to(media, {
          yPercent: 15,
          opacity: 0.35,
          ease: "none",
          scrollTrigger: { trigger: scope, start: "top top", end: "bottom top", scrub: true },
        });
      }

      const cue = scope.querySelector("[data-animate='hero-cue']");
      if (cue) {
        gsap
          .timeline({ delay: motionTokens.duration.cinematic })
          .fromTo(cue, { yPercent: -100 }, { yPercent: 100, duration: 1.1, ease: motionTokens.ease.inOutQuart, repeat: 2 })
          .fromTo(cue, { yPercent: -100 }, { yPercent: 0, duration: 0.8, ease: motionTokens.ease.outExpo });
      }
    });
  });

  return (
    <section ref={scopeRef} data-section="" data-scheme="dark" aria-labelledby={labelledBy} className={className}>
      {children}
    </section>
  );
}
