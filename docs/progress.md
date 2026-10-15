# Progress Log

**Current phase:** 8-done (pushed to GitHub, not deployed)
<!-- phases: 1-intake · 2-research · 3-spec-approved · 4-scaffolded · 5-building (slice N) · 6-qa · 7-review · 8-done -->

**Next step:** client review; then the launch checklist in README.md (confirm facts, approval for photos/reviews, wire form, deploy)

## Gate status

| Gate      | Status | Last run |
| --------- | ------ | -------- |
| typecheck | –      |          |
| lint      | –      |          |
| unit      | –      |          |
| build     | –      |          |
| e2e       | –      |          |
| a11y      | –      |          |
| review    | –      |          |

## Log

<!-- newest first: ### <date> — <phase>  · done · decisions · open issues -->

### 2026-10-14 — 1-intake

- Done: scraped Google Business Profile (signed-out view: details, hours, 3 reviews, 10 photo
  URLs in docs/google-photo-urls.txt) and HomeAdvisor background. Intake round 1 answered.
- Decisions: multi-page, call/text + unwired quote form UI, rugged premium + motion design,
  collect all photos and reviews through Claude in Chrome.
- Update: collected 46 photos (downloaded at original size) and all 30 reviews via Claude in Chrome.
  Brief awaiting user confirmation.

### 2026-10-14 — 1-intake complete

- Brief confirmed by user as written (5★ reviews only, 46 photos, multi-page, unwired quote form).

### 2026-10-14 — 2-research

- Done: stack-researcher wrote docs/research.md (all versions verified with npm view today).
- Decisions: same archetype as zydeco with version bumps; GPS-free =s2400 photo renditions plus
  metadata strip (originals carry customer home GPS, never commit them); native view transitions;
  click-to-load map facade; no AggregateRating/Review JSON-LD; ports 4334/4335.
- docs/spec.md drafted with the stack filled in. Awaiting user approval.

### 2026-10-14 — 3-spec-approved

- User approved the spec as presented (stack, scope, design).

### 2026-10-14 — 4-scaffolded

- Done: create-astro minimal (temp folder, moved in), deps installed (versions per research),
  configs from zydeco (eslint, prettier, vitest, tsconfig, wrangler, _headers with Maps frame-src),
  `images:prepare` (46 photos at 2400px, 34 MB, no metadata), contract `src/lib/contracts/quote.ts`,
  data `site.ts`, `gallery.ts` (45 work photos + atmosphere photo 26), `reviews.ts` (27),
  `service-ids.ts`, unit tests (16 passing incl. no-EXIF/GPS check), CLAUDE.md, launch.json (4334),
  registry row, git init + initial commit.
- Gates: `npm run check` pass, `npm run build` pass, dev server starts on 4334.
- Note: committed photos are 34 MB (research estimated 15–25 MB); acceptable, revisit if needed.

### 2026-10-14 — 5-building (done)

- frontend-engineer built all 7 pages, design system (docs/DESIGN.md: Archivo expanded + Instrument
  Sans, alpenglow #D9643A, granite/cured surfaces), logo + brand asset script, gallery + PhotoSwipe,
  quote form (demo mode), hours, map facade, GSAP motion, JSON-LD. 5 commits.
- Orchestrator integration: found and fixed a bug where the count-up effect (`[data-count]`) wiped
  the services photo grids and left later scroll reveals stuck (renamed layout hook to `data-photos`).
- Gates: check pass (0 type errors, lint/format clean, 64 unit tests), build pass (7 pages).
  Initial JS ~2-3 KB gz per page, /contact 27 KB (Zod). dist 67 MB after prune.
- Open: Pavers 4-photo mosaic leaves a gap; home "Steps and walkways" bento tile has no photo;
  no Google "write a review" link (no place ID); Lighthouse not measured yet.
- User asked to push to https://github.com/AlvaroEPena/first-mountain when done (origin added,
  not pushed).

### 2026-10-14 — 6-qa, 7-review, 8-done

- QA (qa-tester): wrote Playwright suite (journeys J1-J10, regression, a11y, images, no-JS,
  structured data, copy, links, responsive, layout, hours). First run 304 pass / 9 fail; all 9
  were product bugs (focus under mobile bar, hardscape mosaic gap, steps tile photo, fences tile
  clipping, reduced-motion transitions, LCP, robots.txt) and were fixed by frontend-engineer.
- Lighthouse mobile, Home: Performance 91 -> 98, Accessibility 100, Best Practices 100, SEO 66
  (noindex only). LCP 3.4 s -> 2.3 s (budget 2.0 s; remaining gap is lazy bento photos inside
  Chrome's preload distance), CLS 0.
- Review (code-reviewer): no Critical/High. Fixed: quote reply schema, same-origin endpoint
  rule, .env loading via loadEnv (PUBLIC_SITE_URL was ignored), no-JS form fallback, partial
  stars, data-count-up hook, honeypot rename + no fake send in demo mode, failsafe race,
  "opens tomorrow", Safari lightbox focus, 404 canonical, menu inert, dedupe, full reviewer names
  dropped from shipped data, metadata test widened to public/ images.
- Left as Low (documented in README launch checklist): single noindex switch, HSTS
  includeSubDomains review, CSP script hashes, zod/mini for /contact (27 KB gz), WebP fallback
  could be dropped (-26 MB dist), no Google "write a review" link (place ID unknown).
- README rewritten; handoff screenshots in docs/screenshots/.
- Pushed main to https://github.com/AlvaroEPena/first-mountain (user-approved). Not deployed.
