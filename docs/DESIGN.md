# First Mountain Construction: Design System

_Owner: frontend. Last updated 2026-10-14. Source of truth for tokens, type, shape, components and
motion. Code mirrors: `src/styles/tokens.css` (CSS) and `src/assets/brand/palette.mjs` (generated
logo files). A unit test (`tests/unit/brand.test.ts`) fails if the two drift._

## 1. Direction

**"Alpenglow on cured concrete."** A sunlit, light-forward site made of pale cured-concrete surfaces,
anchored by granite-dark sections, with one accent: the pink-orange light the Wasatch turns at
sunset. The client's own photos carry the mountains and the craft; the interface stays out of their
way and frames them like finished slabs.

- Design read: local-business marketing site for Salt Lake Valley homeowners on phones; rugged
  premium, plain-spoken, proud of the work.
- Dials (spec §9): **variance 7, motion 7, density 4.**
- Theme: one light theme. Granite sections (home hero overlay, "How a job goes", the RV and fence
  service sections, the About partner quote, the closing CTA and footer) are a deliberate
  colour-block device from the spec, not a dark mode. No dark-mode toggle: the brand is defined by
  the light surfaces, and every dark block is already a designed state.
- Distinct from the siblings: Grit (charcoal + safety orange) and Zydeco (navy + aqua, dark) are
  dark-first. First Mountain is light-first, grey-warm and squared.

## 2. Colour

| Token           | Hex       | Role                                                           |
| --------------- | --------- | -------------------------------------------------------------- |
| `chalk`         | `#F2F2EF` | Page surface, cards on cured                                   |
| `cured`         | `#E4E3DE` | Alternate bands, placeholders, quiet panels                    |
| `aggregate`     | `#C7C4BC` | Decorative large figures (404), dividers on dark               |
| `wet`           | `#7C8182` | Field borders (3.5:1 on chalk, non-text), breadcrumb slashes   |
| `granite`       | `#171C1F` | Ink, dark anchor sections, footer                              |
| `slate`         | `#2A3237` | Photo placeholders on dark, logo sub-line on light             |
| `ink-muted`     | `#4E565B` | Secondary text on light                                        |
| `on-dark-muted` | `#A9AEAF` | Secondary text on granite                                      |
| `alpenglow`     | `#D9643A` | **The action colour**: primary buttons, ridge crest, key rules |
| `alpenglow-lit` | `#EC7F52` | Accent on granite (links, rail, logo peak on dark), hover      |
| `alpenglow-ink` | `#A8401B` | Accent as small text on light (links, errors, focus ring)      |
| `pine`          | `#3D5A4B` | Sparing secondary: rating stars, checks                        |
| `pine-lit`      | `#8DB59F` | Pine on granite, "open now" dot                                |

Rules

- Alpenglow is used only for actions and a few key marks (ridge crest, quote rules, active nav cut,
  bento arrows). Never as a section background.
- Pine never competes with alpenglow: it marks ratings and "included" checks only.
- The surfaces are grey-warm concrete, not cream: they read as cured slab, not paper.

Measured contrast (WCAG 2.2)

| Pair                             | Ratio       | Use                          |
| -------------------------------- | ----------- | ---------------------------- |
| granite on chalk / cured         | 15.3 / 13.4 | Body and headings            |
| ink-muted on chalk / cured       | 6.7 / 5.8   | Secondary text               |
| alpenglow-ink on chalk / cured   | 5.5 / 4.8   | Links, errors                |
| **granite on alpenglow**         | 4.8         | Primary button label (AA)    |
| chalk on granite                 | 15.3        | Text on dark                 |
| on-dark-muted on granite         | 7.7         | Secondary text on dark       |
| alpenglow-lit on granite / slate | 6.3 / 4.8   | Links and marks on dark      |
| pine on chalk / cured            | 6.8 / 5.9   | Stars, checks                |
| pine-lit on granite              | 7.6         | Stars on dark                |
| wet on chalk                     | 3.5         | Field borders (non-text 3:1) |

White text on alpenglow (3.6:1) fails AA, so button labels are granite.

## 3. Typography

| Role    | Face                                                    | Source                                   | Notes                                                                                                     |
| ------- | ------------------------------------------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Display | **Archivo** (variable, wght 500 to 900, wdth 62 to 125) | Astro Fonts API, fontsource, self-hosted | Set expanded: `font-stretch: 118%` (`--display-stretch`), weight 800. Sign-painted, equipment-decal feel. |
| Text    | **Instrument Sans** (variable, wght 400 to 700)         | Astro Fonts API, fontsource, self-hosted | Calm grotesk with open counters; body, labels, UI.                                                        |

