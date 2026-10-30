import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: 'power3.out' });
ScrollTrigger.config({ ignoreMobileResize: true });

/** Breakpoints used by gsap.matchMedia across chapters. */
export const MQ = {
  desktopMotion: '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
  mobileMotion: '(max-width: 899px) and (prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
} as const;

export { gsap, ScrollTrigger };
