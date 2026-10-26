import * as cheerio from 'cheerio';
import type { Element } from 'domhandler';
import { getManifest } from '@/lib/wp';

export type NavLink = { label: string; href: string; desc?: string };
export type NavGroup = { heading?: string; links: NavLink[] };
export type NavPromo = { image: string; alt: string; text: string; href: string };
export type NavItem = {
  label: string;
  href?: string;
  groups: NavGroup[];
  /** "All Industries", "All Features"… shown as the dropdown's footer link. */
  all?: NavLink;
  promo?: NavPromo;
};
export type NavData = {
  logo: { src: string; alt: string; href: string };
  items: NavItem[];
  login?: { label: string; href: string };
  cta?: { label: string; href: string };
};

const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

// Menu text the WordPress editors typed with typos or odd casing.
const LABEL_FIXES: Record<string, string> = {
  'recurring inpsection': 'Recurring Inspection',
  'invoicing & estimate': 'Invoicing & Estimates',
  intigrations: 'Integrations',
  intogrations: 'Integrations',
  trades: 'Trades',
  compliance: 'Compliance',
};
const fixLabel = (s: string) => LABEL_FIXES[s.toLowerCase()] ?? s;

// Reads the current WordPress header (an Elementor mega menu) into plain data,
// so the redesigned nav keeps exactly the same menus, links and promos.
export function extractNav(body: string, logoHref = '/'): NavData | null {
  const $ = cheerio.load(`<body>${body}</body>`, null, false);
  // The site header: #masthead, or the same header template embedded in the
  // page content (Elementor canvas pages).
  let mh = $('#masthead').first();
  if (!mh.length) mh = $('[data-elementor-post-type="elementor-hf"]').filter((_, el) => $(el).find('.e-n-menu').length > 0).first();
  if (!mh.length) return null;

  const logoImg = mh
    .find('.elementor-widget-image img')
    .filter((_, el) => !$(el).closest('.e-n-menu-content').length)
    .first();

  const items: NavItem[] = [];
  mh.find('.e-n-menu-item').each((_, it) => {
    const label = clean($(it).find('.e-n-menu-title-text').first().text());
    if (!label || items.some((i) => i.label === label)) return;
    const href = $(it).find('.e-n-menu-title a, a.e-n-menu-title-container').first().attr('href');
    const content = $(it).find('.e-n-menu-content').first();

    // Promo card: the container holding the menu's image.
    const img = content.find('.elementor-widget-image img').first();
    const promoCon = img.length ? img.closest('.e-con') : null;
    const promoEl = promoCon?.get(0);
    const inPromo = (el: Element) => !!promoEl && $(el).parents().addBack().toArray().includes(promoEl);
    const promo: NavPromo | undefined =
      img.length && promoCon
        ? {
            image: img.attr('src') || '',
            alt: img.attr('alt') || '',
            text: clean(promoCon.find('.elementor-widget-heading, .elementor-widget-text-editor').text()),
            href: promoCon.find('a[href]').first().attr('href') || href || '#',
          }
        : undefined;

    const toLink = (w: Element): NavLink | null => {
      const a = $(w).find('a[href]').first();
      if (!a.length) return null;
      const title = clean($(w).find('.elementor-icon-box-title').text()) || clean(a.text());
      const desc = clean($(w).find('.elementor-icon-box-description').text());
      return { label: fixLabel(title), href: a.attr('href')!, ...(desc ? { desc } : {}) };
    };

    // Link columns: icon-box links grouped by the element that holds them
    // (a container, or its .e-con-inner wrapper when the container is boxed).
    const byParent = new Map<Element, NavLink[]>();
    content.find('.elementor-widget-icon-box').each((__, w) => {
      if (inPromo(w)) return;
      const link = toLink(w);
      if (!link) return;
      const parent = w.parent as Element;
      if (!byParent.has(parent)) byParent.set(parent, []);
      byParent.get(parent)!.push(link);
    });
    const columns = [...byParent.values()];

    let all: NavLink | undefined;
    const isAll = (l: NavLink) => /^(all|see all)\b/i.test(l.label);
    for (const col of columns) {
      const i = col.findIndex(isAll);
      if (i >= 0) all = col.splice(i, 1)[0];
    }
    const cols = columns.filter((c) => c.length);

    const headings = content
      .find('.elementor-widget-heading')
      .filter((__, w) => !inPromo(w) && !$(w).find('a[href]').length)
      .map((__, w) => fixLabel(clean($(w).text())))
      .get()
      .filter(Boolean);

    const groups: NavGroup[] =
      headings.length === cols.length && cols.length > 1
        ? cols.map((links, i) => ({ heading: headings[i], links }))
        : [{ links: cols.flat() }];

    items.push({
      label,
      ...(href ? { href } : {}),
      groups: groups.filter((g) => g.links.length),
      ...(all ? { all } : {}),
      ...(promo ? { promo } : {}),
    });
  });

  const buttons = mh
    .find('.elementor-widget-button a[href]')
    .map((_, a) => ({ label: clean($(a).text()), href: $(a).attr('href')! }))
    .get();
  const login = buttons.find((b) => /log\s?in/i.test(b.label));
  const cta = buttons.find((b) => /demo/i.test(b.label)) ?? buttons.find((b) => b !== login);

  return {
    logo: { src: logoImg.attr('src') || '', alt: logoImg.attr('alt') || 'ZenTrades', href: logoHref },
    items,
    login,
    cta,
  };
}