Neither face is used by a sibling site. Both preload, with generated fallback metrics (no CLS).

Scale (fluid `clamp()` from 375 to 1440 px; Tailwind utilities `text-hero`, `text-h1` ...)

| Token        | Range       | Line height |
| ------------ | ----------- | ----------- |
| `text-hero`  | 38 to 74 px | 0.98        |
| `text-h1`    | 36 to 70 px | 1.0         |
| `text-h2`    | 30 to 52 px | 1.05        |
| `text-h3`    | 20 to 26 px | 1.15        |
| `text-lead`  | 17 to 20 px | 1.55        |
| body         | 17 px       | 1.6         |
| `text-small` | 14 px       | 1.5         |

Rules: headings `text-wrap: balance`, paragraphs `pretty`, measure about 60 to 65ch. Sentence case
everywhere. The small uppercase eyebrow (`.eyebrow`) is rationed to one per three sections (Home
uses one: "How a job goes"). No em or en dashes in visible copy (unit-tested).

## 4. Shape, space, layers

- **Shape: squared, like saw-cut slabs.** `--radius-slab: 4px` for media, panels, buttons and
  chips; `--radius-field: 2px` for inputs. Nothing is pill-shaped; the only circle is the
  open-now status dot.
- Shell: max 86rem, gutter `clamp(16px .. 48px)`. Section rhythm `--section-y` 64 to 136 px.
- Breakpoints (spec): 30 / 48 / 64 / 90 rem. Phone first; every multi-column layout collapses to
  one column under 48rem, the bento to one column, the gallery to two.
- Touch targets: 44 px minimum (buttons 52 px, chips and nav links 44 px).
- Layers: raised 1, action bar 30, mobile menu 35, header 40, skip link / grain 60.

## 5. Signature motifs (each has a job)

1. **Control joints**: 1 px saw-cut hairlines (`--joint`) divide sections, proof-strip cells,
   hours rows, FAQ items, figure captions; the gallery's 4 px gutters read as cuts between slabs.
   They organise real content, never decorate empty space.
2. **Topo contours**: a generated contour map (`topo-on-dark.svg`, `topo-on-light.svg`, from
   `topo.mjs`) sits behind granite sections, the page hero and the map placeholder. It says
   "mountain place" without a clip-art peak.
3. **Screed reveal**: a board the colour of the surface sweeps off headings and photos left to
   right, with a thin alpenglow leading edge, like a screed leveling wet concrete. Transform only
   (`scaleX` on an overlay), so the content and the LCP image are never clipped or delayed.
4. **Ridgeline**: one hand-traced Wasatch skyline (`RIDGE_POINTS`: foothills, Mount Olympus,
   Twin Peaks, Lone Peak, Point of the Mountain). It is the top edge of the closing granite block
   on every page, with an alpenglow crest line, and appears faintly in the map placeholder and the
   OG image.

## 6. Logo

- **Mark**: a peak standing on a slab. The right flank is a sheer vertical face and the upper left
  flank kinks like a numeral flag, so peak plus slab foot read as a "1" (First). A thin gap between
  peak and slab is a control joint.
- **Wordmark**: "FIRST MOUNTAIN" in a hand-built, expanded monoline alphabet (squared bowls, butt
  ends, mitred apexes clipped flat), "CONSTRUCTION" tracked out to the same width.
- Variants: two-colour and one-colour, on light and on dark (`src/assets/brand/*.svg`). Inline in
  the UI via `Logo.astro` (`variant`, `tone`, `mono`).
- Generated by `node src/assets/brand/build-brand-assets.mjs`: favicon.svg, favicon.ico (32 + 48),
  apple-touch-icon.png (180), logo.svg, logo-512.png (structured data), og.jpg (1200 x 630 from
  photo 04 with the ridgeline).
- Clear space: the slab height on all sides. Minimum size: 24 px tall for the lockup's mark.

## 7. Components

