import { describe, expect, it } from 'vitest';

import { firstName, ownerFirstName } from '../../src/lib/owner';
import { starFills } from '../../src/lib/stars';

describe('starFills', () => {
  it('shows 4.7 as four full stars and a 70% fifth', () => {
    expect(starFills(4.7)).toEqual([1, 1, 1, 1, 0.7]);
  });

  it('handles whole, empty and out-of-range ratings', () => {
    expect(starFills(5)).toEqual([1, 1, 1, 1, 1]);
    expect(starFills(4)).toEqual([1, 1, 1, 1, 0]);
    expect(starFills(0)).toEqual([0, 0, 0, 0, 0]);
    expect(starFills(7)).toEqual([1, 1, 1, 1, 1]);
    expect(starFills(-1)).toEqual([0, 0, 0, 0, 0]);
  });
});

describe('owner first name', () => {
  it('takes the first word of the full name', () => {
    expect(firstName('Frank Mounga')).toBe('Frank');
    expect(firstName('  Ana  María López ')).toBe('Ana');
    expect(ownerFirstName).toBe('Frank');
  });
});
