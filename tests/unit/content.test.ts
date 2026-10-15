import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { processSteps } from '../../src/data/process';
import { reviews, reviewsForService } from '../../src/data/reviews';
import { SERVICE_IDS } from '../../src/data/service-ids';
import { quoteHref, serviceEvidence, services } from '../../src/data/services';
import { atmospherePhotoId, gallery } from '../../src/data/gallery';
import { PROJECT_TYPES } from '../../src/lib/contracts/quote';
import { crewPhotos, partnerReviewId, values } from '../../src/lib/content/about';
import { isCurrentPath, primaryNav } from '../../src/lib/content/navigation';

const reviewText = (id: string) => {
  const review = reviews.find((entry) => entry.id === id);
  if (!review) throw new Error(`Unknown review ${id}`);
  return review.text;
};
const galleryIds = new Set(gallery.map((item) => item.id));

describe('services', () => {
  it('cover every service id once, in canonical order', () => {
    expect(services.map((service) => service.id)).toEqual([...SERVICE_IDS]);
  });

  it('lead with a review that is actually tagged with the service', () => {
    for (const service of services) {
      const { featured, others } = serviceEvidence(service);
      expect(featured.services, service.id).toContain(service.id);
      expect(others.length + 1).toBe(reviewsForService(service.id).length);
    }
  });

  it('use real project photos only (never the atmosphere shot)', () => {
    for (const service of services) {
      for (const id of service.photos) {
        expect(galleryIds.has(id), `${service.id}: ${id}`).toBe(true);
        expect(id).not.toBe(atmospherePhotoId);
      }
    }
  });

  it('link their CTA to the quote form with a valid project type', () => {
    for (const service of services) {
      expect(PROJECT_TYPES).toContain(service.projectType);
      expect(quoteHref(service.projectType)).toBe(`/contact?type=${service.projectType}#quote`);
    }
  });
});

describe('customer quotes', () => {
  it('in the process steps are verbatim from the cited review', () => {
    expect(processSteps).toHaveLength(4);
    for (const step of processSteps) {
      expect(reviewText(step.reviewId), step.id).toContain(step.quote);
      expect(galleryIds.has(step.photo)).toBe(true);
    }
  });

  it('on the about page are verbatim from the cited review', () => {
    for (const value of values) {
      expect(reviewText(value.reviewId), value.title).toContain(value.quote);
    }
    expect(reviews.some((review) => review.id === partnerReviewId)).toBe(true);
    for (const id of crewPhotos) expect(galleryIds.has(id)).toBe(true);
  });
});

describe('navigation', () => {
  it('marks the current page, including built .html paths', () => {
    expect(isCurrentPath('/services', '/services')).toBe(true);
    expect(isCurrentPath('/services.html', '/services')).toBe(true);
    expect(isCurrentPath('/', '/services')).toBe(false);
    expect(primaryNav.map((link) => link.href)).toContain('/contact');
  });
});

/** Every file whose text is visible copy and that this build owns. */
function copyFiles(): string[] {
  const roots = ['src/pages', 'src/components', 'src/layouts', 'src/lib/content'];
  const files = ['src/data/services.ts', 'src/data/process.ts'];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.(astro|ts)$/.test(entry)) files.push(full);
    }
  };
  roots.forEach(walk);
  return files;
}

describe('copy', () => {
  it('has no em or en dashes', () => {
    for (const file of copyFiles()) {
      const text = readFileSync(file, 'utf8');
      expect(/[–—]/.test(text), file).toBe(false);
    }
  });
});
