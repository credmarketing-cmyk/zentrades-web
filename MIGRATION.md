# WordPress → Next.js migration

Goal: move zentrades.pro off WordPress without losing Google rankings.

## SEO rules for every page

1. **Same URL.** The page path must match the live WordPress URL exactly (no trailing slash).
   Full list: `src/lib/routes.ts` and `../seo-baseline/current-site-urls.csv`.
2. **Same or better title / meta description.** Keep the keywords the old page ranked for.
   Set them with `pageMetadata()` from `src/lib/seo.ts`; this also sets canonical, Open Graph and Twitter tags.
3. **Exactly one `<h1>`** containing the page's main keyword.
4. **Keep the content.** Don't drop text sections that existed on the old page; thin pages lose rankings.
5. **Images:** use `next/image`, with descriptive `alt` text on every image.
6. **Internal links:** use `next/link` with the final URL (never a URL that redirects).
7. **Structured data:** add `JsonLd` with breadcrumbs on every page; add FAQ / Product / Article schema where it fits (`src/lib/schema.ts`).
8. When a page is finished, set `built: true` in `src/lib/routes.ts` so it appears in `sitemap.xml`.
9. If a URL is removed or renamed, add a 301 in `next.config.ts` → `redirects()`.

## Indexing safety

Preview and local builds send `noindex` and a blocking `robots.txt`.
Only the production deployment (`VERCEL_ENV=production`) or `ALLOW_INDEXING=true` is indexable.

## Launch checklist

- [ ] Every URL in `routes.ts` built or 301-redirected
- [ ] Analytics / Tag Manager / Search Console verification tags added
- [ ] Forms (book demo, contact) wired to the CRM
- [ ] Lighthouse SEO 100 and good Core Web Vitals on key pages
- [ ] DNS switched; sitemap submitted in Google Search Console
- [ ] Watch Search Console for 404s and coverage drops for 4–6 weeks
