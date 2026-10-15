/**
 * Brand colours used by generated assets (logo SVGs, favicons, OG image, topo texture).
 * Mirrors the `@theme` tokens in src/styles/global.css; a unit test keeps the two in sync.
 */
export const PALETTE = {
  chalk: '#F2F2EF',
  cured: '#E4E3DE',
  aggregate: '#C7C4BC',
  granite: '#171C1F',
  slate: '#2A3237',
  alpenglow: '#D9643A',
  alpenglowLit: '#EC7F52',
};

/** Logo colours per background tone. */
export const BRAND = {
  onLight: {
    ink: PALETTE.granite,
    sub: PALETTE.slate,
    peak: PALETTE.alpenglow,
    slab: PALETTE.granite,
  },
  onDark: {
    ink: PALETTE.chalk,
    sub: PALETTE.aggregate,
    peak: PALETTE.alpenglowLit,
    slab: PALETTE.chalk,
  },
};
