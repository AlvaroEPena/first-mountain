import { describe, expect, it } from 'vitest';
import { cssTimeToSeconds, offsetToDelay, wheelToScrollLeft } from '../../src/lib/marquee';

describe('offsetToDelay', () => {
  it('maps an offset within the loop to a proportional negative delay', () => {
    expect(offsetToDelay(0, 1000, 90)).toBe(0);
    expect(offsetToDelay(250, 1000, 90)).toBeCloseTo(-22.5);
    expect(offsetToDelay(500, 1000, 90)).toBeCloseTo(-45);
  });

  it('wraps offsets past the loop (the second copy) and negative offsets', () => {
    expect(offsetToDelay(1250, 1000, 90)).toBeCloseTo(-22.5);
    expect(offsetToDelay(-250, 1000, 90)).toBeCloseTo(-67.5);
  });

  it('returns 0 for degenerate sizes', () => {
    expect(offsetToDelay(100, 0, 90)).toBe(0);
    expect(offsetToDelay(100, 1000, 0)).toBe(0);
  });
});

describe('cssTimeToSeconds', () => {
  it('parses seconds and milliseconds', () => {
    expect(cssTimeToSeconds('90s')).toBe(90);
    expect(cssTimeToSeconds('1500ms')).toBe(1.5);
    expect(cssTimeToSeconds('90s, 2s')).toBe(90);
    expect(cssTimeToSeconds('')).toBe(0);
  });
});

describe('wheelToScrollLeft', () => {
  it('turns vertical wheel movement into sideways scrolling', () => {
    expect(wheelToScrollLeft(0, 100, 200, 1000)).toBe(300);
    expect(wheelToScrollLeft(0, -100, 200, 1000)).toBe(100);
  });

  it('clamps to the scroll range', () => {
    expect(wheelToScrollLeft(0, 300, 900, 1000)).toBe(1000);
    expect(wheelToScrollLeft(0, -300, 100, 1000)).toBe(0);
  });

  it('lets the page scroll at either end and ignores horizontal gestures', () => {
    expect(wheelToScrollLeft(0, -100, 0, 1000)).toBeNull();
    expect(wheelToScrollLeft(0, 100, 1000, 1000)).toBeNull();
    expect(wheelToScrollLeft(80, 10, 200, 1000)).toBeNull();
    expect(wheelToScrollLeft(0, 0, 200, 1000)).toBeNull();
  });
});
