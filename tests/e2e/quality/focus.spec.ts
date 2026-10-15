import { expect, test, type Page } from '@playwright/test';

import { PAGES } from '../support/site';

/** Upper bound on Tab presses per page; the longest page has well under this many stops. */
const MAX_TAB_STOPS = 200;

interface FocusCheck {
  /** Stable description of the focused element, used to detect wrapping back to the start. */
  key: string;
  /** Why the element is hidden, or null when a person can see it. */
  obscuredBy: string | null;
}

/**
 * Describes the focused element once scrolling has settled, and whether fixed or sticky chrome
 * (header, sticky sub-navs, mobile action bar) hides it completely (WCAG 2.2 SC 2.4.11).
 */
async function inspectFocus(page: Page): Promise<FocusCheck | null> {
  return page.evaluate(async () => {
    const frame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    // Focus scrolling may be smooth: wait until the scroll position stops changing.
    let last = -1;
    for (let stable = 0; stable < 3;) {
      await frame();
      stable = window.scrollY === last ? stable + 1 : 0;
      last = window.scrollY;
    }

    const element = document.activeElement;
    if (!element || element === document.body) return null;
    const label = (element.textContent ?? element.getAttribute('aria-label') ?? '')
      .trim()
      .replace(/\s+/g, ' ')
      .slice(0, 40);
    const key = `${element.tagName.toLowerCase()} "${label}" ${element.getAttribute('href') ?? ''}`;

    // Controls that live in fixed or sticky chrome are on top by definition.
    for (let node: Element | null = element; node; node = node.parentElement) {
      const position = getComputedStyle(node).position;
      if (position === 'fixed' || position === 'sticky') return { key, obscuredBy: null };
    }
    const rect = element.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return { key, obscuredBy: null };

    const inset = 3;
    const points = [
      [rect.left + rect.width / 2, rect.top + rect.height / 2],
      [rect.left + inset, rect.top + inset],
      [rect.right - inset, rect.top + inset],
      [rect.left + inset, rect.bottom - inset],
      [rect.right - inset, rect.bottom - inset],
    ].filter(([x = -1, y = -1]) => x >= 0 && y >= 0 && x < innerWidth && y < innerHeight);
    const hits = points.map(([x = 0, y = 0]) => document.elementFromPoint(x, y));
    const isVisible = hits.some((hit) => hit && (hit === element || element.contains(hit)));
    if (isVisible) return { key, obscuredBy: null };
    const cover = hits.find((hit) => hit && !element.contains(hit));
    // Name the landmark or component that does the covering, not just the innermost node.
    const container = cover?.closest('[aria-label], header, nav, [class]');
    const containerName = container
      ? (container.getAttribute('aria-label') ??
        `${container.tagName.toLowerCase()}.${[...container.classList].join('.')}`)
      : '';
    const coverName = cover
      ? `${cover.tagName.toLowerCase()}${containerName ? ` in "${containerName}"` : ''}`
      : 'off screen';
    return { key, obscuredBy: coverName };
  });
}

test.describe('focus not obscured (WCAG 2.4.11)', () => {
  for (const sitePage of PAGES) {
    test(`${sitePage.name}: no Tab stop is hidden under sticky or fixed bars`, async ({ page }) => {
      await page.goto(sitePage.path);
      const obscured: string[] = [];
      const seen = new Set<string>();
      for (let stop = 0; stop < MAX_TAB_STOPS; stop += 1) {
        await page.keyboard.press('Tab');
        const focus = await inspectFocus(page);
        if (!focus) continue;
        if (seen.has(focus.key)) break;
        seen.add(focus.key);
        if (focus.obscuredBy) obscured.push(`${focus.key} hidden by ${focus.obscuredBy}`);
      }
      expect(seen.size, 'Tab stops reached').toBeGreaterThan(5);
      expect(obscured).toEqual([]);
    });
  }
});
