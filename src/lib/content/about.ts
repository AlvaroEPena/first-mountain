/**
 * About-page content. Each value is backed by a customer quote (verbatim substring of the review,
 * checked by a unit test) so nothing here is a claim the business has not earned in public.
 */
export interface Value {
  title: string;
  body: string;
  reviewId: string;
  quote: string;
}

export const values: readonly Value[] = [
  {
    title: 'Shows up when he says',
    body: 'On time for the bid, on time for the pour. Customers mention it more than anything else.',
    reviewId: 'r11',
    quote: 'Frank showed up when he said he would to measure and provide a quote.',
  },
  {
    title: 'Sticks to the quote',
    body: 'The price you agree on is the price you pay, with what is and is not included spelled out.',
    reviewId: 'r09',
    quote:
      'He stuck to his quote and didn’t try raising the price with hidden fees or incremental labor',
  },
  {
    title: 'Does it right',
    body: 'Base, forms, rebar and finish get the time they need, even when the job is quick.',
    reviewId: 'r05',
    quote: 'They took the extra time needed to do the work and do it right.',
  },
  {
    title: 'Leaves it clean',
    body: 'Old concrete, forms and leftover material leave with the crew.',
    reviewId: 'r14',
    quote: 'And made sure there was no mess left behind!',
  },
  {
    title: 'Goes the extra mile',
    body: 'A rock border from leftover material, a bit of landscaping to tie it in. The small things.',
    reviewId: 'r23',
    quote:
      'He surprised me by taking some extra material and putting a rock border around my garden.',
  },
];

/** The contractor-partner quote that closes the page. */
export const partnerReviewId = 'r04';

/** Crew-at-work photos for the about page (gallery ids). */
export const crewPhotos = ['photo-04', 'photo-14', 'photo-01'] as const;
