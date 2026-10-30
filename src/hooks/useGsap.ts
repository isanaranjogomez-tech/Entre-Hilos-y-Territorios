import { useLayoutEffect, type RefObject } from 'react';
import { gsap } from '@/lib/gsap';

/**
 * Runs GSAP setup scoped to `scope`, and reverts every tween and
 * ScrollTrigger it created when the component unmounts.
 */
export function useGsap(
  setup: (ctx: gsap.Context) => void | (() => void),
  scope: RefObject<HTMLElement>,
  deps: unknown[] = [],
) {
  useLayoutEffect(() => {
    if (!scope.current) return;
    const ctx = gsap.context((self) => setup(self), scope);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
