import { site } from '../data/site';

/** First word of a full name ("Frank Mounga" to "Frank"). */
export function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName;
}

/** The owner's first name, as customers use it in reviews. Derived once from site.ts. */
export const ownerFirstName = firstName(site.owner);
