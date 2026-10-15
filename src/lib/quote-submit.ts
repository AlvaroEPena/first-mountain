import {
  parseQuoteResponse,
  type QuoteField,
  type QuoteFieldErrors,
  type QuoteRequest,
} from './contracts/quote';

/** Fields the visitor can see and fix; errors for anything else cannot be acted on. */
export const VISIBLE_FIELDS = [
  'name',
  'phone',
  'email',
  'address',
  'projectType',
  'timeframe',
  'message',
] as const satisfies readonly QuoteField[];

export type SubmitOutcome =
  | { kind: 'demo' }
  | { kind: 'sent' }
  | { kind: 'rejected'; errors: QuoteFieldErrors }
  | { kind: 'failed' };

/**
 * The honeypot rule lives in the shared schema (`website` must be empty once trimmed). A
 * submission whose only use of that field is an error came from a bot.
 */
export function isBotSubmission(errors: QuoteFieldErrors): boolean {
  return Boolean(errors.website);
}

/** Keep only errors the form can show next to a field. */
export function visibleErrors(errors: QuoteFieldErrors | undefined): QuoteFieldErrors {
  const shown: QuoteFieldErrors = {};
  for (const field of VISIBLE_FIELDS) {
    const message = errors?.[field];
    if (message) shown[field] = message;
  }
  return shown;
}

/**
 * Sends a validated request to `endpoint` as JSON. With no endpoint the form runs in demo
 * mode: nothing leaves the browser and the UI says so. A malformed reply, or a rejection that
 * names no field the visitor can fix, counts as a failed send.
 */
export async function submitQuote(
  data: QuoteRequest,
  endpoint: string | undefined,
  send: typeof fetch = fetch,
): Promise<SubmitOutcome> {
  if (!endpoint) return { kind: 'demo' };
  try {
    const response = await send(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });
    const reply = parseQuoteResponse(await response.json().catch(() => null));
    if (!reply) return { kind: 'failed' };
    if (reply.ok) return response.ok ? { kind: 'sent' } : { kind: 'failed' };
    const errors = visibleErrors(reply.errors);
    return Object.keys(errors).length > 0 ? { kind: 'rejected', errors } : { kind: 'failed' };
  } catch {
    return { kind: 'failed' };
  }
}
