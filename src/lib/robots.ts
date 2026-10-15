/**
 * robots.txt body. Crawling stays allowed: the preview is kept out of search results by the
 * noindex meta tag and X-Robots-Tag header, which crawlers can only see if they may fetch pages.
 */
export function robotsTxt(site: URL | string): string {
  const sitemap = new URL('sitemap-index.xml', site).toString();
  return `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`;
}
