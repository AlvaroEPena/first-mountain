// Build-time env: Astro reads astro.config before it loads .env, so load it here with Vite's
// loader (same precedence as Astro: shell env wins over .env files). Shared by the config and
// the deploy guard so both see the same values.
import { loadEnv } from 'vite';

export function buildEnv(
  mode = process.env.NODE_ENV === 'development' ? 'development' : 'production',
) {
  return loadEnv(mode, process.cwd(), 'PUBLIC_');
}

/**
 * The quote form may only post to a same-origin path (e.g. `/api/quote`, a Worker route on the
 * same Cloudflare project): the CSP allows `connect-src 'self'` and nothing else.
 */
export function assertFormEndpoint(endpoint) {
  if (!endpoint) return;
  if (!/^\/(?!\/)/.test(endpoint)) {
    throw new Error(
      `PUBLIC_FORM_ENDPOINT must be a same-origin path such as /api/quote (got "${endpoint}"). ` +
        "The site's CSP only allows connect-src 'self'.",
    );
  }
}
