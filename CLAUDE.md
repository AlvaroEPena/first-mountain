# First Mountain Construction — Project Rules

Marketing site (preview for a prospective client) for a family-owned Salt Lake City concrete
and hardscape contractor. All content comes from their Google Business Profile. Part of the
web-dev-agent workspace; this folder is a fully independent project (own deps, own git repo).

## Read first

- `docs/brief.md`: what the user wants, business facts, photo inventory
- `docs/spec.md`: architecture, contracts, file ownership (source of truth)
- `docs/research.md`: stack decisions and sources
- `docs/google-reviews.md`: raw review capture
- `docs/progress.md`: current phase and next step

## Stack

Astro 7.3 (static) · TypeScript 6 strict · Tailwind 4 · GSAP 3 (lazy, motion-allowed only) ·
native view transitions · PhotoSwipe 5 · Zod 4 · Vitest 5 · Playwright + axe · Cloudflare
Workers static assets.

## Commands (run from this folder)

- `npm run dev`: dev server on port 4334
- `npm run check`: typecheck + lint + format check + unit tests
- `npm run build`: production build
- `npm run test:e2e`: Playwright e2e + a11y (builds and previews on port 4335)
- `npm run images:prepare`: re-download the Google photos (2400px, metadata stripped)

## Conventions

- Follow `../../.claude/skills/build-site/references/engineering-standards.md`.
- Contracts live in `src/lib/contracts/` (quote form), orchestrator-owned. Change them via
  the orchestrator and update spec §6.
- Business facts only via `src/data/site.ts`; never hard-code phone, address or hours.
  Entries marked `confirm` are unverified and must be listed in the handoff.
- Photos: `src/data/gallery.ts` is the manifest; `photo(id)` resolves files. Never commit
  full-size Google originals (`=s0`): they carry customers' home GPS. A unit test fails if
  any committed photo has EXIF/GPS/XMP/IPTC metadata.
- Photo 26 is not their work (highway view): atmosphere only, never shown as a project.
- Reviews: `src/data/reviews.ts`, visible content only. No Review/AggregateRating JSON-LD.
  Show the rating with its "as of" date. Display first name + last initial.
- Never invent facts, licenses, warranties, insurance, pricing or city lists.
- Env vars: `PUBLIC_SITE_URL`, `PUBLIC_FORM_ENDPOINT` only; keep `.env.example` current.
- Content must be visible without JS; animate transform/opacity only; honour reduced motion.
- No em or en dashes in visible copy.
