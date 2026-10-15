/**
 * Single source of truth for the First Mountain logo geometry.
 * Imported by `Logo.astro` (inline SVG) and `build-brand-assets.mjs` (static files, PNGs).
 *
 * Wordmark: a hand-built, expanded monoline alphabet with squared bowls and butt ends, the
 * lettering of site signage and equipment decals. Mark: a peak standing on a slab. The peak's
 * right flank is a sheer vertical face and its upper left flank kinks like a numeral flag, so
 * peak and slab together read as a "1" with its foot (First).
 */
import { BRAND } from './palette.mjs';

const round = (n) => Math.round(n * 100) / 100;

/** Letter centre-lines in a 0..40 tall box, stroked at WORD_STROKE. `w` is the advance width. */
export const LETTERS = {
  F: { w: 29, d: 'M3.5 40V3.5H29M3.5 20.5H24' },
  I: { w: 7, d: 'M3.5 0V40' },
  R: { w: 33, d: 'M3.5 40V3.5H22a7 7 0 0 1 7 7v3.5a7 7 0 0 1-7 7H3.5M20 20.5L31 40' },
  S: {
    w: 32,
    d: 'M32 3.5H10.5a7 7 0 0 0-7 7v3a7 7 0 0 0 7 7h11a7 7 0 0 1 7 7v2a7 7 0 0 1-7 7H0',
  },
  T: { w: 31, d: 'M0 3.5H31M15.5 3.5V40' },
  M: { w: 41, d: 'M3.5 40V3.5L20.5 27L37.5 3.5V40' },
  O: {
    w: 40,
    d: 'M10.5 3.5H29.5a7 7 0 0 1 7 7V29.5a7 7 0 0 1-7 7H10.5a7 7 0 0 1-7-7V10.5a7 7 0 0 1 7-7Z',
  },
  U: { w: 37, d: 'M3.5 0V29.5a7 7 0 0 0 7 7H26.5a7 7 0 0 0 7-7V0' },
  N: { w: 37, d: 'M3.5 40V3.5L33.5 36.5V0' },
  A: { w: 38, d: 'M1.5 40L19 3.5L36.5 40M8.5 27.5H29.5' },
  C: { w: 36, d: 'M36 3.5H10.5a7 7 0 0 0-7 7V29.5a7 7 0 0 0 7 7H36' },
};

const WORD_STROKE = 7;
const WORD_HEIGHT = 40;
const LETTER_GAP = 6;
const WORD_SPACE = 15;
const SUB_SCALE = 0.3;
const SUB_GAP_Y = 11;
const SUB_STROKE = 6;

/** Lay out a string; spaces advance by WORD_SPACE. Returns glyphs and the total width. */
function layout(text, { gap, scale = 1 }) {
  let cursor = 0;
  const glyphs = [];
  for (const char of text) {
    if (char === ' ') {
      cursor += WORD_SPACE * scale;
      continue;
    }
    const glyph = LETTERS[char];
    if (!glyph) throw new Error(`No glyph for "${char}"`);
    glyphs.push({ d: glyph.d, x: round(cursor) });
    cursor += (glyph.w + gap) * scale;
  }
  return { glyphs, width: round(cursor - gap * scale) };
}

/**
 * Two-line wordmark: "FIRST MOUNTAIN" (40 units tall) over "CONSTRUCTION", which is tracked
 * out to the same width so the lockup reads as one solid block, like a slab.
 */
export function wordmark() {
  const main = layout('FIRST MOUNTAIN', { gap: LETTER_GAP });
  const subLetters = [...'CONSTRUCTION'];
  const natural = layout('CONSTRUCTION', { gap: 0, scale: SUB_SCALE });
  const spread = (main.width - natural.width) / (subLetters.length - 1);
  const sub = layout('CONSTRUCTION', { gap: spread / SUB_SCALE, scale: SUB_SCALE });
  const subY = WORD_HEIGHT + SUB_GAP_Y;
  return {
    width: main.width,
    height: round(subY + WORD_HEIGHT * SUB_SCALE),
    main: main.glyphs,
    sub: sub.glyphs,
    subY,
  };
}

/** Mark geometry in a 64 x 64 box. */
export const MARK = {
  size: 64,
  /** Peak: long foothill, a flag-like shoulder, summit, then the sheer "1" stem. */
  peak: 'M11 45L17.5 37L20.5 38.5L26 27.5L29.5 29L40.5 9V45Z',
  /** Slab the peak stands on, separated by a saw-cut joint (the gap). */
  slab: 'M11 48.5H53V55H11Z',
};

/**
 * Wasatch Front skyline traced by hand from the valley (north on the left): foothills,
 * Mount Olympus's double summit, Twin Peaks, Lone Peak, then down to the Point of the Mountain.
 * Coordinates: x 0..1000, y 0..120 (0 = top).
 */
