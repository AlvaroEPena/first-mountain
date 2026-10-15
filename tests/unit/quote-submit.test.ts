import { describe, expect, it, vi } from 'vitest';

import type { QuoteRequest } from '../../src/lib/contracts/quote';
import { isHoneypotTripped, submitQuote } from '../../src/lib/quote-submit';

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

describe('isHoneypotTripped', () => {
  it('is false for people and true when the hidden field has text', () => {
    const form = new FormData();
    form.set('website', '');
    expect(isHoneypotTripped(form)).toBe(false);
    form.set('website', 'https://spam.example');
    expect(isHoneypotTripped(form)).toBe(true);
  });

  it('is false when the field is missing', () => {
    expect(isHoneypotTripped(new FormData())).toBe(false);
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

  it('passes server field errors through', async () => {
    const send = respond(422, { ok: false, errors: { phone: 'Enter a phone number' } });
    expect(await submitQuote(request, '/api/quote', send)).toEqual({
      kind: 'rejected',
      errors: { phone: 'Enter a phone number' },
    });
  });

  it('reports a failure for server errors without a usable body', async () => {
    const send = vi.fn(
      async () => new Response('Bad gateway', { status: 502 }),
    ) as unknown as typeof fetch;
    expect(await submitQuote(request, '/api/quote', send)).toEqual({ kind: 'failed' });
  });

  it('reports a failure when the network is down', async () => {
    const send = vi.fn(async () => {
      throw new TypeError('Failed to fetch');
    }) as unknown as typeof fetch;
    expect(await submitQuote(request, '/api/quote', send)).toEqual({ kind: 'failed' });
  });
});
