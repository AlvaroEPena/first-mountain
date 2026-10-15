import {
  countUp,
  heroParallax,
  magneticButtons,
  processSequence,
  revealOnScroll,
  screedReveal,
} from './effects';
import { gsap, ScrollTrigger } from './register';

declare global {
  interface Window {
    /** Set by the head script when the page arrived through a view transition. */
    __fmRevealed?: Promise<unknown>;
  }
}

/** Wait for an incoming view transition so GSAP never animates elements mid-snapshot. */
async function afterViewTransition(): Promise<void> {
  const finished = window.__fmRevealed;
  if (!finished) return;
  await Promise.race([finished.catch(() => undefined), new Promise((r) => setTimeout(r, 600))]);
}

/**
 * Starts every effect inside gsap.matchMedia so each is torn down if the visitor's motion
 * preference changes mid-session. Pointer effects only run on fine pointers, the sequenced
 * process only on wide screens.
 */
export async function runMotion(): Promise<void> {
  const root = document.documentElement;
  // The head failsafe already revealed everything (slow network): do not replay and flash.
  if (!root.hasAttribute('data-motion')) return;
  await afterViewTransition();
  // The failsafe may have fired while we waited: content is already shown, so do not animate it.
  if (!root.hasAttribute('data-motion')) return;
  const media = gsap.matchMedia();

  media.add(
    {
      motion: '(prefers-reduced-motion: no-preference)',
      finePointer: '(hover: hover) and (pointer: fine)',
      wide: '(min-width: 64rem)',
    },
    (context) => {
      const { motion, finePointer, wide } = context.conditions ?? {};
      if (!motion) {
        root.removeAttribute('data-motion');
        return;
      }
      screedReveal();
      revealOnScroll();
      countUp();
      heroParallax();
      if (wide) processSequence();
      if (finePointer) magneticButtons();
    },
  );

  root.setAttribute('data-motion-ready', '');

  // Restored from the back/forward cache: positions may have changed.
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) ScrollTrigger.refresh();
  });
}