| Component                                             | Notes                                                                                                                                                                                          |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BaseLayout`                                          | Title, description, canonical, OG/Twitter, `noindex` (preview), favicons, fonts, JSON-LD (business + breadcrumbs), motion gate, skip link, closing ridge block (`closing` slot).               |
| `Header`                                              | Fixed. Home starts transparent over the hero (`mode="overlay"`), other pages solid chalk. Condenses on scroll with a transform on the logo only. Phone link always present (icon below 80rem). |
| `MobileMenu`                                          | Full-screen chalk sheet; focus trap, Esc closes, scroll lock, closes on link.                                                                                                                  |
| `MobileActionBar`                                     | Call / Text / Estimate, fixed bottom under 48rem; content gets bottom padding.                                                                                                                 |
| `Footer` + `RidgeEdge` + `CtaBand`                    | One granite closing block with the ridge on top.                                                                                                                                               |
| `PageHero` + `Breadcrumbs`                            | Inner-page header on chalk with the light topo; optional `aside` slot (rating, photo).                                                                                                         |
| `Hero`                                                | Photo 04, eager + `fetchpriority="high"`, scrim, Google badge, H1, subtext, two CTAs.                                                                                                          |
| `ProofStrip`                                          | Four joint-divided figures; 4.7 and 30 count up.                                                                                                                                               |
| `ServiceBento`                                        | Eight services, eight cells; five photo cells, three distinct surfaces.                                                                                                                        |
| `ProjectStrip`                                        | Keyboard-scrollable rail of featured photos, staggered heights.                                                                                                                                |
| `ProcessSteps`                                        | Granite + topo. Sticky photo panel on wide screens; active step lights its index.                                                                                                              |
| `ReviewTrack`                                         | The one marquee: highlights, pause button, pauses on hover/focus, static under reduced motion.                                                                                                 |
| `RatingSummary`, `GoogleBadge`, `ReviewCard`, `Stars` | "4.7 from 30 Google reviews, as of Oct 2026", always with the Google link. Display names only.                                                                                                 |
| `ServiceSection`, `ServiceNav`, `FaqList`             | Three compositions (gallery, split, quote) so eight sections never repeat back to back.                                                                                                        |
| `FilterBar`, `GalleryGrid`                            | `aria-pressed` chips, live count, server-rendered items toggled with `hidden`, PhotoSwipe on first click.                                                                                      |
| `QuoteForm`                                           | Native form, labels above, hints and errors below (`aria-describedby`), honeypot, demo mode.                                                                                                   |
| `HoursTable`                                          | Table fallback; "Open now / Closed" computed in America/Denver.                                                                                                                                |
| `MapFacade`                                           | Topo placeholder, real "Show map" button, iframe on request, focus moves to it.                                                                                                                |
| `Screed`, `Photo`, `Icon`, `Logo`, `JsonLd`           | Primitives. Icons are vendored Tabler outlines (MIT).                                                                                                                                          |

Buttons: `btn-primary` (alpenglow, granite label), `btn-outline` (ink or chalk border by surface),
`btn-compact` for the header. One label per intent: "Get a free estimate" everywhere.

## 8. Motion

Motion 7, always motivated:

| Effect             | Where                          | Why                                        |
| ------------------ | ------------------------------ | ------------------------------------------ |
| Screed reveal      | Headings and photos            | Content arrives the way a slab is finished |
| Hero screed (CSS)  | Home and page H1s              | Same idea, no wait for JS                  |
| Rise and fade      | Supporting copy                | Paces reading order                        |
| Count-up           | 4.7 and 30                     | Lands the proof                            |
| Hero parallax (6%) | Home hero photo                | Depth                                      |
| Sequenced process  | "How a job goes", 64rem+       | Tells the job one step at a time           |
| Magnetic CTAs      | Primary buttons, fine pointers | Feedback that the button is live           |
| Marquee            | Review highlights              | Breadth of praise without a long list      |
| View transitions   | Page to page                   | Crossfade, header held (`site-header`)     |

Implementation

- GSAP + ScrollTrigger are dynamically imported only when `prefers-reduced-motion:
no-preference` (the head script sets `html[data-motion="on"]`), and run inside `gsap.matchMedia`
  so they tear down if the preference changes. Transform and opacity only.
- Hidden start states exist only under `html[data-motion="on"]`; a 3.5 s failsafe removes the
  attribute if the module never reports ready. Without JS, everything is visible.
- Native cross-document view transitions (`@view-transition`) inside a no-preference media query;
  GSAP waits for an incoming transition's `finished` promise.
- Easing: `--ease-screed` (0.65, 0, 0.35, 1) for boards, expo-out for reveals.

## 9. Accessibility

- WCAG 2.2 AA contrast (table above); visible 3 px focus ring (alpenglow-ink on light,
  alpenglow-lit on dark).
- Skip link, landmarks, one H1 per page, logical heading order, labelled regions for scrollers.
- Forms: labels above inputs, required/optional in the label, hints and errors linked with
  `aria-describedby`, `aria-invalid`, focus moves to the first error, `role="status"` messages.
- Gallery: `aria-pressed` filters, `aria-live` count, lightbox keyboard support with focus return.
- Moving content: marquee has a pause button and pauses on hover and focus; all motion collapses
  under reduced motion; the GSAP chunk is never requested then.
- Map: no third-party request until the visitor asks; "Get directions" always available.
- Copy: plain, local, customers' own words; no invented facts, licences, warranties, prices or
  city lists.
