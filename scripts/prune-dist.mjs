// Deploy-time only: drop images in dist/_astro that no HTML/CSS/JS references (unused originals).
import { readFile, readdir, rm } from 'node:fs/promises';
import path from 'node:path';

const DIST = path.resolve('dist');
const ASSETS = path.join(DIST, '_astro');
const IMAGE = /\.(?:png|jpe?g|webp|avif)$/i;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)])),
  );
  return nested.flat();
}

const files = await walk(DIST);
const text = files.filter((f) => /\.(?:html|css|js|json|xml|txt|svg)$/i.test(f));
const corpus = (await Promise.all(text.map((f) => readFile(f, 'utf8')))).join('\n');

let removed = 0;
for (const file of files.filter((f) => f.startsWith(ASSETS) && IMAGE.test(f))) {
  if (!corpus.includes(path.basename(file))) {
    await rm(file);
    removed++;
  }
}
console.log(`prune-dist: removed ${removed} unreferenced images`);
