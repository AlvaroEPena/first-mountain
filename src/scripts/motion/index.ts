/**
 * Motion entry. The head script sets `data-motion="on"` only when motion is allowed, so this
 * module does nothing for reduced-motion visitors and GSAP is never downloaded for them.
 */
if (document.documentElement.getAttribute('data-motion') === 'on') {
  import('./run')
    .then(({ runMotion }) => runMotion())
    .catch((error: unknown) => {
      // Without the module the head failsafe reveals all content; log for debugging only.
      console.warn('Motion module failed to load', error);
      document.documentElement.removeAttribute('data-motion');
    });
}
