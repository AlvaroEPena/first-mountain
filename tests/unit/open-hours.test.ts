import { describe, expect, it } from 'vitest';

import { site } from '../../src/data/site';
import {
  formatTime,
  getOpenStatus,
  hoursFor,
  statusMessage,
  zonedClock,
  type HoursRule,
} from '../../src/lib/open-hours';

const DENVER = 'America/Denver';
const WEEKDAYS: HoursRule[] = [{ days: [1, 2, 3, 4, 5], opens: '07:00', closes: '19:00' }];

/** Instants are given in UTC; Denver is UTC-6 in summer (MDT) and UTC-7 in winter (MST). */
const at = (iso: string) => new Date(iso);

describe('zonedClock', () => {
  it('reads weekday and time in the business zone, not the runtime zone', () => {
    // Wed 14 Oct 2026, 16:30 UTC = 10:30 MDT.
    expect(zonedClock(at('2026-10-14T16:30:00Z'), DENVER)).toEqual({ weekday: 3, minutes: 630 });
    // Tue 13 Oct 2026, 03:00 UTC = Mon 12 Oct 21:00 MDT.
    expect(zonedClock(at('2026-10-13T03:00:00Z'), DENVER)).toEqual({ weekday: 1, minutes: 1260 });
  });

  it('follows the switch to standard time', () => {
    // Mon 7 Dec 2026, 14:00 UTC = 07:00 MST.
    expect(zonedClock(at('2026-12-07T14:00:00Z'), DENVER)).toEqual({ weekday: 1, minutes: 420 });
  });
});

describe('getOpenStatus', () => {
  it('is open during weekday hours and reports the closing time', () => {
    const status = getOpenStatus(at('2026-10-14T16:30:00Z'), WEEKDAYS, DENVER);
    expect(status).toEqual({
      isOpen: true,
      weekday: 3,
      next: { weekday: 3, time: '19:00', daysAhead: 0 },
    });
    expect(statusMessage(status)).toBe('Open now, until 7 pm');
  });

  it('opens exactly at opening time and closes exactly at closing time', () => {
    expect(getOpenStatus(at('2026-10-14T13:00:00Z'), WEEKDAYS, DENVER).isOpen).toBe(true);
    expect(getOpenStatus(at('2026-10-15T01:00:00Z'), WEEKDAYS, DENVER).isOpen).toBe(false);
  });

  it('before opening on a weekday, points to later today', () => {
    // Wed 06:00 MDT.
    const status = getOpenStatus(at('2026-10-14T12:00:00Z'), WEEKDAYS, DENVER);
    expect(status.isOpen).toBe(false);
    expect(statusMessage(status)).toBe('Closed, opens today at 7 am');
  });

  it('after Friday closing, points to Monday', () => {
    // Fri 16 Oct 2026, 20:00 MDT.
    const status = getOpenStatus(at('2026-10-17T02:00:00Z'), WEEKDAYS, DENVER);
    expect(status).toEqual({
      isOpen: false,
      weekday: 5,
      next: { weekday: 1, time: '07:00', daysAhead: 3 },
    });
    expect(statusMessage(status)).toBe('Closed, opens Monday at 7 am');
  });

  it('is closed all weekend', () => {
    // Sun 18 Oct 2026, 12:00 MDT.
    const status = getOpenStatus(at('2026-10-18T18:00:00Z'), WEEKDAYS, DENVER);
    expect(status.isOpen).toBe(false);
    expect(status.next?.weekday).toBe(1);
  });

  it('says tomorrow for the next day', () => {
    // Thu 15 Oct 2026, 20:00 MDT: weekday hours open again Friday morning.
    const status = getOpenStatus(at('2026-10-16T02:00:00Z'), WEEKDAYS, DENVER);
    expect(statusMessage(status)).toBe('Closed, opens tomorrow at 7 am');
  });

  it('with single-day hours, a week ahead is the weekday name, never "today"', () => {
    const mondaysOnly: HoursRule[] = [{ days: [1], opens: '08:00', closes: '12:00' }];
    // Mon 12 Oct 2026, 13:00 MDT: closed for the day; next opening is next Monday.
    const status = getOpenStatus(at('2026-10-12T19:00:00Z'), mondaysOnly, DENVER);
    expect(status.next).toEqual({ weekday: 1, time: '08:00', daysAhead: 7 });
    expect(statusMessage(status)).toBe('Closed, opens Monday at 8 am');
    // Sun 11 Oct 2026, 13:00 MDT: Monday is tomorrow.
    const sunday = getOpenStatus(at('2026-10-11T19:00:00Z'), mondaysOnly, DENVER);
    expect(statusMessage(sunday)).toBe('Closed, opens tomorrow at 8 am');
  });

  it('handles a week with no hours at all', () => {
    expect(statusMessage(getOpenStatus(at('2026-10-14T16:30:00Z'), [], DENVER))).toBe('Closed');
  });

  it('works with the real hours from site.ts', () => {
    expect(getOpenStatus(at('2026-10-14T16:30:00Z'), site.hours, site.timeZone).isOpen).toBe(true);
  });
});

describe('helpers', () => {
  it('formats times in plain 12-hour style', () => {
    expect(formatTime('07:00')).toBe('7 am');
    expect(formatTime('19:00')).toBe('7 pm');
    expect(formatTime('12:00')).toBe('12 pm');
    expect(formatTime('00:30')).toBe('12:30 am');
  });

  it('finds the rule for a weekday', () => {
    expect(hoursFor(2, WEEKDAYS)?.opens).toBe('07:00');
    expect(hoursFor(6, WEEKDAYS)).toBeUndefined();
  });
});
