/**
 * Generates every static brand file from geometry.mjs, palette.mjs and topo.mjs:
 *   src/assets/brand/*.svg   logo lockups and marks (light and dark, two-colour and one-colour),
 *                            topo textures for dark and light surfaces
 *   public/                  favicon.svg, favicon.ico, apple-touch-icon.png, logo.svg,
 *                            logo-512.png, og.jpg (1200 x 630, from project photo 04)
 *
 * Run from the site folder: `node src/assets/brand/build-brand-assets.mjs`
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

import {
  LOCKUP_VIEWBOX,
  RIDGE_VIEWBOX,
  lockup,
  renderLockup,
  renderMark,
  ridgeLine,
  ridgeSilhouette,
} from './geometry.mjs';
import { BRAND, PALETTE } from './palette.mjs';
import { renderTopo } from './topo.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(here, '../../..');
const publicDir = path.join(siteRoot, 'public');
const photoDir = path.join(siteRoot, 'src/assets/photos');

const svgDoc = (viewBox, body, attrs = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"${attrs}>${body}</svg>\n`;

const monoMark = (tone) => ({ peak: BRAND[tone].ink, slab: BRAND[tone].ink });

const sources = {
  'lockup-on-light.svg': svgDoc(LOCKUP_VIEWBOX, renderLockup('ll', 'onLight')),
  'lockup-on-dark.svg': svgDoc(LOCKUP_VIEWBOX, renderLockup('ld', 'onDark')),
  'lockup-mono-on-light.svg': svgDoc(LOCKUP_VIEWBOX, renderLockup('ml', 'onLight', { mono: true })),
  'lockup-mono-on-dark.svg': svgDoc(LOCKUP_VIEWBOX, renderLockup('md', 'onDark', { mono: true })),
  'mark-on-light.svg': svgDoc('0 0 64 64', renderMark(BRAND.onLight)),
  'mark-on-dark.svg': svgDoc('0 0 64 64', renderMark(BRAND.onDark)),
  'mark-mono-on-light.svg': svgDoc('0 0 64 64', renderMark(monoMark('onLight'))),
  'mark-mono-on-dark.svg': svgDoc('0 0 64 64', renderMark(monoMark('onDark'))),
  'topo-on-dark.svg': renderTopo(PALETTE.chalk, 0.11),
  'topo-on-light.svg': renderTopo(PALETTE.granite, 0.16),
};

/** Favicon: the two-colour mark on a granite tile, legible at 16 px. */
const faviconSvg = svgDoc('0 0 64 64', renderMark(BRAND.onDark, { tile: PALETTE.granite }));

/** ICO container holding PNG images (supported by every current browser). */
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + images.length * 16;
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size, 0);
    entry.writeUInt8(size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map((image) => image.data)]);
}

const rasterize = (svg, size) =>
  sharp(Buffer.from(svg), { density: 384 }).resize(size, size).png().toBuffer();

/** Apple touch icons must be opaque squares, so the tile runs full bleed. */
const appleIconSvg = svgDoc(
  '0 0 64 64',
  `<rect width="64" height="64" fill="${PALETTE.granite}"/><g transform="translate(6 4) scale(.82)">${renderMark(BRAND.onDark)}</g>`,
);

/** Square logo for structured data (Google wants a raster logo of at least 112 px). */
const logoSquareSvg = svgDoc(
  '0 0 64 64',
  `<rect width="64" height="64" fill="${PALETTE.chalk}"/><g transform="translate(6 4) scale(.82)">${renderMark(BRAND.onLight)}</g>`,
);

async function buildOgImage() {
  const width = 1200;
  const height = 630;
  const backdrop = await sharp(path.join(photoDir, 'photo-04.jpg'))
    .resize(width, height, { fit: 'cover', position: 'centre' })
    .modulate({ brightness: 0.82 })
    .toBuffer();
  const scrim = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs><linearGradient id="s" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${PALETTE.granite}" stop-opacity="0.95"/>
      <stop offset="0.55" stop-color="${PALETTE.granite}" stop-opacity="0.7"/>
      <stop offset="1" stop-color="${PALETTE.granite}" stop-opacity="0.15"/></linearGradient></defs>
    <rect width="${width}" height="${height}" fill="url(#s)"/></svg>`;
  const { w, wordX } = lockup();
  const lockWidth = 820;
  const lockHeight = Math.round((lockWidth * w.height) / (wordX + w.width));
  const lock = `<svg xmlns="http://www.w3.org/2000/svg" width="${lockWidth}" height="${lockHeight}" viewBox="${LOCKUP_VIEWBOX}">${renderLockup('og', 'onDark')}</svg>`;
  const ridgeHeight = 150;
  const ridge = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${ridgeHeight}" viewBox="${RIDGE_VIEWBOX}" preserveAspectRatio="none">
    <path d="${ridgeSilhouette()}" fill="${PALETTE.granite}"/>
    <path d="${ridgeLine()}" fill="none" stroke="${PALETTE.alpenglow}" stroke-width="2.4" vector-effect="non-scaling-stroke"/></svg>`;
  return sharp(backdrop)
    .composite([
      { input: Buffer.from(scrim) },
      { input: Buffer.from(ridge), left: 0, top: height - ridgeHeight },
      { input: Buffer.from(lock), left: 80, top: Math.round((height - lockHeight) / 2) - 50 },
    ])
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}

await mkdir(publicDir, { recursive: true });
for (const [name, content] of Object.entries(sources)) {
  await writeFile(path.join(here, name), content);
}
await writeFile(path.join(publicDir, 'favicon.svg'), faviconSvg);
await writeFile(path.join(publicDir, 'logo.svg'), sources['lockup-on-light.svg']);
const png32 = await rasterize(faviconSvg, 32);
const png48 = await rasterize(faviconSvg, 48);
await writeFile(
  path.join(publicDir, 'favicon.ico'),
  buildIco([
    { size: 32, data: png32 },
    { size: 48, data: png48 },
  ]),
);
await writeFile(path.join(publicDir, 'apple-touch-icon.png'), await rasterize(appleIconSvg, 180));
await writeFile(path.join(publicDir, 'logo-512.png'), await rasterize(logoSquareSvg, 512));
await writeFile(path.join(publicDir, 'og.jpg'), await buildOgImage());
console.log('Brand assets written.');
