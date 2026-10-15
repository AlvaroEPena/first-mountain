/**
 * Questions answered on /services. Answers stick to what the business states (free estimates,
 * hours) or what customers report, attributed as such. No prices, warranties or licences.
 */
export interface Faq {
  question: string;
  answer: string;
}

export const faqs: readonly Faq[] = [
  {
    question: 'Are estimates really free?',
    answer:
      'Yes. Frank usually comes out to look at the site, measure and talk it through before giving you a bid.',
  },
  {
    question: 'Do you tear out the old concrete?',
    answer:
      'Yes. Many jobs start with tearing out old steps, patios or driveways, then grading and prepping the base before anything new is poured.',
  },
  {
    question: 'How long does a job take?',
    answer:
      'It depends on the size and the site. Customers report single pads done in one day, an RV pad in two days and larger driveway work in about four. Frank tells you the time frame up front.',
  },
  {
    question: 'Will my yard be left a mess?',
    answer:
      'No. Cleanup is part of the job, and customers often mention that nothing was left behind.',
  },
  {
    question: 'Can you work around my schedule?',
    answer:
      'Tell Frank what works for you when you call or text. Customers mention him working around their schedule and keeping them in the loop.',
  },
];
