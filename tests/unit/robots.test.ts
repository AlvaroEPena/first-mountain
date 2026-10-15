import { describe, expect, it } from 'vitest';

import { robotsTxt } from '../../src/lib/robots';

describe('robotsTxt', () => {
  it('allows crawling and points to the sitemap on the configured site', () => {
    expect(robotsTxt('https://first-mountain.example')).toBe(
      'User-agent: *\nAllow: /\n\nSitemap: https://first-mountain.example/sitemap-index.xml\n',
    );
  });

  it('never disallows anything (noindex does the hiding on the preview)', () => {
    expect(robotsTxt(new URL('https://example.test/'))).not.toMatch(/Disallow/i);
  });
});
