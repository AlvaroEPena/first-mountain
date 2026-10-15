import { expect, test } from '@playwright/test';

import { expectSeenImagesLoaded, scrollThroughPage } from '../support/scroll';

/** Layout defects that axe and overflow checks cannot see: empty cells, clipped text. */
test.describe('layout', () => {
  test('services photo mosaics fill every cell (no empty gaps)', async ({ page }) => {
    await page.goto('/services');
    await scrollThroughPage(page);
    await expectSeenImagesLoaded(page);

    const gaps = await page.locator('ul[data-photos]').evaluateAll((grids) =>
      grids.flatMap((grid) => {
        const section = grid.closest('section')?.id ?? '?';
        return Array.from(grid.children).flatMap((cell, index) => {
          const frame = cell.firstElementChild;
          if (!frame) return [`#${section} photo ${index + 1}: empty cell`];
          const cellBox = cell.getBoundingClientRect();
          const frameBox = frame.getBoundingClientRect();
          const emptyBelow = Math.round(cellBox.bottom - frameBox.bottom);
          return emptyBelow > 2
            ? [`#${section} photo ${index + 1}: ${emptyBelow}px of empty cell below the photo`]
            : [];
        });
      }),
    );
    expect(gaps).toEqual([]);
  });

  test('home service tiles never clip their text', async ({ page }) => {
    await page.goto('/');
    await scrollThroughPage(page);

    const clipped = await page.locator('.bento__cell').evaluateAll((cells) =>
      cells.flatMap((cell) => {
        const text = cell.querySelector('.bento__text');
        if (!text) return [];
        const cellBox = cell.getBoundingClientRect();
        const textBox = text.getBoundingClientRect();
        const overflow = Math.round(cellBox.top - textBox.top);
        const name = cell.querySelector('.bento__name')?.textContent?.trim();
        return overflow > 0 ? [`${name}: ${overflow}px of text cut off at the top`] : [];
      }),
    );
    expect(clipped).toEqual([]);
  });

  test('home service tiles show a photo when the service has project photos', async ({
    page,
    request,
  }) => {
    // Which services show photos is read from the services page, the photo source of truth.
    const servicesHtml = await (await request.get('/services')).text();
    await page.setContent(servicesHtml);
    const servicesWithPhotos = await page
      .locator('section[id]')
      .evaluateAll((sections) =>
        sections.filter((section) => section.querySelector('img')).map((section) => section.id),
      );

    await page.goto('/');
    const tilesWithoutPhoto = await page.locator('.bento__link').evaluateAll(
      (links, withPhotos) =>
        links
          .filter((link) => !link.querySelector('img'))
          .map((link) => new URL((link as HTMLAnchorElement).href).hash.slice(1))
          .filter((id) => withPhotos.includes(id)),
      servicesWithPhotos,
    );
    expect(tilesWithoutPhoto, 'services with real photos shown as a photo-less tile').toEqual([]);
  });
});
