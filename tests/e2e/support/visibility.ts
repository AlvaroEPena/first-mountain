import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Playwright's `toBeVisible()` treats `opacity: 0` and elements hidden under an overlay as
 * visible. The site hides content behind scroll reveals (opacity + translate) and screed boards
 * (a `scaleX` overlay with `pointer-events: none`), so these helpers check what a person sees.
 */

/** Rendered motion states that are not at rest: reveals not faded in, boards still covering. */
export async function unsettledMotion(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const describe = (element: Element) => {
      const id = element.closest('[id]')?.id;
      const text = (element.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 40);
      return `${element.tagName.toLowerCase()}${id ? ` in #${id}` : ''} "${text}"`;
    };
    const scaleX = (element: Element) => {
      const transform = getComputedStyle(element).transform;
      if (transform === 'none') return 1;
      return Number(transform.match(/matrix\(([^,]+)/)?.[1] ?? 1);
    };
    const problems: string[] = [];
    for (const reveal of Array.from(document.querySelectorAll('[data-reveal]'))) {
      if (!reveal.checkVisibility()) continue;
      const opacity = Number(getComputedStyle(reveal).opacity);
      if (opacity < 0.99) problems.push(`reveal at opacity ${opacity}: ${describe(reveal)}`);
    }
    for (const board of Array.from(document.querySelectorAll('.screed__board'))) {
      const wrapper = board.parentElement;
      if (!wrapper?.checkVisibility()) continue;
      if (scaleX(board) > 0.01) problems.push(`screed board still covering: ${describe(wrapper)}`);
    }
    return problems;
  });
}

/** Waits until every reveal and screed board on the page has finished. */
export async function expectMotionSettled(page: Page): Promise<void> {
  await expect
    .poll(() => unsettledMotion(page), { message: 'motion left content hidden', timeout: 15_000 })
    .toEqual([]);
}

/**
 * Asserts that an element is really seen: scrolled to the middle of the viewport, fully opaque
 * (including ancestors), not under a screed board, and the topmost element at its centre.
 */
export async function expectSeen(locator: Locator): Promise<void> {
  await locator.evaluate((element) =>
    element.scrollIntoView({ block: 'center', behavior: 'instant' }),
  );
  await expect
    .poll(
      () =>
        locator.evaluate((element) => {
          let opacity = 1;
          for (let node: Element | null = element; node; node = node.parentElement) {
            opacity *= Number(getComputedStyle(node).opacity);
          }
          if (opacity < 0.99) return `opacity ${opacity.toFixed(2)}`;
          const board = element.closest('.screed')?.querySelector(':scope > .screed__board');
          if (board) {
            const transform = getComputedStyle(board).transform;
            const scale =
              transform === 'none' ? 1 : Number(transform.match(/matrix\(([^,]+)/)?.[1]);
            if (scale > 0.01) return `screed board covers it (scaleX ${scale.toFixed(2)})`;
          }
          const rect = element.getBoundingClientRect();
          if (rect.width < 1 || rect.height < 1) return 'no size';
          const top = document.elementFromPoint(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
          );
          if (!top || !(element === top || element.contains(top))) {
            return `covered by ${top?.tagName.toLowerCase()}.${top?.className}`;
          }
          return 'seen';
        }),
      { message: 'element is not visible to a person' },
    )
    .toBe('seen');
}
