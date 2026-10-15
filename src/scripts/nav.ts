/**
 * Header behaviour: condensed state once scrolled, and the accessible mobile menu
 * (aria-expanded toggle, focus trap, Esc to close, scroll lock).
 */
const header = document.querySelector<HTMLElement>('[data-site-header]');
const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const panel = document.querySelector<HTMLElement>('[data-menu-panel]');

const FOCUSABLE = 'a[href], button:not([disabled])';

function watchScroll(target: HTMLElement): void {
  // An observed sentinel avoids a scroll listener entirely.
  const sentinel = document.createElement('div');
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.style.cssText =
    'position:absolute;top:0;left:0;width:1px;height:48px;pointer-events:none';
  document.body.prepend(sentinel);
  new IntersectionObserver(([entry]) => {
    target.toggleAttribute('data-scrolled', !entry?.isIntersecting);
  }).observe(sentinel);
}

function setupMenu(button: HTMLButtonElement, menu: HTMLElement): void {
  const root = document.documentElement;
  const focusables = () => [button, ...menu.querySelectorAll<HTMLElement>(FOCUSABLE)];
  // Everything behind the open menu (page content, footer, action bar, skip link) goes inert, so
  // neither pointer, keyboard nor screen reader can reach it. The header keeps the toggle.
  const background = () =>
    [...document.body.children].filter(
      (element): element is HTMLElement =>
        element instanceof HTMLElement &&
        element !== menu &&
        !element.contains(button) &&
        element.tagName !== 'SCRIPT',
    );

  const setOpen = (isOpen: boolean, { restoreFocus = true } = {}) => {
    button.setAttribute('aria-expanded', String(isOpen));
    button.setAttribute('aria-label', isOpen ? 'Close menu' : 'Menu');
    menu.hidden = !isOpen;
    for (const element of background()) element.inert = isOpen;
    root.toggleAttribute('data-menu-open', isOpen);
    root.style.overflow = isOpen ? 'hidden' : '';
    if (isOpen) menu.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    else if (restoreFocus) button.focus();
  };

  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));

  document.addEventListener('keydown', (event) => {
    if (menu.hidden) return;
    if (event.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (event.key !== 'Tab') return;
    const items = focusables();
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });

  // Following a link (including same-page anchors) closes the menu.
  menu.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) setOpen(false, { restoreFocus: false });
  });

  // Leaving the mobile layout while open would otherwise strand the scroll lock.
  window.matchMedia('(min-width: 64rem)').addEventListener('change', (query) => {
    if (query.matches && !menu.hidden) setOpen(false, { restoreFocus: false });
  });
}

if (header) watchScroll(header);
if (toggle && panel) setupMenu(toggle, panel);
