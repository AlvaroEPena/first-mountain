/**
 * Icon outlines vendored from Tabler Icons (MIT, https://tabler.io/icons), 24 x 24, stroke 2.
 * Vendored instead of installing a package because the site uses nine glyphs.
 */
export const ICONS = {
  phone:
    'M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2',
  message:
    'M8 9h8M8 13h6M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z',
  arrow: 'M5 12l14 0M13 18l6 -6M13 6l6 6',
  clipboard:
    'M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2zM9 14l2 2l4 -4',
  pin: 'M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z',
  check: 'M5 12l5 5l10 -10',
  external: 'M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6M11 13l9 -9M15 4h5v5',
  directions: 'M12 21l-8 -9l8 -9l8 9zM9 12h5M12 9l3 3l-3 3',
  map: 'M3 7l6 -3l6 3l6 -3v13l-6 3l-6 -3l-6 3v-13M9 4v13M15 7v13',
} as const;

/** Filled star (Tabler "star-filled" outline, drawn as a fill). */
export const STAR_PATH =
  'M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z';

export type IconName = keyof typeof ICONS;
