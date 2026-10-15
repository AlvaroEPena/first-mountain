import { EASE_OUT, EASE_SCREED, gsap, ScrollTrigger } from './register';

/** Every effect animates transform or opacity only, and its end state equals the CSS default. */

const all = <T extends Element = HTMLElement>(selector: string, scope: ParentNode = document) =>
  gsap.utils.toArray<T>(scope.querySelectorAll(selector));

/**
 * Screed reveal: the board sweeps off each wrapper as it enters. Motivation: images and headings
 * arrive the way a slab is finished, leveled left to right.
 */
export function screedReveal(): void {
  const wrappers = all('[data-screed]');
  if (wrappers.length === 0) return;
  ScrollTrigger.batch(wrappers, {
    start: 'top 85%',
    once: true,
    onEnter: (batch) =>
      gsap.to(
        batch.map((wrapper) => wrapper.querySelector('.screed__board')),
        { scaleX: 0, duration: 1.15, ease: EASE_SCREED, stagger: 0.14, overwrite: true },
      ),
  });
}

/** Supporting content rises in after its heading. Motivation: pace the reading order. */
export function revealOnScroll(): void {
  const items = all('[data-reveal]');
  if (items.length === 0) return;
  ScrollTrigger.batch(items, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: EASE_OUT,
        stagger: 0.08,
        overwrite: true,
      }),
  });
}

/** The 4.7 and the 30 count up once. Motivation: make the proof land as the visitor reaches it. */
export function countUp(): void {
  for (const node of all('[data-count]')) {
    const target = Number(node.dataset.count);
    const decimals = Number(node.dataset.decimals ?? 0);
    if (Number.isNaN(target)) continue;
    const state = { value: 0 };
    const render = () => {
      node.textContent = state.value.toFixed(decimals);
    };
    // Start from zero while still off screen; the real value is in the parent's accessible text.
    render();
    ScrollTrigger.create({
      trigger: node,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        gsap.to(state, {
          value: target,
          duration: 1.6,
          ease: 'power3.out',
          onUpdate: render,
          onComplete: () => {
            node.textContent = target.toFixed(decimals);
          },
        });
      },
    });
  }
}

/** The hero photo drifts a little slower than the page (6% max). Motivation: depth. */
export function heroParallax(): void {
  for (const frame of all('[data-parallax]')) {
    const image = frame.querySelector('img');
    if (!image) continue;
    gsap.fromTo(
      image,
      { yPercent: 0, scale: 1.06 },
      {
        yPercent: 6,
        scale: 1.06,
        ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top top', end: 'bottom top', scrub: true },
      },
    );
  }
}

/** Primary CTAs lean toward a fine pointer. Motivation: feedback that the button is live. */
export function magneticButtons(): void {
  for (const button of all('[data-magnetic]')) {
    const toX = gsap.quickTo(button, 'x', { duration: 0.45, ease: 'power3.out' });
    const toY = gsap.quickTo(button, 'y', { duration: 0.45, ease: 'power3.out' });
    button.addEventListener('pointermove', (event) => {
      const rect = button.getBoundingClientRect();
      toX((event.clientX - (rect.left + rect.width / 2)) * 0.22);
      toY((event.clientY - (rect.top + rect.height / 2)) * 0.3);
    });
    button.addEventListener('pointerleave', () => {
      toX(0);
      toY(0);
    });
  }
}

/**
 * "How a job goes" on wide screens: the photo panel is sticky (CSS), and as each step passes the
 * middle of the viewport it becomes active, its photo crossfades in and the joint rail fills.
 * Motivation: tell the job in order, one step at a time.
 */
export function processSequence(): void {
  const section = document.querySelector<HTMLElement>('[data-process]');
  if (!section) return;
  const steps = all('[data-step]', section);
  const photos = all('[data-step-photo]', section);
  const rail = section.querySelector<HTMLElement>('[data-process-rail]');

  const activate = (index: number) => {
    steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
    photos.forEach((frame, i) =>
      gsap.to(frame, { opacity: i === index ? 1 : 0, duration: 0.6, overwrite: true }),
    );
  };

  activate(0);
  steps.forEach((step, index) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => {
        if (self.isActive) activate(index);
      },
    });
  });
  if (rail) {
    gsap.fromTo(
      rail,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        transformOrigin: 'top center',
        scrollTrigger: {
          trigger: steps[0],
          endTrigger: steps[steps.length - 1],
          start: 'top 55%',
          end: 'bottom 55%',
          scrub: true,
        },
      },
    );
  }
}
