import type { APIRoute } from 'astro';

import { site as business } from '../data/site';
import { robotsTxt } from '../lib/robots';

export const GET: APIRoute = ({ site }) =>
  new Response(robotsTxt(site ?? business.url), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
