import { expect, test } from '@playwright/test';

import { scrollThroughPage } from '../support/scroll';
import { PAGES } from '../support/site';
import { BANNED_DASHES } from '../support/text';

/** Spec §9 and CLAUDE.md: no em or en dashes in visible copy. */
test.describe('copy', () => {
  for (const sitePage of PAGES) {
    test(`${sitePage.name}: no em or en dashes in visible text`, async ({ page }) => {
      await page.goto(sitePage.path);
      await scrollThroughPage(page);

      const offending = await page.evaluate((pattern) => {
        const dash = new RegExp(pattern);
        // Rendered text, plus text people meet through assistive tech or tooltips.
        const attributes = Array.from(
          document.querySelectorAll('[alt], [aria-label], [title]'),
        ).flatMap((element) =>
          ['alt', 'aria-label', 'title'].map((name) => element.getAttribute(name) ?? ''),
        );
        return [document.title, ...document.body.innerText.split('\n'), ...attributes].filter(
          (text) => dash.test(text),
        );
      }, BANNED_DASHES.source);

      expect(offending).toEqual([]);
    });
  }
});
