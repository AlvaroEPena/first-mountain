// @ts-check
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';

import { assertFormEndpoint, buildEnv } from './scripts/env.mjs';

const env = buildEnv();
assertFormEndpoint(env.PUBLIC_FORM_ENDPOINT);

/** Characters the display face must cover: printable ASCII plus typographic quotes. */
const DISPLAY_GLYPHS = `${Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('')}‘’“”…`;

// Static output; deployed later to Cloudflare Workers static assets (see wrangler.jsonc).
// The frontend-engineer owns the `fonts: [...]` array (Astro Fonts API, self-hosted at build time).
export default defineConfig({
  site: env.PUBLIC_SITE_URL || 'https://first-mountain.example',
  output: 'static',
  trailingSlash: 'never',
  // Inline the (small) stylesheets so no CSS request blocks the first paint.
  build: { format: 'file', inlineStylesheets: 'always' },
  integrations: [sitemap()],
  image: { layout: 'constrained' },
  vite: { plugins: [tailwindcss()] },
  // Self-hosted at build time (no third-party font request at runtime). See docs/DESIGN.md.
  fonts: [
    {
      // Display: one static instance of Archivo, width 118 (its expanded cut) at weight 800.
      // Pinning the width and limiting glyphs to Latin text lets Google instance and subset the
      // file: about 27 KB instead of the 88 KB full variable font, so the hero h1 paints sooner.
      provider: fontProviders.google(),
      name: 'Archivo',
      cssVariable: '--face-display',
      weights: ['800'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Arial Black', 'Arial', 'sans-serif'],
      options: {
        experimental: {
          variableAxis: { wdth: ['118'] },
          glyphs: [DISPLAY_GLYPHS],
        },
      },
    },
    {
      // Text: Instrument Sans, weight axis only (about 30 KB; the width axis is not used).
      provider: fontProviders.google(),
      name: 'Instrument Sans',
      cssVariable: '--face-text',
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'Segoe UI', 'sans-serif'],
    },
  ],
});
