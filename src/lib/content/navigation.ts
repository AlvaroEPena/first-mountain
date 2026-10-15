/** Primary navigation and the one estimate CTA label used everywhere (one label per intent). */
export interface NavLink {
  href: string;
  label: string;
}

export const primaryNav: readonly NavLink[] = [
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export const estimateCta = { href: '/contact#quote', label: 'Get a free estimate' } as const;

/** True when `href` is the current page or a parent of it. */
export function isCurrentPath(pathname: string, href: string): boolean {
  const path = pathname.replace(/(\/index)?\.html$/, '').replace(/\/$/, '') || '/';
  return path === href || path.startsWith(`${href}/`);
}
