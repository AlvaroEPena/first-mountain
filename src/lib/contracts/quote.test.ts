import { describe, expect, it } from 'vitest';
import {
  parseQuoteForm,
  parseQuoteResponse,
  projectTypeFromQuery,
  quoteRequestSchema,
  toFieldErrors,
} from './quote';

const valid = {
  name: 'Jane Doe',
  phone: '(801) 555-0134',
  projectType: 'driveway',
  message: 'Replace a cracked two-car driveway.',
};

describe('quoteRequestSchema', () => {
  it('accepts a minimal valid request', () => {
    expect(quoteRequestSchema.safeParse(valid).success).toBe(true);
  });

  it('accepts empty optional fields as submitted by a browser form', () => {
    const result = quoteRequestSchema.safeParse({
      ...valid,
      email: '',
      address: '',
      timeframe: '',
      website: '',
    });
    expect(result.success).toBe(true);
  });

  it('requires a phone number with 10 to 15 digits', () => {
    expect(quoteRequestSchema.safeParse({ ...valid, phone: '' }).success).toBe(false);
    expect(quoteRequestSchema.safeParse({ ...valid, phone: '((((((((((' }).success).toBe(false);
    expect(quoteRequestSchema.safeParse({ ...valid, phone: '+1 801 555 0134' }).success).toBe(true);
  });

  it('rejects an invalid email but allows none', () => {
    expect(quoteRequestSchema.safeParse({ ...valid, email: 'nope' }).success).toBe(false);
    expect(quoteRequestSchema.safeParse({ ...valid, email: 'jane@example.com' }).success).toBe(
      true,
    );
  });

  it('rejects unknown project types and timeframes', () => {
    expect(quoteRequestSchema.safeParse({ ...valid, projectType: 'pool' }).success).toBe(false);
    expect(quoteRequestSchema.safeParse({ ...valid, timeframe: 'someday' }).success).toBe(false);
  });

  it('rejects a filled honeypot', () => {
    expect(quoteRequestSchema.safeParse({ ...valid, website: 'http://spam' }).success).toBe(false);
  });

  it('reports one message per invalid field', () => {
    const result = quoteRequestSchema.safeParse({ ...valid, phone: '12', message: 'short' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(Object.keys(toFieldErrors(result.error)).sort()).toEqual(['message', 'phone']);
    }
  });
});

describe('parseQuoteForm', () => {
  it('validates FormData and trims values', () => {
    const form = new FormData();
    for (const [key, value] of Object.entries({ ...valid, name: '  Jane Doe  ' })) {
      form.set(key, value);
    }
    const result = parseQuoteForm(form);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.name).toBe('Jane Doe');
  });

  it('returns field errors for an empty form', () => {
    const result = parseQuoteForm(new FormData());
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.errors)).toContain('phone');
  });
});

describe('parseQuoteResponse', () => {
  it('accepts success and rejections with or without field errors', () => {
    expect(parseQuoteResponse({ ok: true })).toEqual({ ok: true });
    expect(parseQuoteResponse({ ok: false })).toEqual({ ok: false });
    expect(parseQuoteResponse({ ok: false, errors: { phone: 'Bad phone' } })).toEqual({
      ok: false,
      errors: { phone: 'Bad phone' },
    });
  });

  it('rejects malformed replies and unknown error keys', () => {
    expect(parseQuoteResponse(null)).toBeUndefined();
    expect(parseQuoteResponse({ status: 'ok' })).toBeUndefined();
    expect(parseQuoteResponse({ ok: false, errors: { form: 'Rate limited' } })).toBeUndefined();
  });
});

describe('honeypot', () => {
  it('treats whitespace as empty and anything else as a bot', () => {
    expect(quoteRequestSchema.safeParse({ ...valid, website: '   ' }).success).toBe(true);
    expect(quoteRequestSchema.safeParse({ ...valid, website: 'x' }).success).toBe(false);
  });
});

describe('projectTypeFromQuery', () => {
  it('returns known types and ignores anything else', () => {
    expect(projectTypeFromQuery('sport-court')).toBe('sport-court');
    expect(projectTypeFromQuery('pool')).toBeUndefined();
    expect(projectTypeFromQuery(null)).toBeUndefined();
  });
});
