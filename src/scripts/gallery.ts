import type PhotoSwipeLightbox from 'photoswipe/lightbox';

import {
  ALL_FILTER,
  isGalleryFilter,
  matchesFilter,
  resultMessage,
  type GalleryFilter,
} from '../lib/gallery-filter';

/**
 * Projects gallery: category filter (buttons toggle `hidden` on server-rendered items) and a
 * PhotoSwipe lightbox that is only downloaded on the first photo click.
 */
const grid = document.querySelector<HTMLElement>('[data-gallery-grid]');
const bar = document.querySelector<HTMLElement>('[data-filter-bar]');
const status = document.querySelector<HTMLElement>('[data-filter-status]');

const VISIBLE_LINKS = 'li:not([hidden]) > a';

function applyFilter(filter: GalleryFilter, { announce = true } = {}): void {
  if (!grid || !bar) return;
  let shown = 0;
  for (const item of grid.querySelectorAll<HTMLElement>('[data-category]')) {
    const isShown = matchesFilter(item.dataset.category ?? '', filter);
    item.hidden = !isShown;
    if (isShown) shown += 1;
  }
  let label = 'All';
  for (const button of bar.querySelectorAll<HTMLButtonElement>('[data-filter]')) {
    const isActive = button.dataset.filter === filter;
    button.setAttribute('aria-pressed', String(isActive));
    if (isActive) label = button.dataset.label ?? label;
  }
  if (status && announce) status.textContent = resultMessage(shown, label, filter === ALL_FILTER);
}

function setupFilter(): void {
  if (!bar) return;
  bar.hidden = false;
  bar.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-filter]');
    const value = button?.dataset.filter;
    if (!isGalleryFilter(value)) return;
    applyFilter(value);
    // Keep the choice in the URL so it survives reloads and can be shared.
    history.replaceState(null, '', value === ALL_FILTER ? location.pathname : `#${value}`);
  });
  const fromHash = location.hash.slice(1);
  if (isGalleryFilter(fromHash)) applyFilter(fromHash);
}

function setupLightbox(gridElement: HTMLElement): void {
  let lightbox: PhotoSwipeLightbox | undefined;
  let pending: Promise<PhotoSwipeLightbox> | undefined;

  async function createLightbox(): Promise<PhotoSwipeLightbox> {
    const [{ default: Lightbox }] = await Promise.all([
      import('photoswipe/lightbox'),
      import('photoswipe/style.css'),
    ]);
    const instance = new Lightbox({
      gallery: gridElement,
      // Evaluated at open time, so filtered-out photos are skipped.
      children: VISIBLE_LINKS,
      pswpModule: () => import('photoswipe'),
      bgOpacity: 0.94,
      // Fit to the viewport but never scale a small photo up (PhotoSwipe's "fit" caps at 1).
      initialZoomLevel: 'fit',
      secondaryZoomLevel: 1,
      maxZoomLevel: 1,
      closeTitle: 'Close (Esc)',
      arrowPrevTitle: 'Previous photo',
      arrowNextTitle: 'Next photo',
    });
    // Alt text for the enlarged image comes from the thumbnail.
    instance.addFilter('itemData', (itemData) => {
      const image = itemData.element?.querySelector('img');
      return { ...itemData, alt: image?.alt ?? '' };
    });
    instance.init();
    lightbox = instance;
    return instance;
  }

  gridElement.addEventListener('click', async (event) => {
    // Once created, the lightbox handles clicks itself.
    if (lightbox) return;
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[data-pswp-width]');
    if (!link) return;
    event.preventDefault();
    // Safari does not focus links on click; PhotoSwipe returns focus to the active element.
    link.focus();
    try {
      // Cache the promise so two quick clicks cannot create two lightboxes.
      const instance = await (pending ??= createLightbox());
      const visible = [...gridElement.querySelectorAll<HTMLAnchorElement>(VISIBLE_LINKS)];
      instance.loadAndOpen(visible.indexOf(link));
    } catch (error) {
      // The lightbox chunk failed to load (offline, deploy mid-session): open the photo itself.
      console.warn('Lightbox failed to load; opening the photo directly', error);
      pending = undefined;
      window.location.assign(link.href);
    }
  });
}

setupFilter();
if (grid) setupLightbox(grid);
