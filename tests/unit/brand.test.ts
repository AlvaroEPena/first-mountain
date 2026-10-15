import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import {
  LETTERS,
  LOCKUP_VIEWBOX,
  RIDGE_POINTS,
  renderLockup,
  wordmark,
} from '../../src/assets/brand/geometry.mjs';
import { PALETTE } from '../../src/assets/brand/palette.mjs';

describe('brand palette', () => {
  it('matches the design tokens in tokens.css', () => {
    const css = readFileSync('src/styles/tokens.css', 'utf8').toUpperCase();
    for (const [name, hex] of Object.entries(PALETTE)) {
      expect(css, name).toContain(hex.toUpperCase());
    }
  });
});

describe('wordmark', () => {
  it('has a glyph for every letter it sets', () => {
    for (const char of 'FIRSTMOUNTAINCONSTRUCTION') expect(LETTERS).toHaveProperty(char);
  });

  it('tracks the sub-line to the width of the main line', () => {
    const mark = wordmark();
    const last = mark.sub[mark.sub.length - 1];
    expect(last).toBeDefined();
    // Last sub glyph ("N", 37 units at 0.3 scale) ends at the main line's right edge.
    expect((last?.x ?? 0) + 37 * 0.3).toBeCloseTo(mark.width, 0);
  });

  it('renders a lockup with unique clip ids per instance', () => {
    expect(renderLockup('a', 'onLight')).toContain('id="a-band"');
    expect(renderLockup('b', 'onDark')).toContain('id="b-band"');
    expect(LOCKUP_VIEWBOX).toMatch(/^0 0 [\d.]+ [\d.]+$/);
  });
});

describe('ridgeline', () => {
  it('runs left to right across the full width inside its box', () => {
    const xs = RIDGE_POINTS.map(([x]) => x);
    expect(xs[0]).toBe(0);
    expect(xs[xs.length - 1]).toBe(1000);
    xs.slice(1).forEach((x, i) => expect(x).toBeGreaterThan(xs[i] ?? -1));
    for (const [, y] of RIDGE_POINTS) {
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(120);
    }
  });
});
