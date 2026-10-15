/**
 * Topographic contour texture for dark sections: iso-lines of a smooth height field with a few
 * summits, traced with marching squares and joined into polylines. Deterministic (no randomness),
 * so regenerating it yields the same file.
 */
const WIDTH = 1600;
const HEIGHT = 1000;
const CELL = 20;
const LEVELS = 14;

/** Summits (x, y, height, spread) loosely placed like a range seen from above. */
const SUMMITS = [
  [380, 330, 1, 260],
  [610, 250, 0.85, 200],
  [1080, 420, 1.1, 300],
  [1350, 180, 0.7, 180],
  [820, 760, 0.6, 240],
  [180, 820, 0.5, 220],
];

function height(x, y) {
  let h = 0;
  for (const [cx, cy, peak, spread] of SUMMITS) {
    const d2 = (x - cx) ** 2 + (y - cy) ** 2;
    h += peak * Math.exp(-d2 / (2 * spread * spread));
  }
  // Gentle ridging so the lines wander instead of forming perfect rings.
  h += 0.06 * Math.sin(x / 97 + Math.cos(y / 131) * 2) + 0.05 * Math.cos(y / 83 - x / 211);
  return h;
}

const key = ([x, y]) => `${Math.round(x * 10)},${Math.round(y * 10)}`;

function segmentsAt(level, field, cols, rows) {
  const segments = [];
  const lerp = (a, b, va, vb) => a + ((level - va) / (vb - va)) * (b - a);
  for (let j = 0; j < rows; j += 1) {
    for (let i = 0; i < cols; i += 1) {
      const x = i * CELL;
      const y = j * CELL;
      const tl = field[j][i];
      const tr = field[j][i + 1];
      const br = field[j + 1][i + 1];
      const bl = field[j + 1][i];
      const edges = [];
      if (tl < level !== tr < level) edges.push([lerp(x, x + CELL, tl, tr), y]);
      if (tr < level !== br < level) edges.push([x + CELL, lerp(y, y + CELL, tr, br)]);
      if (bl < level !== br < level) edges.push([lerp(x, x + CELL, bl, br), y + CELL]);
      if (tl < level !== bl < level) edges.push([x, lerp(y, y + CELL, tl, bl)]);
      if (edges.length === 2) segments.push([edges[0], edges[1]]);
      if (edges.length === 4) {
        segments.push([edges[0], edges[1]]);
        segments.push([edges[2], edges[3]]);
      }
    }
  }
  return segments;
}

/** Join touching segments into polylines so the path stays small. */
function joinSegments(segments) {
  const byPoint = new Map();
  segments.forEach((segment, index) => {
    for (const point of segment) {
      const list = byPoint.get(key(point)) ?? [];
      list.push(index);
      byPoint.set(key(point), list);
    }
  });
  const used = new Set();
  const lines = [];
  for (let start = 0; start < segments.length; start += 1) {
    if (used.has(start)) continue;
    used.add(start);
    const line = [...segments[start]];
    for (const atEnd of [true, false]) {
      for (;;) {
        const tip = atEnd ? line[line.length - 1] : line[0];
        const next = (byPoint.get(key(tip)) ?? []).find((index) => !used.has(index));
        if (next === undefined) break;
        used.add(next);
        const [a, b] = segments[next];
        const other = key(a) === key(tip) ? b : a;
        if (atEnd) line.push(other);
        else line.unshift(other);
      }
    }
    lines.push(line);
  }
  return lines;
}

/** Full SVG document for the contour texture, stroked in `color` at `opacity`. */
export function renderTopo(color, opacity) {
  const cols = WIDTH / CELL;
  const rows = HEIGHT / CELL;
  const field = Array.from({ length: rows + 1 }, (_, j) =>
    Array.from({ length: cols + 1 }, (_, i) => height(i * CELL, j * CELL)),
  );
  const paths = [];
  for (let n = 1; n <= LEVELS; n += 1) {
    const level = (n / (LEVELS + 1)) * 1.1;
    const lines = joinSegments(segmentsAt(level, field, cols, rows)).filter((l) => l.length > 3);
    const d = lines
      .map((line) => `M${line.map(([x, y]) => `${Math.round(x)} ${Math.round(y)}`).join('L')}`)
      .join('');
    // Every fifth line is an index contour, drawn heavier, as on a survey map.
    const width = n % 5 === 0 ? 1.6 : 0.8;
    if (d) paths.push(`<path d="${d}" stroke-width="${width}"/>`);
  }
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" preserveAspectRatio="xMidYMid slice">` +
    `<g fill="none" stroke="${color}" stroke-opacity="${opacity}" stroke-linejoin="round" stroke-linecap="round">${paths.join('')}</g></svg>\n`
  );
}
