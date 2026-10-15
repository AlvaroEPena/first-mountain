import { expect, test } from '@playwright/test';

// J4. A visitor opens /services, jumps to "Sport Courts" from the in-page nav, then follows that
// section's CTA to /contact#quote with the project type preselected (?type=sport-court).
test.describe('J4 services to quote', () => {
  test('jump to Sport courts and request a quote with the type preselected', async ({ page }) => {
    await page.goto('/services');
    const serviceNav = page.getByRole('navigation', { name: 'Services on this page' });

    await serviceNav.getByRole('link', { name: 'Sport courts' }).click();
    await expect(page).toHaveURL(/\/services#sport-courts$/);

    const section = page.getByRole('region', { name: 'Sport courts' });
    const heading = section.getByRole('heading', { level: 2, name: 'Sport courts' });
    await expect(heading).toBeInViewport();
    // The heading must land below the fixed header and the sticky service nav, not under them.
    const navBottom = await serviceNav.evaluate(
      (element) => element.getBoundingClientRect().bottom,
    );
    await expect
      .poll(() => heading.evaluate((element) => element.getBoundingClientRect().top))
      .toBeGreaterThanOrEqual(navBottom - 1);

    await section.getByRole('link', { name: /Get a free estimate for sport courts/i }).click();
    await expect(page).toHaveURL(/\/contact\?type=sport-court#quote$/);
    await expect(page.getByLabel(/Type of project/)).toHaveValue('sport-court');
  });

  test('an invalid ?type= is ignored', async ({ page }) => {
    await page.goto('/contact?type=swimming-pool#quote');
    await expect(page.getByLabel(/Type of project/)).toHaveValue('');
  });

  test('every service CTA preselects its own project type', async ({ page }) => {
    await page.goto('/services');
    const ctas = page.getByRole('link', { name: /^Get a free estimate for / });
    const hrefs = await ctas.evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(hrefs).toEqual([
      '/contact?type=driveway#quote',
      '/contact?type=patio-pad#quote',
      '/contact?type=sport-court#quote',
      '/contact?type=steps-walkway#quote',
      '/contact?type=rv-pad#quote',
      '/contact?type=retaining-wall#quote',
      '/contact?type=hardscape#quote',
      '/contact?type=fence#quote',
    ]);
  });
});
