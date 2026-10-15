import { z } from 'zod';

export const PROJECT_TYPES = [
  'driveway',
  'patio-pad',
  'sport-court',
  'steps-walkway',
  'rv-pad',
  'retaining-wall',
  'hardscape',
  'fence',
  'other',
] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  driveway: 'Driveway',
  'patio-pad': 'Patio or backyard pad',
  'sport-court': 'Sport court (pickleball, basketball)',
  'steps-walkway': 'Steps, porch or walkway',
  'rv-pad': 'RV or trailer pad',
  'retaining-wall': 'Retaining wall',
  hardscape: 'Pavers, edging or other hardscape',
  fence: 'Fence',
  other: 'Something else',
};

export const TIMEFRAMES = ['asap', '1-3-months', '3-plus-months', 'flexible'] as const;
export type Timeframe = (typeof TIMEFRAMES)[number];

export const TIMEFRAME_LABELS: Record<Timeframe, string> = {
  asap: 'As soon as possible',
  '1-3-months': 'In the next 1 to 3 months',
  '3-plus-months': 'More than 3 months out',
  flexible: "I'm flexible",
};

const PHONE_DIGITS = /^\d{10,15}$/;

/** Shared by the browser form and (later) the Worker that delivers the request. */
export const quoteRequestSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(80, 'Keep it under 80 characters'),
  phone: z
    .string()
    .trim()
    .refine((value) => PHONE_DIGITS.test(value.replace(/\D/g, '')), {
      message: 'Enter a phone number we can call or text',
    }),
  email: z.union([z.literal(''), z.email('Enter a valid email address')]).optional(),
  address: z.string().trim().max(160, 'Keep it under 160 characters').optional(),
  projectType: z.enum(PROJECT_TYPES, 'Choose a project type'),
  timeframe: z.union([z.literal(''), z.enum(TIMEFRAMES)]).optional(),
  message: z
    .string()
    .trim()
    .min(10, 'Tell us a little about the project (10+ characters)')
    .max(2000, 'Keep it under 2000 characters'),
  /** Honeypot: real visitors never fill this. Whitespace counts as empty (the only rule). */
  hp_check: z.string().trim().max(0).optional(),
});

export type QuoteRequest = z.infer<typeof quoteRequestSchema>;
export type QuoteField = keyof QuoteRequest;
export type QuoteFieldErrors = Partial<Record<QuoteField, string>>;

const fieldErrorsSchema = z.partialRecord(
  z.enum(Object.keys(quoteRequestSchema.shape) as [QuoteField, ...QuoteField[]]),
  z.string(),
);

/**
 * What the endpoint must reply. `errors` is optional on rejection: a rate limit or bot check
 * may reject without naming a field, and the form then shows a general failure.
 */
export const quoteResponseSchema = z.discriminatedUnion('ok', [
  z.object({ ok: z.literal(true) }),
  z.object({ ok: z.literal(false), errors: fieldErrorsSchema.optional() }),
]);
export type QuoteResponse = z.infer<typeof quoteResponseSchema>;

/** Validate an endpoint reply; anything malformed is `undefined` (treat as a failed send). */
export function parseQuoteResponse(body: unknown): QuoteResponse | undefined {
  const result = quoteResponseSchema.safeParse(body);
  return result.success ? result.data : undefined;
}

/** Flatten Zod issues into one message per field (first issue wins). */
export function toFieldErrors(error: z.ZodError): QuoteFieldErrors {
  const errors: QuoteFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as QuoteField | undefined;
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}

/** Read a submitted form into a plain object and validate it. */
export function parseQuoteForm(
  form: FormData,
): { ok: true; data: QuoteRequest } | { ok: false; errors: QuoteFieldErrors } {
  const raw: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    if (typeof value === 'string') raw[key] = value;
  }
  const result = quoteRequestSchema.safeParse(raw);
  return result.success
    ? { ok: true, data: result.data }
    : { ok: false, errors: toFieldErrors(result.error) };
}

/** `/contact?type=<projectType>` preselects the project type; anything else is ignored. */
export function projectTypeFromQuery(value: string | null | undefined): ProjectType | undefined {
  return PROJECT_TYPES.find((type) => type === value);
}
