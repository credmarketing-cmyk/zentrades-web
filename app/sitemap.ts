import type { MetadataRoute } from 'next';
import { getManifest, SITE_URL } from '@/lib/wp';
import designPages from '@/components/redesign/pages.json';

// Pages built in React only (no WordPress data in the manifest); redesigned
// pages at new URLs (components/redesign/pages.json) are added too.
const EXTRA_PAGES = ['/black-friday'];

const PRIORITY: Record<string, number> = { home: 1, page: 0.8, post: 0.6, category: 0.4, post_tag: 0.3 };

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.entries(getManifest())
    .filter(([, e]) => !e.noindex)
    .map(([p, e]) => ({
      url: SITE_URL + (p === '/' ? '/' : p),
      lastModified: e.modified ?? undefined,
      priority: PRIORITY[e.type] ?? 0.5,
    }))
    .concat(
      [...EXTRA_PAGES, ...designPages.map((p) => p.path).filter((p) => !(p in getManifest()))].map((p) => ({ url: SITE_URL + p, lastModified: undefined, priority: 0.8 })),
    );
}
