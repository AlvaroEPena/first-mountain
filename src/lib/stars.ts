/** Fill fraction (0 to 1) for each of `count` stars: 4.7 gives [1, 1, 1, 1, 0.7]. */
export function starFills(rating: number, count = 5): number[] {
  const clamped = Math.min(Math.max(rating, 0), count);
  return Array.from(
    { length: count },
    (_, index) => Math.round(Math.min(Math.max(clamped - index, 0), 1) * 100) / 100,
  );
}
