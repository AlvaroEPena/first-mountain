/** Escapes a literal string for use inside a RegExp. */
export function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Em dash and en dash, which spec §9 bans from visible copy. */
export const BANNED_DASHES = /[–—]/;
