import * as cheerio from 'cheerio';
import type { HeadTag } from '@/lib/wp';

// Pages whose content is entirely our own markup (the React redesign pages,
// and blog posts in the redesigned article layout) don't need WordPress's
// theme and plugin assets: dozens of render-blocking stylesheets, jQuery and
// the Elementor scripts. These helpers leave them out while keeping SEO tags,
// icons, JSON-LD, HubSpot forms and tracking.

// WordPress-only <link> types with no use on a static site.
const WP_LINK_RELS = new Set(['profile', 'pingback', 'EditURI', 'shortlink', 'https://api.w.org/', 'alternate', 'stylesheet', 'preload']);

const WP_SCRIPT_SRC = /^(\/\/localhost:\d+)?\/wp-(includes|content)\//;

/** A theme/plugin stylesheet, style block, script or WordPress-only link in <head>. */
export function isWpAsset({ tag, attrs }: HeadTag): boolean {
  if (tag === 'style') return true;
  if (tag === 'link') return WP_LINK_RELS.has(attrs.rel) || attrs.rel?.startsWith('”');
  if (tag === 'script') return WP_SCRIPT_SRC.test(attrs.src ?? '') || attrs.id === 'jquery-js-after';
  return false;
}

// Our own components carry their styles inline; everything else is WordPress's.
const OURS = '.zt-nav, .zt-ft, .zt-blog, .zt-grid, .zt-cl';

/**
 * Removes WordPress theme/plugin styles and scripts from a page body, and the
 * Elementor popups (hidden only by Elementor's CSS). Keeps JSON-LD, HubSpot,
 * our zt-* scripts and our components' styles.
 */
export function stripWpBody(body: string): string {
  const $ = cheerio.load(body, { xml: { xmlMode: false, decodeEntities: false } }, false);
  // Popups and the scroll-to-top button are only hidden or placed by plugin CSS.
  $('[data-elementor-type="popup"], .eael-ext-scroll-to-top-wrap').remove();
  $('link[rel="stylesheet"], link[rel="preload"][as="style"]').each((_, el) => {
    if (!$(el).closest(OURS).length) $(el).remove();
  });
  $('style').each((_, el) => {
    const s = $(el);
    // Our components' styles, and the one that hides the skip link until focused.
    if (s.closest(OURS).length || s.attr('id') === 'hfe-skip-link-style') return;
    if (s.attr('id') || /elementor|\.e-con|\.eael|\.wpr-/.test(s.html() ?? '')) s.remove();
  });
  $('script').each((_, el) => {
    const s = $(el);
    const src = s.attr('src') ?? '';
    const code = s.html() ?? '';
    if (src) {
      if (WP_SCRIPT_SRC.test(src)) s.remove();
      return;
    }
    if (s.attr('type') === 'application/ld+json' || s.attr('type') === 'speculationrules') return;
    // WordPress's localized config (…-js-extra/-before/-after), the emoji
    // loader, and inline code that needs jQuery or Elementor.
    if (s.attr('id') || /wp-emoji|jQuery|elementor|\(function\s*\(\s*\$|lazyloadRunObserver/.test(code)) s.remove();
  });
  return $.html();
}
