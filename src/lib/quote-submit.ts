import type { QuoteFieldErrors, QuoteRequest, QuoteResponse } from './contracts/quote';

export type SubmitOutcome =
  | { kind: 'demo' }
  | { kind: 'sent' }
  | { kind: 'rejected'; errors: QuoteFieldErrors }
  | { kind: 'failed' };

/** Bots fill the hidden "website" field; real visitors never see it. */
export function isHoneypotTripped(form: FormData): boolean {
  const value = form.get('website');
  return typeof value === 'string' && value.trim() !== '';
}

function isQuoteResponse(body: unknown): body is QuoteResponse {
  return typeof body === 'object' && body !== null && 'ok' in body;
}

/**
 * Sends a validated request to `endpoint` as JSON. With no endpoint the form runs in demo
 * mode: nothing leaves the browser and the UI says so.
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
    const body: unknown = await response.json().catch(() => null);
    if (isQuoteResponse(body)) {
      if (!body.ok) return { kind: 'rejected', errors: body.errors };
      if (response.ok) return { kind: 'sent' };
    }
    return response.ok ? { kind: 'sent' } : { kind: 'failed' };
  } catch {
    return { kind: 'failed' };
  }
}
