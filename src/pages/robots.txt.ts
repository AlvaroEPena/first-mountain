import type { APIRoute } from 'astro';

import { robotsTxt } from '../lib/robots';

// `site` is always set in astro.config.mjs (PUBLIC_SITE_URL or the preview placeholder).
export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('astro.config.mjs must set `site`');
  return new Response(robotsTxt(site), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
