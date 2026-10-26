# ZenTrades website

Marketing site for [zentrades.pro](https://zentrades.pro), migrated from WordPress to Next.js.
See [MIGRATION.md](MIGRATION.md) for the SEO rules every page follows and the launch checklist.

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. `npm run build` checks a production build; `npm run lint` runs ESLint.

## Project layout

| Path | What lives there |
|---|---|
| `src/app/` | One folder per URL (`zenhvac/page.tsx` → `/zenhvac`), plus `sitemap.ts` and `robots.ts` |
| `src/content/` | Page copy (headlines, FAQs, features). Edit text here, not in the components |
| `src/components/` | Header, footer and reusable page sections |
| `src/lib/routes.ts` | Every URL from the old WordPress site; set `built: true` to add a page to the sitemap |
| `src/lib/links.ts` | All internal links in one place |
| `public/images/` | Images (served optimized through `next/image`) |

## Deploying (Vercel)

The Vercel project is connected to this GitHub repo:

- Push to `main` → production deployment.
- Push any other branch / open a PR → preview deployment with its own URL.

No `vercel.json` or environment variables are required; Vercel detects Next.js automatically.
Optional variables are documented in [.env.example](.env.example).

### Search engine safety

- Every `*.vercel.app` address sends `X-Robots-Tag: noindex`, so Google never indexes the Vercel copy.
- Preview deployments are also `noindex` in their HTML and `robots.txt`.
- Only the production deployment on the real domain (zentrades.pro) is indexable.

### Going live on zentrades.pro

1. Finish or 301-redirect every URL in `src/lib/routes.ts` (see the launch checklist in MIGRATION.md).
2. In Vercel → Project → Settings → Domains, add `zentrades.pro` and `www.zentrades.pro` (redirect `www` to the apex).
3. Update the DNS records at GoDaddy to the values Vercel shows.
4. Submit `https://zentrades.pro/sitemap.xml` in Google Search Console.
