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
| `FORMS_WEBHOOK_URL` | Optional. Where checklist/form submissions are sent (JSON POST). See "Checklists, forms and post grids". |
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

Seven pages run as React components converted from the Claude Design export
("ZenTrades Homepage Redesign"): `/`, `/zenhvac`, `/zenplumbing`,
`/zenelectrical`, `/elevator`, `/trades/water-restoration-software`, and `/zenfire`
(from the second export, "ZenTrades Homepage Redesign 2").

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
- Layout: content is 1250px wide with a 16–20px side gutter (`--zt-gutter`, set
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
  The big footer logo follows the vertical.

### Blog articles

All ~400 blog articles (the `/blog/` sections of every vertical, guides,
private-equity posts and standalone articles) use the "Blog Article" layout
from the second redesign export, rendered by `lib/blog.ts` from each post's own
WordPress content:

- hero (back to the vertical's blog, category, read time, title, intro),
  sticky "On this page" table of contents with reading progress
  (`/zt-blog.js`), numbered sections, key-takeaways box, template-download
  cards, FAQ, "Keep reading" (related posts from the same blog) and a demo CTA;
- the post's Elementor markup is read into plain blocks (headings, paragraphs,
  images, lists, tables); old hero text, table-of-contents widgets, sidebar
  forms and "See all blogs" / newsletter promos are dropped;
- checklists, forms, templates, case studies and comparisons keep their own
  layouts (`isArticle` in `lib/blog.ts`).

### Checklists, forms and post grids

WordPress plugin shortcodes in the crawled pages are replaced with native
versions (`lib/shortcodes.ts`), because the Forminator and YMC Filter plugins
weren't part of the WordPress backup:

- `[forminator_form]` checklists (649 inspection checklists on ~654 pages):
  rendered from `data/forms.json.gz` by `lib/forms.ts` as server-side HTML, so
  every question is indexable page text. `/zt-forms.js` adds Yes / No / N/A
  answers, a progress bar, saving progress in the browser, Clear, and
  **Print / Save as PDF** (prints a clean report of just the checklist).
- Short forms (the blog-sidebar questionnaire on 20 posts, one lead form):
  submit to `app/api/forms/route.ts`.
- `[forminator_quiz]`: the conference quiz on `/zenfire/blog/fire-conferences-in-2025`.
- `[ymc_filter]`: the Private Equity post grid (`lib/post-grid.ts`, `data/post-grids.json`).

**Submissions are off until configured.** Set `FORMS_WEBHOOK_URL` (a Zapier /
Make / HubSpot / CRM webhook) and `/api/forms` forwards each submission there as
JSON (`formId`, `kind`, `page`, `data`, `submittedAt`); checklists then also
show a Submit button. Without it, short forms show an email fallback and
checklists offer Print / Save as PDF only.

### Performance

- **No WordPress assets where they aren't used.** The React pages and blog
  posts in the article layout are entirely our own markup, so they skip the
  theme and plugin stylesheets, jQuery and Elementor scripts (`lib/lean.ts`).
  SEO tags, JSON-LD, HubSpot and tracking stay. Other migrated pages
  (checklists, comparisons, case studies) still use Elementor's CSS.
- **Images** in `public/redesign/` are WebP, at most 1600px wide. Convert new
  ones the same way before adding them.
- **404 page:** `app/global-not-found.tsx` holds the WordPress 404 design.
  `app/not-found.tsx` is kept tiny on purpose: Next.js embeds it in every React
  page.
- Google Fonts and icon-font stylesheets load without blocking the first paint
  (`lib/wp.ts`), and `/wp-content`, `/wp-includes` and `/redesign` files are
  sent with long cache headers (`next.config.ts`).

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
