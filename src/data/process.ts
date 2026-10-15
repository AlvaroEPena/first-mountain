/**
 * "How a job goes": four steps, each backed by a customer's own words. `quote` must be a verbatim
 * substring of the review text (a unit test enforces it). No invented promises: timelines are
 * attributed to the customer who reported them.
 */
export interface ProcessStep {
  id: string;
  title: string;
  body: string;
  reviewId: string;
  quote: string;
  /** Gallery id shown beside the step on wide screens. */
  photo: string;
}

export const processSteps: readonly ProcessStep[] = [
  {
    id: 'reach-out',
    title: 'Call or text Frank',
    body: 'Tell us what you want poured and where. You talk to Frank, and he answers your questions straight.',
    reviewId: 'r26',
    quote: 'Extremely prompt, communicative, and excellent job.',
    photo: 'photo-15',
  },
  {
    id: 'site-bid',
    title: 'A free bid, on site',
    body: 'Frank comes out, measures and looks at the ground before he prices it. The bid says what is included and what would cost more.',
    reviewId: 'r07',
    quote:
      'He was the only concrete company that was willing to come in person and review the job site in person.',
    photo: 'photo-05',
  },
  {
    id: 'prep-pour',
    title: 'Prep, form and pour',
    body: 'Tear-out, grading and base, forms and rebar, then the pour and the finish. Several customers say their pad or RV pad was done in one or two days.',
    reviewId: 'r14',
    quote: 'They came, they tore apart, they formed the area, then poured the concrete!',
    photo: 'photo-13',
  },
  {
    id: 'walkthrough',
    title: 'Cleanup and walkthrough',
    body: 'Forms come out, debris leaves with us, and Frank comes back to check the finished work.',
    reviewId: 'r09',
    quote:
      'He came back a few days after it had set up and made sure no debris was left on my property.',
    photo: 'photo-28',
  },
];