// Menu links the WordPress site itself has broken.
const LINK_FIXES: Record<string, string> = { '/case-studies': '/case-study' };

const norm = (s: string) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, ' ').trim();

// Feature menu labels -> slugs of the per-vertical feature pages
// (/zenhvac/features/<slug>…), most specific first.
const FEATURE_SLUGS: [RegExp, string[]][] = [
  [/^all features?$|^see all features$/, ['all-feature']],
  [/^invoicing and estimates?$/, ['estimate-proposals', 'estimates', 'electrical-invoicing-software', 'invoicing-payments', 'invoicing-and-payments']],
  [/^online payments?$/, ['payments', 'invoicing-payments', 'invoicing-and-payments']],
  [/^schedul/, ['scheduling', 'electrical-scheduling-software']],
  [/^crew management$/, ['crew-management', 'time-cards']],
  [/^project management$/, ['project-management']],
  [/^inventory management$/, ['inventory-management']],
  [/^recurring inspections?$/, ['recurring-inspection', 'service-agreement', 'maintenance-agreement']],
  [/^job costing$/, ['job-costing']],
];

// General ZenTrades feature pages, when a vertical has no page of its own.
const GENERAL_FEATURES: [RegExp, string][] = [
  [/^all features?$|^see all features$/, '/feature/all-feature'],
  [/^invoicing and estimates?$/, '/feature/estimate-proposals'],
  [/^online payments?$/, '/feature/quickbooks-integration'],
  [/^schedul/, '/feature/scheduling-and-dispatching'],
  [/^crew management$/, '/feature/crew-management'],
  [/^project management$/, '/feature/project-management'],
  [/^inventory management$/, '/features/inventory-management'],
  [/^recurring inspections?$/, '/feature/recurring-inspection'],
  [/^job costing$/, '/feature/estimating-and-invoicing'],
];

/**
 * Resolves a menu link to a page that exists. The WordPress menus link to
 * feature URLs that were never published (/zenhvac/feature/crew-management…);
 * WordPress then guesses a redirect, often to another vertical. Instead, a
 * dead link goes to the same feature in its own vertical, then the general
 * feature page, then `fallback` (the page's Book a Demo).
 */
export function resolveLink(href: string, label: string, verticalSlug: string | null, fallback: string): string {
  if (!href.startsWith('/')) return href;
  const pages = getManifest();
  const p = href.replace(/\/+$/, '') || '/';
  if (LINK_FIXES[p]) return LINK_FIXES[p];
  if (pages[p]) return p;
  const n = norm(label);
  if (verticalSlug) {
    const slugs = FEATURE_SLUGS.find(([re]) => re.test(n))?.[1] ?? [];
    for (const slug of slugs) if (pages[`/${verticalSlug}/features/${slug}`]) return `/${verticalSlug}/features/${slug}`;
  }
  const general = GENERAL_FEATURES.find(([re]) => re.test(n))?.[1];
  if (general && pages[general]) return general;
  return fallback;
}

// zenhvac / zenfire / … from the vertical logo, for vertical feature pages.
export function verticalSlugOf(nav: NavData): string | null {
  const logo = nav.logo.src.toLowerCase();
  return /fire/.test(logo) ? 'zenfire' : /hvac/.test(logo) ? 'zenhvac' : /plumbing/.test(logo) ? 'zenplumbing' : /electrical/.test(logo) ? 'zenelectrical' : null;
}

// Keeps nav links pointing at pages that exist (see resolveLink).
export function repairNav(nav: NavData): NavData {
  const v = verticalSlugOf(nav);
  const fallback = nav.cta?.href ?? '/';
  const fix = (href: string, label: string) => resolveLink(href, label, v, fallback);
  return {
    ...nav,
    items: nav.items.map((it) => ({
      ...it,
      ...(it.href ? { href: fix(it.href, it.label) } : {}),
      groups: it.groups.map((g) => ({ ...g, links: g.links.map((l) => ({ ...l, href: fix(l.href, l.label) })) })),
      ...(it.all ? { all: { ...it.all, href: fix(it.all.href, it.all.label) } } : {}),
      ...(it.promo ? { promo: { ...it.promo, href: fix(it.promo.href, '') } } : {}),
    })),
  };
}
