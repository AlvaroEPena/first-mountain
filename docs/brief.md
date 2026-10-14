# First Mountain Construction: Brief

_Mode: new · Created: 2026-10-14_

## Pitch

A sales preview site for a potential client: First Mountain Construction, LLC, a family-owned
concrete and hardscape contractor in Salt Lake City. Their old site (firstmountainconstruction.net)
is down and was never archived, so all content comes from their Google Business Profile
(plus HomeAdvisor for background). "Use all the best technologies."

## Business facts (source: Google Business Profile, 2026-10-14)

- Name: First Mountain Construction (legal: First Mountain Construction, LLC)
- Category: Construction company (concrete and hardscape in practice)
- Address: 1359 N General Dr, Salt Lake City, UT 84116 (Plus code Q3X2+GM)
- Map: Google CID 7678762711807686422 · 40.7987704, -111.9483085
- Phone: (925) 457-5539
- Hours: Mon–Fri 7 AM–7 PM · Sat–Sun closed
- Rating: 4.7★ from 30 Google reviews (HomeAdvisor: 4.6★ from 11, 2011–2014)
- Owner: Frank Mounga (named in reviews) · family owned and operated · 20+ years ·
  free estimates, often bid on site
- Google review highlight tags: beautiful concrete (14), promptness (6), fence installation (3),
  concrete driveway replacement (2)
- Work mentioned in reviews: driveways (replacement and extensions), back-yard patios and
  extensions, a basketball court, pavers and edging, concrete walls, retaining walls, RV pads,
  stamped and colored concrete, sealing, sidewalks and steps, fence installation
- Featured Google quotes: "Zero cracks in the driveway to date and the add on is a piece of
  artwork." · "They were easy to communicate with and finished the work quickly." · "Good
  quality work at a competitive price, all we asked for and more."
- All 30 reviews captured in docs/google-reviews.md (27× 5★, 1× 4★, 2× 1★). Owner: Frank Mounga.

## Type & audience

- Site type: marketing / brochure, multi-page
- Primary audience: Salt Lake Valley homeowners (plus some property owners and landlords)
- Devices: mobile-first (people browse contractors on their phones), tap-to-call everywhere

## Goals

- Primary goal: win the client by showing a premium, working replacement for their dead site
- For the business: generate calls, texts and quote requests
- Success: the owner sees their own photos, reviews and services on a fast, polished site

## Content & accounts

- Who edits content: developer (content in typed data files) for the preview
- Accounts / roles: none, fully public

## Required features (MVP)

- Pages: Home, Services (per-service sections), Project Gallery, Reviews, About, Contact
- Project gallery built from the Google Business photos (all 49 if we can collect them)
- Real Google reviews with names, rating summary, link to the Google listing
- Quote request: tap-to-call and tap-to-text CTAs plus a designed, validated quote form UI that
  isn't wired to email yet (wire it after the client signs)
- Hours, address, embedded map, LocalBusiness / GeneralContractor JSON-LD, local SEO metadata

## Nice-to-have (later)

- Working form (Cloudflare Worker + Resend or similar), real domain, analytics, CMS

## Constraints

- Hosting: free/low-cost static hosting (Cloudflare, same as other preview sites)
- Tech: "best technologies", using this workspace's proven preview stack
- Compliance: none special. WCAG AA target.
- Timeline: preview, ASAP

## Design

- Brand assets: none (no logo found). Build a wordmark from the name.
- Direction: rugged premium + motion. Concrete and stone textures, Wasatch mountain cues from
  the name, bold type, GSAP scroll reveals. In the family of grit/zydeco but its own look.
- Tone of voice: straightforward, local, family business, proud of craftsmanship

## Open questions

- Photos: collected 46 of 49 through Claude in Chrome (the rest are a Street View pano and likely videos). URLs are in docs/google-photo-urls.txt.
- Phone has a 925 (Bay Area) area code; confirm with client it's still the right number.
- Fence installation appears in reviews; confirm it's a current service.

## Photo inventory (46 Google photos, originals in session scratchpad, URLs in google-photo-urls.txt)

- Hero candidates: 04 (crew pouring, mountains behind), 08, 03 (finished pickleball court), 00
- Driveways: 00, 05, 24, 27, 28, 32, 33, 37, 39, 40, 44, 46
- Courts and large slabs: 01, 03, 04, 08, 09, 10, 11, 12, 16
- Patios and pads: 06, 20, 30, 36, 38, 41, 42, 43
- Steps, porches and walkways: 07, 29, 34, 35
- Walls, pavers and hardscape: 19, 21, 22, 25, 31
- Crew and process: 02, 13, 14, 15, 17, 18, 23
- Low-res (≤960px, use small only): 06, 18, 29, 35, 39
- 26 is a highway and mountain shot, not their work. Use it only as an atmospheric backdrop, if at all.
- Reviews: feature 5★ reviews only. Leave out the two 1★ reviews and the pricing details in #27.