export const RIDGE_POINTS = [
  [0, 98],
  [28, 92],
  [52, 95],
  [78, 86],
  [106, 82],
  [128, 73],
  [150, 77],
  [174, 64],
  [198, 68],
  [221, 56],
  [240, 60],
  [261, 47],
  [279, 52],
  [297, 39],
  [312, 44],
  [329, 31],
  [342, 35],
  [355, 21],
  [365, 29],
  [374, 24],
  [391, 41],
  [409, 37],
  [427, 49],
  [446, 44],
  [467, 34],
  [487, 27],
  [503, 18],
  [515, 23],
  [528, 11],
  [539, 17],
  [550, 9],
  [566, 25],
  [584, 21],
  [602, 33],
  [621, 28],
  [641, 41],
  [660, 35],
  [679, 23],
  [694, 27],
  [710, 13],
  [724, 21],
  [741, 31],
  [760, 27],
  [782, 41],
  [806, 45],
  [829, 57],
  [852, 53],
  [876, 65],
  [900, 71],
  [925, 79],
  [950, 77],
  [975, 87],
  [1000, 91],
];

export const RIDGE_VIEWBOX = '0 0 1000 120';

/** Open ridge line (for strokes). */
export function ridgeLine() {
  return `M${RIDGE_POINTS.map(([x, y]) => `${x} ${y}`).join('L')}`;
}

/** Closed silhouette down to the bottom edge (for fills). */
export function ridgeSilhouette() {
  return `${ridgeLine()}L1000 120L0 120Z`;
}

/**
 * Inner SVG markup for the wordmark. Glyph tips that overshoot the cap band (mitred apexes on
 * A, M and N) are clipped flat, which is what gives the letters their cut-stencil tops.
 */
export function renderWordmark(uid, colors) {
  const w = wordmark();
  const clip = `${uid}-band`;
  const main = w.main.map((g) => `<path d="${g.d}" transform="translate(${g.x})"/>`).join('');
  const sub = w.sub
    .map((g) => `<path d="${g.d}" transform="translate(${g.x} ${w.subY}) scale(${SUB_SCALE})"/>`)
    .join('');
  return (
    `<defs><clipPath id="${clip}"><rect width="${w.width}" height="${WORD_HEIGHT}"/></clipPath></defs>` +
    `<g clip-path="url(#${clip})" fill="none" stroke="${colors.ink}" stroke-width="${WORD_STROKE}" stroke-linejoin="miter" stroke-miterlimit="10">${main}</g>` +
    `<g fill="none" stroke="${colors.sub}" stroke-width="${SUB_STROKE}" stroke-linejoin="miter">${sub}</g>`
  );
}

/** Inner SVG markup for the mark. `tile` draws a rounded square behind it (favicons). */
export function renderMark(colors, { tile = null } = {}) {
  const back = tile ? `<rect width="64" height="64" rx="14" fill="${tile}"/>` : '';
  return `${back}<path d="${MARK.peak}" fill="${colors.peak}"/><path d="${MARK.slab}" fill="${colors.slab}"/>`;
}

const LOCKUP_GAP = 18;

/** The mark's ink box inside its 64 x 64 canvas. */
const MARK_INK = { x: 11, y: 9, width: 42, height: 46 };

/** Horizontal lockup: the mark scaled to the wordmark's full height, then the wordmark. */
export function lockup() {
  const w = wordmark();
  const markScale = w.height / MARK_INK.height;
  return { w, markScale, wordX: round(MARK_INK.width * markScale + LOCKUP_GAP) };
}

export function renderLockup(uid, tone, { mono = false } = {}) {
  const colors = BRAND[tone];
  const { markScale, wordX } = lockup();
  const markColors = mono ? { peak: colors.ink, slab: colors.ink } : colors;
  const markX = round(-MARK_INK.x * markScale);
  const markY = round(-MARK_INK.y * markScale);
  return (
    `<g transform="translate(${markX} ${markY}) scale(${round(markScale)})">${renderMark(markColors)}</g>` +
    `<g transform="translate(${wordX})">${renderWordmark(uid, colors)}</g>`
  );
}

export const WORDMARK_VIEWBOX = (() => {
  const w = wordmark();
  return `0 0 ${w.width} ${w.height}`;
})();

export const LOCKUP_VIEWBOX = (() => {
  const { w, wordX } = lockup();
  return `0 0 ${round(wordX + w.width)} ${w.height}`;
})();

/** Mark viewBox cropped to its ink with a little air. */
export const MARK_VIEWBOX = `${MARK_INK.x - 2} ${MARK_INK.y - 2} ${MARK_INK.width + 4} ${MARK_INK.height + 4}`;
