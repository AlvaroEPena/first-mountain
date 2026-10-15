import { expect, test, type Page } from '@playwright/test';

import { scrollThroughPage } from '../support/scroll';
import { PAGES } from '../support/site';

const WIDTHS = [320, 390, 768, 1024, 1440] as const;
/** Spec breakpoint where the full header nav replaces the menu toggle (64rem). */
const NAV_BREAKPOINT = 1024;

/**
 * Elements that stick out of the viewport sideways. The body uses `overflow-x: clip`, which hides
 * page-level overflow from `scrollWidth`, so elements are measured directly. Content inside a
 * deliberate scroller or clipping box (rails, marquee) is ignored.
 */
async function horizontalOverflow(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const viewport = document.documentElement.clientWidth;
    const isClippedByAncestor = (element: Element) => {
      for (
        let node = element.parentElement;
        node && node !== document.body;
        node = node.parentElement
      ) {
        if (getComputedStyle(node).overflowX !== 'visible') return true;
      }
      return false;
    };
    const offenders: string[] = [];
    for (const element of Array.from(document.body.querySelectorAll('*'))) {
      const rect = element.getBoundingClientRect();
      if (rect.width <= 1 || rect.height <= 1) continue;
      if (rect.right <= viewport + 1 && rect.left >= -1) continue;
      if (isClippedByAncestor(element)) continue;
      const name = `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}.${[...element.classList].join('.')}`;
      offenders.push(
        `${name} spans ${Math.round(rect.left)}..${Math.round(rect.right)} (viewport ${viewport})`,
      );
    }
    const root = document.documentElement;
    if (root.scrollWidth > root.clientWidth) {
      offenders.unshift(`document scrollWidth ${root.scrollWidth} > ${root.clientWidth}`);
    }
    return offenders;
  });
}

test.describe('responsive layout', () => {
  for (const width of WIDTHS) {
    for (const sitePage of PAGES) {
      test(`${sitePage.name} at ${width}px: no horizontal overflow, navigation usable`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(sitePage.path);

        const primaryNav = page.getByRole('navigation', { name: 'Primary' });
        const menuToggle = page.getByRole('button', { name: 'Menu' });
        if (width >= NAV_BREAKPOINT) {
          await expect(primaryNav.getByRole('link', { name: 'Contact' })).toBeVisible();
          await expect(menuToggle).toBeHidden();
        } else {
          await expect(menuToggle).toBeVisible();
          await expect(menuToggle).toBeInViewport({ ratio: 1 });
        }
        await expect(
          page.getByRole('link', { name: /First Mountain Construction, home/ }),
        ).toBeInViewport();

        await scrollThroughPage(page);
        expect(await horizontalOverflow(page)).toEqual([]);
      });
    }
  }
});
