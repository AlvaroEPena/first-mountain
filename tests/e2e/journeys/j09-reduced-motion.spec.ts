import { expect, test, type Page } from '@playwright/test';

import { scrollThroughPage } from '../support/scroll';
import { PAGES } from '../support/site';
import { unsettledMotion } from '../support/visibility';

// J9. A visitor with prefers-reduced-motion: reduce gets all content with no motion, and the GSAP
// chunk isn't requested.

/** Bodies of every script the page downloads, so the GSAP chunk is found by content, not name. */
function collectScripts(page: Page): Promise<string>[] {
  const bodies: Promise<string>[] = [];
  page.on('response', (response) => {
    if (response.request().resourceType() === 'script') {
      bodies.push(response.text().catch(() => ''));
    }
  });
  return bodies;
}

const GSAP_SIGNATURE = /ScrollTrigger|GreenSock/;

/**
 * Declared motion that is still live under reduced motion: CSS animations, and transitions on
 * movement properties (transform, translate, scale, rotate) with a non-zero duration, on elements
 * and their ::before/::after. Read from computed styles, so the result does not depend on whether
 * a short transition happens to be running when the test looks. Fades and colour changes do not
 * move anything and are allowed.
 */
async function liveMotionDeclarations(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const MOVEMENT = /^(all|transform|translate|scale|rotate)$/;
    const seconds = (value: string) =>
      value.endsWith('ms') ? Number.parseFloat(value) / 1000 : Number.parseFloat(value);
    const describe = (element: Element, pseudo: string) => {
      const className = element.getAttribute('class')?.trim().split(/\s+/).join('.');
      return `${element.tagName.toLowerCase()}${className ? `.${className}` : ''}${pseudo}`;
    };
    const found = new Set<string>();
    for (const element of Array.from(document.querySelectorAll('body *'))) {
      for (const pseudo of ['', '::before', '::after']) {
        const style = getComputedStyle(element, pseudo || null);
        if (pseudo && style.content === 'none') continue;
        if (style.animationName !== 'none' && style.display !== 'none') {
          found.add(`animation ${style.animationName} on ${describe(element, pseudo)}`);
        }
        const properties = style.transitionProperty.split(',').map((name) => name.trim());
        const durations = style.transitionDuration.split(',').map((value) => seconds(value.trim()));
        properties.forEach((property, index) => {
          const duration = durations[index % durations.length] ?? 0;
          if (MOVEMENT.test(property) && duration > 0) {
            found.add(`transition ${property} ${duration}s on ${describe(element, pseudo)}`);
          }
        });
      }
    }
    return [...found].sort();
  });
}

test.describe('J9 reduced motion', () => {
  test.skip(
    ({ contextOptions }) => contextOptions.reducedMotion !== 'reduce',
    'Runs in the reduced-motion project only.',
  );

  for (const sitePage of PAGES) {
    test(`${sitePage.name}: content visible at once, no scroll motion, no GSAP`, async ({
      page,
    }) => {
      const scripts = collectScripts(page);
      await page.goto(sitePage.path);

      await expect(page.locator('html')).not.toHaveAttribute('data-motion', /.*/);
      // Nothing hidden waiting for a scroll trigger, even before scrolling.
      expect(await unsettledMotion(page)).toEqual([]);

      await scrollThroughPage(page);
      expect(await unsettledMotion(page)).toEqual([]);

      const bodies = await Promise.all(scripts);
      expect(
        bodies.some((body) => GSAP_SIGNATURE.test(body)),
        'GSAP was downloaded',
      ).toBe(false);
    });
  }

  test('no page declares animations or movement transitions', async ({ page }) => {
    const byDeclaration = new Map<string, string[]>();
    for (const sitePage of PAGES) {
      await page.goto(sitePage.path);
      await scrollThroughPage(page);
      for (const declaration of await liveMotionDeclarations(page)) {
        byDeclaration.set(declaration, [...(byDeclaration.get(declaration) ?? []), sitePage.name]);
      }
    }
    const report = [...byDeclaration].map(
      ([declaration, pages]) => `${declaration} (${pages.join(', ')})`,
    );
    expect(report, 'motion still declared under prefers-reduced-motion: reduce').toEqual([]);
  });
});

test.describe('J9 control: motion is on without the preference', () => {
  test.skip(
    ({ contextOptions }) => contextOptions.reducedMotion === 'reduce',
    'Control for the motion-allowed projects.',
  );

  test('home loads GSAP and reports motion ready', async ({ page }) => {
    const scripts = collectScripts(page);
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-motion-ready', '');
    const bodies = await Promise.all(scripts);
    expect(bodies.some((body) => GSAP_SIGNATURE.test(body))).toBe(true);
  });
});
