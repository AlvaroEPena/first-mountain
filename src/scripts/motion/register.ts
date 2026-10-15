import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registered exactly once; every motion module imports gsap from here.
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/** Screed boards move like a real board: steady pull, firm stop. */
export const EASE_SCREED = 'power2.inOut';
export const EASE_OUT = 'expo.out';
