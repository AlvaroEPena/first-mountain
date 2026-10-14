// One-off: download the client's Google Business Profile photos into src/assets/photos/.
// Uses Google's 2400px renditions (`=s2400`), which carry no GPS, then re-encodes with sharp.
// sharp drops all metadata (EXIF/GPS/XMP) unless told to keep it, so the output is clean.
// Never point this at the full-size originals (`=s0`): those include customers' home GPS.
// Usage: npm run images:prepare [-- --force]
import { mkdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const LIST = path.resolve('docs/google-photo-urls.txt');
const OUT = path.resolve('src/assets/photos');
const MAX_EDGE = 2400;
const force = process.argv.includes('--force');

async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

const entries = (await readFile(LIST, 'utf8'))
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => {
    const [id, url] = line.split(/\s+/);
    return { id: `photo-${id}`, url };
  });

await mkdir(OUT, { recursive: true });

let written = 0;
for (const { id, url } of entries) {
  const target = path.join(OUT, `${id}.jpg`);
  if (!force && (await exists(target))) continue;

  const res = await fetch(`${url}=s${MAX_EDGE}`);
  if (!res.ok) throw new Error(`${id}: HTTP ${res.status}`);
  const input = Buffer.from(await res.arrayBuffer());

  await sharp(input)
    .rotate() // bake EXIF orientation into pixels before metadata is dropped
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(target);
  written++;
  console.log(`prepare-images: ${id}`);
}

console.log(`prepare-images: ${written} written, ${entries.length - written} already present`);
