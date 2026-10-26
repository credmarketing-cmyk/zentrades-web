# ZenTrades: Next.js

zentrades.pro migrated from WordPress (Elementor + AIOSEO) to Next.js.

Every published page, post, category and tag archive is served at the same URL
as on WordPress, with the same HTML, styling and SEO tags (title, meta
description, canonical, Open Graph, Twitter cards, robots, JSON-LD schema).

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

Copy `.env.example` to `.env.local` and set:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production origin used in canonical URLs, Open Graph, JSON-LD and the sitemap. Defaults to `https://zentrades.pro`. |
| `WP_BACKEND_URL` | Optional. A WordPress install that still processes form submissions and AJAX. `/wp-admin/admin-ajax.php` and `/wp-json/*` are proxied to it. |

## How it's put together

| Path | What it is |
| --- | --- |
| `data/manifest.json` | Every migrated URL → its data file, type, title, last-modified, noindex flag. |
| `data/pages/*.json.gz` | One gzipped file per URL: `<head>` tags (SEO metadata, styles, scripts), `<html>`/`<body>` attributes and the rendered body HTML. |
| `data/404.json` | The WordPress 404 template, used by `app/not-found.tsx`. |
| `data/redirects.json` | Redirection-plugin rules (301s). |
| `data/crawl-redirects.json` | Redirects WordPress issued during the crawl. |
| `app/[...slug]/route.ts` | Catch-all route: pre-renders every URL in the manifest at build time. |
| `app/sitemap.ts`, `app/robots.ts` | `/sitemap.xml` (indexable URLs only) and `/robots.txt`. |
| `next.config.ts` | Redirects, and proxy rewrites to `WP_BACKEND_URL`. |
| `public/wp-content`, `public/wp-includes` | CSS, JS, fonts and images the pages use, at their original paths. |

### Redesigned pages

Six pages run as React components converted from the Claude Design export
("ZenTrades Homepage Redesign"): `/`, `/zenhvac`, `/zenplumbing`,
`/zenelectrical`, `/elevator`, `/trades/water-restoration-software`.

- `components/redesign/*.jsx`: one component per page (layout, content, and the
  page's interactive state). Edit them directly.
- `components/RedesignPage.tsx`: wraps a design with the site nav and footer for
  its vertical, its AIOSEO tags (title, description, canonical, Open Graph,
  schema) and the design's FAQ schema.
- `lib/links.js`: maps button and footer labels ("Book a demo", "HVAC", "See all
  features"…) to real URLs, taken from each page's own menus, so every vertical
  links to its own demo, contact and feature pages. Homepage customer stories,
  feature list and integration tiles link to their case-study, feature and
  integration pages.
- Layout: content is 1400px wide with a 16–20px side gutter (`--zt-gutter`, set
  in `RedesignPage.tsx` and `lib/chrome.ts`).
- New images live in `public/redesign/`.
- Site navigation and footer (every page): see "Site nav and footer" below.
- `components/DemoModal.tsx`: "Product tour" / "Watch demo" buttons open the
  page's Supademo tour (read from the WordPress popup) in a modal.

### Site nav and footer

Every page (React and migrated) uses the redesigned navigation and footer,
built in `lib/chrome.ts` as plain HTML with `/zt-chrome.js` for dropdowns and
the mobile menu.

- Each page keeps its vertical (ZenTrades, ZenFire, ZenHVAC, ZenPlumbing,
  ZenElectrical): `lib/nav.ts` reads the menu, logo, Book a Demo and promos from
  that page's WordPress header. Pages without a header (tag/category archives)
  get their vertical's chrome; the four `/wdec` campaign landing pages are left
  unchanged.
- `resolveLink` (lib/nav.ts) fixes dead menu links: the WordPress menus point at
  feature URLs that were never published, so each feature goes to its own
  vertical's page (`/zenhvac/features/crew-management`), then the general
  feature page, then Book a Demo.
- Footer columns come from the redesign; labels resolve through `lib/links.js`.
  The big footer logo follows the vertical (ZenFire uses its site logo in white).

### Rebuilding a page in React

Add `app/<path>/page.tsx` (for example `app/zentrades-pricing/page.tsx`).
A specific route always takes priority over the catch-all, so pages can be
moved to real React components one at a time. Delete the page from
`data/manifest.json` once its replacement is live.

## Not migrated

- **Form submissions and AJAX.** Forminator, Elementor and HubSpot forms post to
  WordPress. They render, but submitting needs `WP_BACKEND_URL` (or replacing
  the forms with a Next.js API route / a hosted form service).
- **WordPress admin, login, search results, RSS feeds, comments.** There is no
  CMS anymore; content changes are made in `data/pages/*.json.gz` or by rebuilding
  pages in React.
- **Paginated archives** (`/category/x/page/2`). Only the first page of each
  category and tag archive is included.
