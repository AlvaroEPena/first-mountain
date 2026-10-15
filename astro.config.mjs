// @ts-check
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';

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
  // Self-hosted at build time (no third-party font request at runtime). See docs/DESIGN.md.
  fonts: [
    {
      // Display: Archivo's variable width axis gives the expanded, sign-painted headline cut.
      provider: fontProviders.fontsource(),
      name: 'Archivo',
      cssVariable: '--face-display',
      weights: ['500 900'],
      styles: ['normal'],
      subsets: ['latin'],
      stretch: '62% 125%',
      fallbacks: ['Arial Black', 'Arial', 'sans-serif'],
    },
    {
      // Text: Instrument Sans, a calm grotesk with open counters that reads well at small sizes.
      provider: fontProviders.fontsource(),
      name: 'Instrument Sans',
      cssVariable: '--face-text',
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'Segoe UI', 'sans-serif'],
    },
  ],
});
