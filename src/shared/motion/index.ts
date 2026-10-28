// GSAP-powered client primitives. Importing this slice adds GSAP + ScrollTrigger to the route, so
// use it only on routes that already run scroll choreography (Home, About); reveals elsewhere use
// the GSAP-free `Reveal` from '@/shared/ui'.
export { LineReveal } from "./LineReveal";
