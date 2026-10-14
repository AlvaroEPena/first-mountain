# First Mountain Construction — Spec

_Last updated: 2026-10-14 · Status: approved 2026-10-14_

## 1. Summary

A fast, static, mobile-first marketing site for First Mountain Construction, LLC, a family-owned
concrete and hardscape contractor in Salt Lake City run by Frank Mounga. It's a preview for a
prospective client whose old site (firstmountainconstruction.net) is down. Every fact, photo and
review comes from their Google Business Profile (captured 2026-10-14). The MVP goal is a premium
site that turns visitors into calls, texts and quote requests: their own 46 job photos in a
filterable gallery, real Google reviews, clear services, and a quote form (demo mode, doesn't send).

## 2. Stack

| Layer            | Choice                                                                                                                                                                                                                                                                                    | Version                                                              |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Framework        | Astro, static output                                                                                                                                                                                                                                                                      | astro 7.3.8                                                          |
| Language         | TypeScript strict (7.x blocked by @astrojs/check and typescript-eslint peers)                                                                                                                                                                                                             | typescript ~6.0.3                                                    |
| Styling          | Tailwind 4 via `@tailwindcss/vite`, tokens in `@theme`                                                                                                                                                                                                                                    | 4.3.3                                                                |
| Animation        | CSS first; GSAP + ScrollTrigger dynamically imported only when motion is allowed, under `gsap.matchMedia`; no Lenis                                                                                                                                                                       | gsap 3.15.0                                                          |
| Page transitions | Native cross-document View Transitions (`@view-transition { navigation: auto }`), CSS only; no `<ClientRouter />`                                                                                                                                                                         | no package                                                           |
| Images           | `images:prepare` fetches Google's `=s2400` renditions (GPS-free), re-encodes with sharp (strips all metadata) into `src/assets/photos/`; astro:assets AVIF + WebP fallback; `prune-dist` removes unreferenced originals from `dist/`; a unit test asserts no EXIF/GPS in committed photos | sharp 0.35.5                                                         |
| Gallery          | Uniform cropped grid (no masonry: grid-lanes is Safari-only), vanilla TS filter, PhotoSwipe lightbox lazy-loaded on first open                                                                                                                                                            | photoswipe 5.4.4                                                     |
| Fonts            | Astro Fonts API, fontsource provider, self-hosted                                                                                                                                                                                                                                         | built into Astro; @fontsource-variable 5.3.0                         |
| Forms            | Native form, shared Zod schema, honeypot, demo mode when `PUBLIC_FORM_ENDPOINT` unset                                                                                                                                                                                                     | zod 4.6.7                                                            |
| Map              | Styled click-to-load facade, then Google's keyless embed iframe; "Get directions" link always present                                                                                                                                                                                     | no package                                                           |
| SEO              | `@astrojs/sitemap`; JSON-LD `HomeAndConstructionBusiness` + `GeneralContractor`, Service, BreadcrumbList; **no AggregateRating/Review markup** (Google policy on self-serving and third-party-sourced reviews)                                                                            | 3.7.4                                                                |
| Tests            | Vitest; Playwright (desktop, mobile, reduced-motion projects); axe                                                                                                                                                                                                                        | vitest 5.0.4 · @playwright/test 1.64.1 · @axe-core/playwright 4.13.0 |
| Lint/format      | ESLint + eslint-plugin-astro + typescript-eslint, Prettier + prettier-plugin-astro, `astro check`                                                                                                                                                                                         | eslint 10.12.0 · prettier 3.9.10 · @astrojs/check 0.9.10             |
| Hosting          | Cloudflare Workers static assets (`wrangler.jsonc` as in zydeco) + `public/_headers`; no deploy without explicit user OK                                                                                                                                                                  | wrangler 4.151.0                                                     |

Runner-up: same stack with plain tokenised CSS instead of Tailwind. Full reasoning, alternatives and sources: `research.md`.

## 3. Sitemap & pages

| Route       | Purpose                                                                                                                                                                               | Rendering | Auth |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| `/`         | Hero (photo 04, call/text/quote CTAs, 4.7★ Google badge), proof strip, services bento, featured projects, "how a job goes" process, review highlights, service area + hours, CTA band | SSG       | none |
| `/services` | One section per service group (anchors), each with real photos and review evidence; FAQ-style "what's included"; CTA                                                                  | SSG       | none |
| `/projects` | Filterable gallery of all 46 photos (All · Driveways · Courts & Slabs · Patios & Pads · Steps & Walkways · Walls & Hardscape · On the Job) + lightbox                                 | SSG       | none |
| `/reviews`  | Rating summary (4.7★, 30 reviews), every 4★/5★ review with text, links to read all and leave a review on Google                                                                       | SSG       | none |
| `/about`    | Frank Mounga and the crew, family owned, 20+ years, how they work (each value backed by a review quote), contractor-partner quote                                                     | SSG       | none |
| `/contact`  | Quote form, call/text buttons, hours, address, click-to-load map, directions link                                                                                                     | SSG       | none |
| `/404`      | Branded not-found page with links                                                                                                                                                     | SSG       | none |

Service groups for `/services` (anchor ids), all evidenced in reviews:
`driveways` (new, replacement, extensions, widening) · `patios-pads` (patios, extensions, backyard,
shed and garbage-can pads) · `sport-courts` (pickleball and basketball, 5" slab, rebar, vapor
barrier) · `steps-walkways` (front steps, porches, sidewalks, side paths) · `rv-pads` (RV and trailer
parking) · `retaining-walls` (poured walls, backfill) · `hardscape` (pavers, edging, rock borders,
curbing, drains, footings, light landscaping and xeriscape) · `fences` (installation, repair, concrete
footings and mow strips).

## 4. User journeys (become e2e tests)

- J1. A visitor lands on `/`, sees the hero photo and headline, taps "Get a free estimate" and reaches `/contact#quote`.
- J2. A mobile visitor taps "Call" (`tel:+19254575539`) or "Text" (`sms:+19254575539`) from the sticky mobile action bar on any page.
- J3. A visitor opens `/projects`, filters to "Driveways", sees only driveway items with a live count update, opens one in the lightbox, moves with the arrow keys and closes with Esc. Focus returns to the thumbnail.
- J4. A visitor opens `/services`, jumps to "Sport Courts" from the in-page nav, then follows that section's CTA to `/contact#quote` with the project type preselected (`?type=sport-court`).
- J5. A visitor fills the quote form with invalid data and sees inline accessible errors. They correct them, submit, and see a confirmation. In demo mode the confirmation says the preview doesn't send and shows the phone number.
- J6. A visitor opens `/reviews`, sees the 4.7 summary and the review list, and the "Read all reviews on Google" link points to the listing.
- J7. A visitor on `/contact` clicks "Show map", and the Google Maps iframe loads only then. A "Get directions" link always works.
- J8. A mobile visitor opens the nav menu (focus trap, Esc closes, body doesn't scroll) and navigates.
- J9. A visitor with `prefers-reduced-motion: reduce` gets all content with no motion, and the GSAP chunk isn't requested.
- J10. An unknown URL shows the 404 page with a link home.

## 5. Data model

No database. Typed static content in `src/data/`:

- `site.ts` (orchestrator-owned): `name`, `legalName`, `owner` ("Frank Mounga"), `phone` (display
  "(925) 457-5539", E.164 "+19254575539"), `address` (1359 N General Dr, Salt Lake City, UT 84116),
  `geo` (40.7987704, -111.9483085), `hours` (Mon–Fri 07:00–19:00, Sat–Sun closed),
  `rating` ({ value: 4.7, count: 30, capturedOn: '2026-10-14' }), `googleMapsUrl`
  (`https://www.google.com/maps?cid=7678762711807686422`), `googleReviewsUrl`, `writeReviewUrl`,
  `yearsExperience` ("20+", from HomeAdvisor, confirm), `serviceArea` ("Salt Lake City and the Salt
  Lake Valley", confirm), `PUBLIC_SITE_URL`.
- `gallery.ts`: `GalleryItem { id: string; file: string (src/assets/photos/<id>.jpg); alt: string;
category: 'driveways' | 'courts' | 'patios' | 'steps' | 'hardscape' | 'process'; featured?: boolean;
lowRes?: boolean; source: string (Google photo URL) }`. 46 items, classified in `brief.md`.
  Photo 26 (highway) is `process`-excluded: atmospheric use only, never presented as their work.
- `reviews.ts`: `Review { id; author; rating: 1–5; approxYear: number (from relative date at
capture); localGuide: boolean; text: string; ownerReply?: string; highlight?: string (short pull
quote, verbatim substring of text); services?: ServiceId[] }`. Includes every 4★/5★ review with
  text (27). The two 1★ reviews are excluded by brief decision. Review #27 is trimmed (no prices or
  supplier names). Source: `docs/google-reviews.md`.
- `services.ts`: `Service { id: ServiceId; name; summary; bullets: string[]; photos: string[]
(gallery ids); reviewIds: string[] }`.
- `process.ts`: 4 steps (call or text → on-site bid → prep, form and pour → cleanup and walkthrough),
  each tied to review evidence. No invented claims (no licenses, warranties, insurance or pricing
  unless the client confirms).

## 6. API / server contract

No server endpoints in the preview.

| Name                | Method                                        | Auth | Input          | Output         | Errors                                         |
| ------------------- | --------------------------------------------- | ---- | -------------- | -------------- | ---------------------------------------------- |
| Quote form (client) | POST `PUBLIC_FORM_ENDPOINT` if set, else demo | none | `QuoteRequest` | `{ ok: true }` | `{ ok: false, errors: Record<field, string> }` |

`QuoteRequest` (Zod, `src/lib/contracts/quote.ts`, orchestrator-owned):
`name` (2–80, trimmed) · `phone` (required, 10–15 digits after stripping formatting) · `email`
(optional, valid if present) · `address` (optional, ≤160, "street or city") · `projectType`
(`driveway` | `patio-pad` | `sport-court` | `steps-walkway` | `rv-pad` | `retaining-wall` |
`hardscape` | `fence` | `other`) · `timeframe` (optional: `asap` | `1-3-months` | `3-plus-months` |
`flexible`) · `message` (10–2000) · `website` (honeypot, must be empty). Exports `quoteRequestSchema`,
`QuoteRequest`, `projectTypes` (with labels), `parseQuoteForm(FormData)`.

`?type=<projectType>` on `/contact` preselects the project type (ignored when invalid).

## 7. Auth & permissions

None.

## 8. Integrations & env vars

`.env.example`: `PUBLIC_SITE_URL`, `PUBLIC_FORM_ENDPOINT` (optional, empty = demo mode).
Google Maps: keyless embed iframe behind a click-to-load facade (research Q4). No analytics.
Later (each needs user OK): Cloudflare Worker `/api/quote` + Resend + Turnstile (`RESEND_API_KEY`,
`QUOTE_TO_EMAIL`, `TURNSTILE_SECRET`, `PUBLIC_TURNSTILE_SITE_KEY`).

## 9. Design system

- **Direction: taste-skill only** (no reference brand or images). Dials: **variance 7, motion 7,
  density 4**. The frontend agent loads `design-taste-frontend` (and `playwright-cli` for visual
  checks) and writes `docs/DESIGN.md` as the token source of truth.
- **Concept: "alpenglow on cured concrete".** Light-forward and sunlit, unlike the dark sibling sites
  (Grit is charcoal + safety orange, Zydeco is navy + aqua). Mostly warm, pale cured-concrete
  surfaces with granite-dark anchor sections (hero overlay, process, CTA, footer). The single accent
  is the pink-orange alpenglow the Wasatch turns at sunset. Their photos already carry the mountains
  (04, 08, 09, 11), and the design leans into that.
- **Tokens (starting point, frontend owns final values):** cured `#ECE8E1`, chalk `#F7F5F1`, aggregate
  `#C9C3B8`, wet-concrete `#8C9090`, granite `#1D2226`, slate `#2E363C`, alpenglow `#D9643A` (single
  action accent, buttons and key marks only), pine `#3D5A4B` (sparing secondary, e.g. rating and
  checks). WCAG AA contrast required. Pick text on alpenglow by measured contrast.
- **Type:** a strong display grotesk with character plus a clean text face from fontsource,
  self-hosted. **Don't reuse sibling faces** (Bricolage Grotesque, Figtree, Big Shoulders, Hanken
  Grotesk, Oxanium, Geist, Jost, Cormorant, Inter). Candidates: Archivo (wide/expanded weights) or
  Familjen Grotesk for display, Instrument Sans or Public Sans for text. Fluid `clamp()` scale. Use
  plain hyphens and commas in copy, no em/en dashes.
- **Signature motifs (each with a purpose):**
  1. **Control joints**: hairline saw-cut lines as the layout grid, section dividers and gallery gutters (the language of finished slabs).
  2. **Topo contours**: a faint Wasatch contour-line texture on dark sections (place, without clichés).
  3. **Screed reveal**: images and section headings revealed by a horizontal wipe, like a screed board leveling wet concrete (scroll motion with meaning).
  4. **Ridgeline**: a single SVG Wasatch ridgeline (hand-traced, not a stock triangle) used in the logo and the footer edge.
- **Logo (new):** SVG wordmark "FIRST MOUNTAIN" with "CONSTRUCTION" sub-line, plus a mark: a peak
  whose silhouette is cut from a slab block (the right flank reads as a "1"). One-colour and
  two-colour variants on light and dark. Favicon set, apple-touch icon, OG image (1200×630) built by
  script from a project photo.
- **Motion:** GSAP + ScrollTrigger, dynamically imported only when motion is allowed. Includes the
  screed reveals, a gentle hero parallax (≤6%), a stat count-up for 4.7 and 30, magnetic primary CTAs
  on fine pointers, and a pinned "how a job goes" sequence on desktop. Content is visible without JS.
  Animate transform and opacity only.
- **Components:** BaseLayout (SEO, JSON-LD, skip link, fonts, motion gate), Header (sticky, condenses
  on scroll), MobileMenu, MobileActionBar (Call · Text · Estimate, sticky bottom on mobile), Footer,
  PageHero, Hero, ProofStrip, ServiceBento, ServiceSection, ProjectStrip, ProcessSteps, ReviewCard,
  ReviewMarquee/Track, RatingSummary, GoogleBadge, FilterBar, GalleryGrid, Lightbox (PhotoSwipe),
  Photo (astro:assets Picture), QuoteForm, MapFacade, HoursTable (shows "Open now / Closed" in
  America/Denver, computed client-side, static fallback), CtaBand, Logo, JsonLd, Breadcrumbs.
- **Breakpoints:** mobile-first, 30 / 48 / 64 / 90 rem.
- **Copy tone:** plain-spoken, local, proud of the work, warm about the family business. Use the
  customers' words where possible (review pull quotes). Never invent facts, licenses, warranties,
  insurance, pricing or city lists. Anything unconfirmed goes in `site.ts` with a `// confirm`
  comment and is listed in the handoff.

## 10. Non-functional

- Budgets: Lighthouse mobile ≥ 95 Performance, ≥ 95 A11y, 100 Best Practices and SEO. LCP < 2.0 s
  on throttled mobile (hero `<img>` with `fetchpriority="high"`); CLS < 0.02; initial JS < 30 KB gz
  per page excluding lazy chunks (GSAP, PhotoSwipe).
- Images: `npm run images:prepare` downloads 2400 px renditions once into `src/assets/photos/`
  (committed, about 15–25 MB, metadata stripped; never commit the GPS-tagged originals). astro:assets emits AVIF/WebP with
  responsive srcset. Low-res photos (≤ 960 px) are never shown larger than native size.
- SEO: per-page title and description, canonical, OG/Twitter, sitemap, robots. JSON-LD:
  `HomeAndConstructionBusiness` (+ `GeneralContractor`) with NAP, geo, hours, `areaServed`,
  `sameAs` (Google Maps URL), `Service` list, BreadcrumbList. No AggregateRating/Review markup (research Q5); reviews are
  shown as visible content only, with an "as of 2026-10-14" note on the rating. The preview deploy carries `noindex` (meta + `X-Robots-Tag`), to be removed at launch.
- A11y: WCAG 2.2 AA, skip link, visible focus, keyboard lightbox with focus return, labelled form
  fields with `aria-describedby` errors and a `role="status"` result, `aria-pressed` filters,
  `aria-live` result count, reduced motion in CSS and JS, 44 px touch targets.
- Security: `_headers` with CSP (allowing only the Google Maps frame origin), nosniff,
  Referrer-Policy, Permissions-Policy, immutable caching for `/_astro/*`. Honeypot. Client-side
  validation only (documented as demo).

## 11. Work breakdown & file ownership

Orchestrator (sequential, first): scaffold, tooling, `package.json`, `astro.config.*`,
`wrangler.jsonc`, `public/_headers`, `.env.example`, `src/lib/contracts/quote.ts` (+ tests),
`src/data/site.ts`, `scripts/prepare-images.mjs` (fetches `=s2400` renditions, strips metadata, writes `src/assets/photos/`), `scripts/prune-dist.mjs`,
`src/data/gallery.ts` (46 items with categories and alt text), `src/data/reviews.ts` (from
`docs/google-reviews.md`), `CLAUDE.md`, launch.json entry (port 4334, e2e preview 4335), registry.

| Task                                                                                                            | Owner             | Files/dirs owned                                                                                                                                                                                                                                                         | Depends on |
| --------------------------------------------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| A. Design system, logo and brand assets, layouts, all pages and components, gallery, form UI, motion, SEO, copy | frontend-engineer | `src/pages/**`, `src/components/**`, `src/layouts/**`, `src/styles/**`, `src/scripts/**`, `src/lib/` (except `contracts/`), `src/data/services.ts`, `src/data/process.ts`, `src/assets/brand/**`, `public/` (except `_headers`), `docs/DESIGN.md`, `tests/unit/**` for A | scaffold   |
| B. QA: e2e journeys J1–J10, axe, responsive, web-design-guidelines audit                                        | qa-tester         | `tests/e2e/**`, `playwright.config.ts`                                                                                                                                                                                                                                   | A          |
| C. Review                                                                                                       | code-reviewer     | read-only                                                                                                                                                                                                                                                                | B          |

Shared and read-only for agents: `src/lib/contracts/**`, `src/data/site.ts`, `src/data/gallery.ts`,
`src/data/reviews.ts`, configs, `package.json` (agents ask the orchestrator for dependencies or data
changes). One frontend agent, because the site is small and the pages share a component set.

## 12. Out of scope / later

Real form delivery (Worker + Resend + Turnstile), per-service landing pages and city pages for local
SEO, blog, CMS, before/after slider (needs paired photos from the client), video, analytics, domain
and DNS, real deployment. Photos and reviews come from the client's public Google profile for the
preview. Get the client's approval before launch.

## 13. Changelog

- 2026-10-14: initial draft; stack filled from research.md (ports 4334/4335, no rating markup, native view transitions, GPS-free images).
