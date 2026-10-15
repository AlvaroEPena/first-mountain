let counter = 0;

/** Ids that stay unique within one build, for SVG clip paths rendered more than once a page. */
export function nextId(prefix: string): string {
  counter += 1;
  return `${prefix}-${counter}`;
}
