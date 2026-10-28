import type { NextConfig } from 'next';
import { existsSync, readFileSync } from 'node:fs';

type Redirect = { source: string; destination: string; permanent: boolean; regex?: boolean };

function readRedirects(file: string): Redirect[] {
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : [];
}

// Next.js path patterns treat ":" "(" ")" "{" "}" "*" "+" "?" as syntax.
const escapePath = (p: string) => p.replace(/[:(){}*+?]/g, '\\$&');

const wpBackend = process.env.WP_BACKEND_URL?.replace(/\/$/, '');

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Unknown URLs render app/global-not-found.tsx, which (unlike not-found.tsx)
  // isn't embedded in every page.
  experimental: { globalNotFound: true },
  // Page data is read from disk by the catch-all route and the 404 layout.
  outputFileTracingIncludes: { '/**': ['./data/**/*'] },

  async redirects() {
    const rules = [
      // Redirection plugin rules exported from WordPress.
      ...readRedirects('data/redirects.json'),
      // Redirects WordPress issued while crawling (e.g. Permalink Manager).
      ...readRedirects('data/crawl-redirects.json'),
    ]
      .filter((r) => !r.regex && r.source !== r.destination)
      // WordPress sent 301/302; keep the same codes rather than Next's 308/307.
      .map((r) => ({ source: escapePath(r.source), destination: r.destination, statusCode: r.permanent ? 301 : 302 }) as const);

    return [
      // Vercel's own addresses (the project and every build's URL) go to the
      // real domain, so visits there aren't tracked or indexed separately.
      {
        source: '/:path*',
        has: [{ type: 'host', value: '(?<host>.+)\\.vercel\\.app' }],
        destination: 'https://zentrades.pro/:path*',
        permanent: true,
      },
      ...rules,
      // Old AIOSEO sitemap locations.
      { source: '/inx_sitemap.xml', destination: '/sitemap.xml', statusCode: 301 },
      { source: '/sitemap_index.xml', destination: '/sitemap.xml', statusCode: 301 },
      { source: '/:type(post|page|category|post_tag)-sitemap.xml', destination: '/sitemap.xml', statusCode: 301 },
    ];
  },

  // Browser caching for the static files (otherwise sent with max-age=0, so
  // every visit re-checks each stylesheet, script, font and image). Theme and
  // plugin files never change; uploads and redesign images rarely do.
  async headers() {
    const cache = (source: string, maxAge: number) => ({
      source,
      headers: [{ key: 'Cache-Control', value: `public, max-age=${maxAge}, stale-while-revalidate=86400` }],
    });
    const YEAR = 31536000;
    const MONTH = 2592000;
    return [
      cache('/wp-includes/:path*', YEAR),
      cache('/wp-content/plugins/:path*', YEAR),
      cache('/wp-content/themes/:path*', YEAR),
      cache('/wp-content/uploads/:path*', MONTH),
      cache('/redesign/:path*', MONTH),
    ];
  },

  async rewrites() {
    if (!wpBackend) return [];
    return [
      { source: '/wp-admin/admin-ajax.php', destination: `${wpBackend}/wp-admin/admin-ajax.php` },
      { source: '/wp-json/:path*', destination: `${wpBackend}/wp-json/:path*` },
    ];
  },
};

export default nextConfig;
