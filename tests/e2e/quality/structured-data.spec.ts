import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { expect, test, type Page } from '@playwright/test';

import { BUSINESS, PAGES } from '../support/site';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

async function jsonLdBlocks(page: Page): Promise<JsonValue[]> {
  const texts = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) => scripts.map((script) => script.textContent ?? ''));
  return texts.map((text) => JSON.parse(text) as JsonValue);
}

/** Every object anywhere in the JSON-LD graph. */
function allNodes(value: JsonValue): Record<string, JsonValue>[] {
  if (Array.isArray(value)) return value.flatMap(allNodes);
  if (value && typeof value === 'object') {
    return [value, ...Object.values(value).flatMap(allNodes)];
  }
  return [];
}

const typesOf = (node: Record<string, JsonValue>): string[] => {
  const type = node['@type'];
  return (Array.isArray(type) ? type : [type]).filter((t): t is string => typeof t === 'string');
};

test.describe('structured data and indexing', () => {
  for (const sitePage of PAGES) {
    test(`${sitePage.name}: no rating or review markup, preview is noindex`, async ({ page }) => {
      await page.goto(sitePage.path);
      const nodes = (await jsonLdBlocks(page)).flatMap(allNodes);
      expect(nodes.length).toBeGreaterThan(0);

      const forbidden = nodes.filter(
        (node) =>
          typesOf(node).some((type) => /^(AggregateRating|Review|Rating)$/.test(type)) ||
          'aggregateRating' in node ||
          'review' in node ||
          'reviews' in node,
      );
      expect(forbidden, 'AggregateRating/Review JSON-LD (spec §10)').toEqual([]);

      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    });
  }

  test('home: HomeAndConstructionBusiness with the correct phone and address', async ({ page }) => {
    await page.goto('/');
    const nodes = (await jsonLdBlocks(page)).flatMap(allNodes);
    const business = nodes.find((node) => typesOf(node).includes('HomeAndConstructionBusiness'));

    expect(business, 'HomeAndConstructionBusiness entity').toBeDefined();
    expect(business?.name).toBe(BUSINESS.name);
    expect(business?.telephone).toBe(BUSINESS.telephone);
    expect(business?.address).toMatchObject({ '@type': 'PostalAddress', ...BUSINESS.address });
    expect(business?.sameAs).toContain(BUSINESS.googleListingUrl);
  });

  test('preview deploy headers carry X-Robots-Tag noindex', async () => {
    // `astro preview` does not apply public/_headers, so the deploy config is checked directly.
    const headers = await readFile(path.resolve('public/_headers'), 'utf8');
    const globalBlock = headers
      .split(/\r?\n(?=\S)/)
      .find((block) => block.split(/\r?\n/)[0]?.trim() === '/*');
    expect(globalBlock).toMatch(/X-Robots-Tag:\s*noindex/);
  });
});
