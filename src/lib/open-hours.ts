/**
 * "Open now" logic for the HoursTable. Pure: it takes the instant, the weekly hours and the
 * business time zone, so it gives the same answer wherever the visitor is.
 */
export interface HoursRule {
  /** ISO weekdays, 1 = Monday ... 7 = Sunday. */
  days: readonly number[];
  /** "HH:MM", 24-hour, in the business time zone. */
  opens: string;
  closes: string;
}

export interface OpenStatus {
  isOpen: boolean;
  /** ISO weekday of `now` in the business time zone. */
  weekday: number;
  /** Closing time today when open, otherwise the next opening (`daysAhead` 0 = today). */
  next?: { weekday: number; time: string; daysAhead: number };
}

const SHORT_WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export const WEEKDAY_NAMES = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

function toMinutes(time: string): number {
  const [hours = 0, minutes = 0] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/** ISO weekday and minutes since midnight of `now`, as seen in `timeZone`. */
export function zonedClock(now: Date, timeZone: string): { weekday: number; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((entry) => entry.type === type)?.value ?? '';
  const weekday = SHORT_WEEKDAYS.findIndex((day) => day === part('weekday')) + 1;
  return { weekday, minutes: Number(part('hour')) * 60 + Number(part('minute')) };
}

export function hoursFor(weekday: number, rules: readonly HoursRule[]): HoursRule | undefined {
  return rules.find((rule) => rule.days.includes(weekday));
}

export function getOpenStatus(
  now: Date,
  rules: readonly HoursRule[],
  timeZone: string,
): OpenStatus {
  const { weekday, minutes } = zonedClock(now, timeZone);
  const today = hoursFor(weekday, rules);
  if (today && minutes >= toMinutes(today.opens) && minutes < toMinutes(today.closes)) {
    return { isOpen: true, weekday, next: { weekday, time: today.closes, daysAhead: 0 } };
  }
  // Closed: find the next opening, starting later today if it is still before opening time.
  for (let offset = 0; offset < 8; offset += 1) {
    const day = ((weekday - 1 + offset) % 7) + 1;
    const rule = hoursFor(day, rules);
    if (!rule) continue;
    if (offset === 0 && minutes >= toMinutes(rule.opens)) continue;
    return { isOpen: false, weekday, next: { weekday: day, time: rule.opens, daysAhead: offset } };
  }
  return { isOpen: false, weekday };
}

/** "07:00" to "7 am", "19:30" to "7:30 pm". */
export function formatTime(time: string): string {
  const total = toMinutes(time);
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  const suffix = hours >= 12 ? 'pm' : 'am';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return minutes === 0
    ? `${hour12} ${suffix}`
    : `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

/** Visible status line: "Open now, until 7 pm" or "Closed, opens Monday at 7 am". */
export function statusMessage(status: OpenStatus): string {
  if (!status.next) return status.isOpen ? 'Open now' : 'Closed';
  const time = formatTime(status.next.time);
  if (status.isOpen) return `Open now, until ${time}`;
  return `Closed, opens ${dayLabel(status.next)} at ${time}`;
}

/**
 * Counted from days ahead, not by comparing weekdays: with single-day hours the next opening
 * can be the same weekday a week later, which must not read as "today".
 */
function dayLabel(next: { weekday: number; daysAhead: number }): string {
  if (next.daysAhead === 0) return 'today';
  if (next.daysAhead === 1) return 'tomorrow';
  return WEEKDAY_NAMES[next.weekday - 1] ?? '';
}
