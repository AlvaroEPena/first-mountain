import AxeBuilder from '@axe-core/playwright';
import type { Result } from 'axe-core';
import { expect, type Page, type TestInfo } from '@playwright/test';

/** WCAG 2.2 AA, including the A and AA rules inherited from 2.0 and 2.1. */
const WCAG_22_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const BLOCKING_IMPACTS = new Set(['serious', 'critical']);

/**
 * Runs axe on the current page state. Serious and critical violations fail the test; minor and
 * moderate ones are logged and attached so they still reach the report.
 */
export async function expectNoSeriousA11yViolations(
  page: Page,
  testInfo: TestInfo,
  label: string,
): Promise<void> {
  const results = await new AxeBuilder({ page }).withTags(WCAG_22_AA).analyze();
  await testInfo.attach(`axe-${label}.json`, {
    body: JSON.stringify(results.violations, null, 2),
    contentType: 'application/json',
  });

  const summarize = (violation: Result) =>
    `${violation.id} [${violation.impact}] x${violation.nodes.length}: ${violation.nodes
      .slice(0, 3)
      .map((node) => node.target.join(' '))
      .join(' | ')}`;
  const all = results.violations.map(summarize);
  const blocking = results.violations
    .filter((violation) => BLOCKING_IMPACTS.has(violation.impact ?? ''))
    .map(summarize);
  console.log(
    [
      `[axe] ${testInfo.project.name} ${label}: ${all.length} violations (${blocking.length} serious/critical)`,
      ...all.map((line) => `  ${line}`),
    ].join('\n'),
  );
  expect(blocking, `serious/critical axe violations on ${label}`).toEqual([]);
}
