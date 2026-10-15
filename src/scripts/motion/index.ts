/**
 * Motion entry. The head script sets `data-motion="on"` only when motion is allowed, so this
 * module does nothing for reduced-motion visitors and GSAP is never downloaded for them.
 *
 * GSAP is fetched and started only after the first contentful paint, the load event and an
 * idle moment, so its download and setup never delay the hero headline (the LCP element).
 * Above-the-fold motion is CSS only; if the module is slow or fails, the head failsafe reveals
 * everything after 3.5 s.
 */
function loadMotion(): void {
  import('./run')
    .then(({ runMotion }) => runMotion())
    .catch((error: unknown) => {
      console.warn('Motion module failed to load', error);
      document.documentElement.removeAttribute('data-motion');
    });
}

/** Resolves once the first contentful paint has happened (or at load where unsupported). */
function afterFirstPaint(): Promise<void> {
  if (performance.getEntriesByName('first-contentful-paint').length > 0) return Promise.resolve();
  if (!PerformanceObserver.supportedEntryTypes?.includes('paint')) return afterLoad();
  return new Promise((resolve) => {
    const observer = new PerformanceObserver((list) => {
      if (list.getEntriesByName('first-contentful-paint').length === 0) return;
      observer.disconnect();
      resolve();
    });
    observer.observe({ type: 'paint', buffered: true });
  });
}

function afterLoad(): Promise<void> {
  if (document.readyState === 'complete') return Promise.resolve();
  return new Promise((resolve) => window.addEventListener('load', () => resolve(), { once: true }));
}

function whenIdle(): Promise<void> {
  return new Promise((resolve) => {
    if ('requestIdleCallback' in window) requestIdleCallback(() => resolve(), { timeout: 1000 });
    else setTimeout(resolve, 200);
  });
}

if (document.documentElement.getAttribute('data-motion') === 'on') {
  void Promise.all([afterFirstPaint(), afterLoad()]).then(whenIdle).then(loadMotion);
}
