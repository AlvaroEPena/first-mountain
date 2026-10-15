/** "2026-10-14" to "Oct 2026" (in UTC, so the label never shifts with the visitor's zone). */
export function monthYear(isoDate: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

/** "4.7 from 30 Google reviews, as of Oct 2026". */
export function ratingSentence(rating: {
  value: number;
  count: number;
  capturedOn: string;
}): string {
  return `${rating.value.toFixed(1)} from ${rating.count} Google reviews, as of ${monthYear(rating.capturedOn)}`;
}
