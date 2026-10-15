import { expect, test, type Page } from '@playwright/test';

// J3. A visitor opens /projects, filters to "Driveways", sees only driveway items with a live count
// update, opens one in the lightbox, moves with the arrow keys and closes with Esc. Focus returns to
// the thumbnail.

const filterGroup = (page: Page) =>
  page.getByRole('group', { name: 'Filter photos by type of work' });

/** Count shown on a filter chip, e.g. "Driveways 13 photos" gives 13. */
async function chipCount(page: Page, label: string): Promise<number> {
  const button = filterGroup(page).getByRole('button', { name: new RegExp(`^${label}\\b`) });
  const name = (await button.textContent()) ?? '';
  const match = name.match(/(\d+)/);
  if (!match?.[1]) throw new Error(`No count on the ${label} chip: "${name}"`);
  return Number(match[1]);
}

test.describe('J3 projects gallery', () => {
  test('filter to Driveways, browse the lightbox with keys, focus returns', async ({ page }) => {
    await page.goto('/projects');
    const grid = page.locator('[data-gallery-grid]');
    const status = page.getByRole('status').filter({ hasText: /Showing/ });

    const total = await chipCount(page, 'All');
    await expect(grid.getByRole('listitem')).toHaveCount(total);
    await expect(status).toHaveText(`Showing all ${total} photos`);

    const driveways = filterGroup(page).getByRole('button', { name: /^Driveways\b/ });
    const expected = await chipCount(page, 'Driveways');
    await driveways.click();

    await expect(driveways).toHaveAttribute('aria-pressed', 'true');
    await expect(filterGroup(page).getByRole('button', { name: /^All\b/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    await expect(status).toHaveText(`Showing ${expected} photos in Driveways`);
    const visibleItems = grid.locator('li:not([hidden])');
    await expect(visibleItems).toHaveCount(expected);
    const categories = await visibleItems.evaluateAll((items) =>
      items.map((item) => item.getAttribute('data-category')),
    );
    expect(new Set(categories)).toEqual(new Set(['driveways']));
    await expect(page).toHaveURL(/#driveways$/);

    const firstThumb = visibleItems.first().getByRole('link');
    await firstThumb.click();
    const lightbox = page.getByRole('dialog');
    const counter = lightbox.locator('.pswp__counter');
    await expect(lightbox).toBeVisible();
    // Focus moves into the dialog once the opening animation ends; keys work from then on.
    await expect(lightbox).toBeFocused();
    // Only the filtered photos are in the lightbox.
    await expect(counter).toHaveText(`1 / ${expected}`);

    await page.keyboard.press('ArrowRight');
    await expect(counter).toHaveText(`2 / ${expected}`);
    await page.keyboard.press('ArrowLeft');
    await expect(counter).toHaveText(`1 / ${expected}`);

    await page.keyboard.press('Escape');
    await expect(lightbox).toBeHidden();
    await expect(firstThumb).toBeFocused();
  });

  test('a filter in the URL hash is applied on load', async ({ page }) => {
    await page.goto('/projects#steps');
    const steps = filterGroup(page).getByRole('button', { name: /^Steps & Walkways\b/ });
    await expect(steps).toHaveAttribute('aria-pressed', 'true');
    const expected = await chipCount(page, 'Steps & Walkways');
    await expect(page.locator('[data-gallery-grid] li:not([hidden])')).toHaveCount(expected);
  });

  test('an unknown hash falls back to all photos', async ({ page }) => {
    await page.goto('/projects#not-a-category');
    await expect(filterGroup(page).getByRole('button', { name: /^All\b/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(page.locator('[data-gallery-grid] li[hidden]')).toHaveCount(0);
  });
});
