// Deploy guard: canonical, OG, JSON-LD and sitemap URLs are baked in at build time.
import { buildEnv } from './env.mjs';

const url = buildEnv('production').PUBLIC_SITE_URL;
if (!url || /localhost|127\.0\.0\.1|\.example/.test(url)) {
  console.error(
    'PUBLIC_SITE_URL must be set to the real public URL before deploying (got: ' +
      (url ?? 'unset') +
      ').',
  );
  process.exit(1);
}
