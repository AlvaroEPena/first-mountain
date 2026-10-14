// @ts-check
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// Static output; deployed later to Cloudflare Workers static assets (see wrangler.jsonc).
// The frontend-engineer owns the `fonts: [...]` array (Astro Fonts API, self-hosted at build time).
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://first-mountain.example',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap()],
  image: { layout: 'constrained' },
  vite: { plugins: [tailwindcss()] },
});
