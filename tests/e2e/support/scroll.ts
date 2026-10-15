import { expect, type Page } from '@playwright/test';

/** Test-only bookkeeping kept on `window` while a page is scrolled. */
interface QaWindow extends Window {
  __qaSeenImages?: Set<HTMLImageElement>;
}

export interface SeenImage {
  src: string;
  /** Rendered box in CSS pixels. */
  width: number;
  height: number;
  objectFit: string;
}

/**
 * Scrolls the page top to bottom in instant steps (the site sets `scroll-behavior: smooth`), waiting
 * two animation frames per step so ScrollTrigger and lazy loading see every position. Every image
 * that intersects the viewport at some step is remembered for `seenImages()`.
 */
export async function scrollThroughPage(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const qaWindow = window as QaWindow;
    const seen = (qaWindow.__qaSeenImages ??= new Set<HTMLImageElement>());
    const nextFrames = () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );
    const recordVisibleImages = () => {
      for (const image of Array.from(document.images)) {
        const rect = image.getBoundingClientRect();
        const isOnScreen =
          rect.width > 1 &&
          rect.height > 1 &&
          rect.bottom > 0 &&
          rect.top < innerHeight &&
          rect.right > 0 &&
          rect.left < innerWidth;
        if (isOnScreen && image.checkVisibility({ visibilityProperty: true })) seen.add(image);
      }
    };

    const step = Math.max(200, Math.floor(innerHeight * 0.6));
    for (let top = 0; top < document.documentElement.scrollHeight; top += step) {
      window.scrollTo({ top, behavior: 'instant' });
      await nextFrames();
      recordVisibleImages();
    }
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
    await nextFrames();
    recordVisibleImages();
  });
}

/** Images recorded by `scrollThroughPage` that have not decoded to real pixels (yet). */
async function brokenSeenImages(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    [...((window as QaWindow).__qaSeenImages ?? [])]
      .filter((image) => !(image.complete && image.naturalWidth > 0))
      .map((image) => image.currentSrc || image.src),
  );
}

/** Waits until every image seen on screen has loaded with `naturalWidth > 0`. */
export async function expectSeenImagesLoaded(page: Page): Promise<void> {
  await expect
    .poll(() => brokenSeenImages(page), {
      message: 'images seen on screen that failed to load',
      timeout: 20_000,
    })
    .toEqual([]);
}

export async function seenImages(page: Page): Promise<SeenImage[]> {
  return page.evaluate(() =>
    [...((window as QaWindow).__qaSeenImages ?? [])].map((image) => {
      const rect = image.getBoundingClientRect();
      return {
        src: image.currentSrc || image.src,
        width: rect.width,
        height: rect.height,
        objectFit: getComputedStyle(image).objectFit,
      };
    }),
  );
}
