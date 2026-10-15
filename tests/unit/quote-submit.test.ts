import { describe, expect, it, vi } from 'vitest';

import { parseQuoteForm, type QuoteRequest } from '../../src/lib/contracts/quote';
import { isBotSubmission, submitQuote, visibleErrors } from '../../src/lib/quote-submit';

const request: QuoteRequest = {
  name: 'Dana Whitlock',
  phone: '801-555-0142',
  email: '',
  address: 'Sugar House',
  projectType: 'driveway',
  timeframe: 'flexible',
  message: 'Replace a cracked two-car driveway.',
  website: '',
};

const respond = (status: number, body: unknown) =>
  vi.fn(async () => new Response(JSON.stringify(body), { status })) as unknown as typeof fetch;

const formWith = (website: string) => {
  const form = new FormData();
  for (const [key, value] of Object.entries({ ...request, website })) form.set(key, value);
  return form;
};

describe('honeypot (schema rule only)', () => {
  it('treats a filled hidden field as a bot', () => {
    const parsed = parseQuoteForm(formWith('https://spam.example'));
    expect(parsed.ok).toBe(false);
    expect(!parsed.ok && isBotSubmission(parsed.errors)).toBe(true);
  });

  it('counts whitespace as empty, so people are never flagged', () => {
    expect(parseQuoteForm(formWith('   ')).ok).toBe(true);
    expect(isBotSubmission({ name: 'Please enter your name' })).toBe(false);
  });
});

describe('visibleErrors', () => {
  it('keeps only fields the form shows', () => {
    expect(visibleErrors({ phone: 'Bad phone', website: 'Must be empty' })).toEqual({
      phone: 'Bad phone',
    });
    expect(visibleErrors(undefined)).toEqual({});
  });
});

describe('submitQuote', () => {
  it('runs in demo mode without an endpoint and sends nothing', async () => {
    const send = vi.fn() as unknown as typeof fetch;
    expect(await submitQuote(request, undefined, send)).toEqual({ kind: 'demo' });
    expect(send).not.toHaveBeenCalled();
  });

  it('posts JSON to the endpoint', async () => {
    const send = respond(200, { ok: true });
    expect(await submitQuote(request, 'https://example.test/quote', send)).toEqual({
      kind: 'sent',
    });
    expect(send).toHaveBeenCalledWith(
      'https://example.test/quote',
      expect.objectContaining({ method: 'POST', body: JSON.stringify(request) }),
    );
  });

  it('passes server errors for visible fields through', async () => {
    const send = respond(422, { ok: false, errors: { phone: 'Enter a phone number' } });
    expect(await submitQuote(request, '/api/quote', send)).toEqual({
      kind: 'rejected',
      errors: { phone: 'Enter a phone number' },
    });
  });

  it('fails when a rejection names no field (rate limit, bot check)', async () => {
    expect(await submitQuote(request, '/api/quote', respond(429, { ok: false }))).toEqual({
      kind: 'failed',
    });
  });

  it('fails when a rejection only names fields the visitor cannot see', async () => {
    const send = respond(422, { ok: false, errors: { website: 'Must be empty' } });
    expect(await submitQuote(request, '/api/quote', send)).toEqual({ kind: 'failed' });
  });

  it('fails on a malformed reply, even with a 200', async () => {
    expect(await submitQuote(request, '/api/quote', respond(200, { done: true }))).toEqual({
      kind: 'failed',
    });
    const notJson = vi.fn(
      async () => new Response('OK', { status: 200 }),
    ) as unknown as typeof fetch;
    expect(await submitQuote(request, '/api/quote', notJson)).toEqual({ kind: 'failed' });
  });

  it('fails when the network is down', async () => {
    const send = vi.fn(async () => {
      throw new TypeError('Failed to fetch');
    }) as unknown as typeof fetch;
    expect(await submitQuote(request, '/api/quote', send)).toEqual({ kind: 'failed' });
  });
});
