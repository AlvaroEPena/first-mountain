# First Mountain Construction

Preview website for First Mountain Construction, LLC, a family-owned concrete and hardscape
contractor in Salt Lake City run by Frank Mounga. Their old site (firstmountainconstruction.net)
is down. Every fact, photo and review here comes from their Google Business Profile, captured
2026-10-14.

Pages: Home, Services, Projects (45 job photos, filterable, lightbox), Reviews, About, Contact
(quote form, hours, click-to-load map) and a 404.

## Stack

Astro 7 (static output) · TypeScript 6 strict · Tailwind CSS 4 · GSAP 3 (loaded only when motion
is allowed) · native cross-document view transitions · PhotoSwipe 5 · Zod 4 · Vitest · Playwright
with axe · Cloudflare Workers static assets.

Decisions and sources: `docs/research.md`. Architecture and contracts: `docs/spec.md`. Design
system: `docs/DESIGN.md`. Project log: `docs/progress.md`.

## Setup

Requires Node 22.12 or newer (developed on Node 24) and npm.

```bash
npm install
npx playwright install chromium
cp .env.example .env
npm run dev
```

The dev server runs on http://localhost:4334.

## Environment variables

| Variable               | Required   | Purpose                                                                                                                                                                                                                   |
| ---------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PUBLIC_SITE_URL`      | for deploy | Public base URL. Used for canonical URLs, sitemap, robots.txt, Open Graph and JSON-LD. Read at build time from `.env` or the shell. `deploy` refuses placeholders.                                                        |
| `PUBLIC_FORM_ENDPOINT` | no         | Same-origin path the quote form POSTs JSON to, e.g. `/api/quote`. Empty means demo mode: the form validates but sends nothing and says so. Cross-origin values fail the build (the CSP only allows `connect-src 'self'`). |

## Scripts

| Command                  | What it does                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------ |
| `npm run dev`            | Dev server on port 4334                                                                          |
| `npm run build`          | Production build into `dist/`                                                                    |
| `npm run build:prune`    | Build, then delete unreferenced images from `dist/` (what `deploy` ships)                        |
| `npm run preview`        | Serve `dist/` locally                                                                            |
| `npm run check`          | Typecheck (`astro check`), ESLint, Prettier check and Vitest unit tests                          |
| `npm run test:e2e`       | Playwright e2e and axe accessibility tests against a production build on port 4335               |
| `npm run images:prepare` | Re-download the Google photos at 2400px with all metadata stripped (add `-- --force` to refresh) |
| `npm run deploy`         | Guarded deploy: checks `PUBLIC_SITE_URL`, builds, prunes and runs `wrangler deploy`              |

## Photos and privacy

- Photos live in `src/assets/photos/` and are described in `src/data/gallery.ts`.
- `images:prepare` uses Google's 2400px renditions and re-encodes them with sharp, which removes
  EXIF, GPS, XMP and IPTC data. Never commit the full-size originals (`=s0` URLs): they carry
  customers' home GPS coordinates. A unit test fails if any committed image has metadata.
- Photo 26 is a highway view of the Wasatch, not their work. It is never shown as a project.
- Reviews show first name and last initial only. Full names stay in `docs/google-reviews.md`.
  There is no Review or AggregateRating structured data (Google treats self-hosted and
  copied reviews as ineligible for star snippets).

## Deploying (Cloudflare Workers static assets)

Nothing has been deployed. When the client approves:

1. Create or log into a Cloudflare account and run `npx wrangler login`.
2. Set `PUBLIC_SITE_URL` to the real URL (in `.env` or the shell).
3. `npm run deploy`. This publishes the `first-mountain` Worker defined in `wrangler.jsonc`.
4. Attach the custom domain in the Cloudflare dashboard.

## Before launch

The site is a preview and is set to `noindex`. To launch:

- Remove `noindex` in two places: the `noindex` default in `src/layouts/BaseLayout.astro` and the
  `X-Robots-Tag` line in `public/_headers`.
- Review `Strict-Transport-Security` in `public/_headers`: `includeSubDomains` applies to every
  subdomain of the client's domain.
- Get the client's written approval to use their Google photos and review text.
- Confirm the items marked `confirm` in `src/data/site.ts`: the (925) phone number, "20+ years",
  the service area, and whether fences are still offered.
- Wire the quote form: a Worker route `POST /api/quote` on the same Cloudflare project that
  validates with `quoteRequestSchema` (`src/lib/contracts/quote.ts`), replies with
  `quoteResponseSchema`, sends email (e.g. Resend) and checks Cloudflare Turnstile. Then set
  `PUBLIC_FORM_ENDPOINT=/api/quote`. Accounts needed: Cloudflare (free), Resend with a verified
  sending domain (free tier), Turnstile (free).
- Optional: add a "Leave a review" link once the Google place ID is known.
