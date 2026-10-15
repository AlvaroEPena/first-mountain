/**
 * Pure helpers for the review marquee. The rail holds two identical copies of the list and
 * its CSS animation moves it from 0 to -50% (one copy width, the "loop"), then repeats.
 */

/**
 * Negative animation-delay (seconds) that makes the marquee resume at `offsetPx` into the loop,
 * so pressing Play continues from where the visitor scrolled to instead of jumping back.
 */
export function offsetToDelay(offsetPx: number, loopPx: number, durationS: number): number {
  if (loopPx <= 0 || durationS <= 0) return 0;
  const wrapped = ((offsetPx % loopPx) + loopPx) % loopPx;
  const delay = -(wrapped / loopPx) * durationS;
  return delay === 0 ? 0 : delay; // avoid -0
}

/** Parse a CSS time list's first value ("90s", "1500ms") into seconds; 0 when unparsable. */
export function cssTimeToSeconds(value: string): number {
  const match = /^\s*(-?[\d.]+)(ms|s)/.exec(value);
  if (!match) return 0;
  const amount = Number(match[1]);
  return match[2] === 'ms' ? amount / 1000 : amount;
}

/**
 * Map a mouse-wheel event onto the paused scroller. Returns the new scrollLeft, or `null`
 * when the event should be left alone: horizontal gestures (trackpads scroll natively) and
 * vertical scrolling past either end, so the page keeps scrolling instead of getting stuck.
 */
export function wheelToScrollLeft(
  deltaX: number,
  deltaY: number,
  scrollLeft: number,
  maxScrollLeft: number,
): number | null {
  if (Math.abs(deltaX) >= Math.abs(deltaY) || deltaY === 0) return null;
  const atStart = scrollLeft <= 0;
  const atEnd = scrollLeft >= maxScrollLeft - 1;
  if ((deltaY < 0 && atStart) || (deltaY > 0 && atEnd)) return null;
  return Math.min(Math.max(scrollLeft + deltaY, 0), maxScrollLeft);
}
