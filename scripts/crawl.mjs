// Crawls the locally running WordPress site and saves each page's rendered
// HTML, <head> tags (SEO metadata, styles, scripts) and referenced assets.
//
// Usage: WP_ORIGIN=http://localhost:8081 node scripts/crawl.mjs [--only=/path]
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import http from 'node:http';
import * as cheerio from 'cheerio';

const ROOT = path.resolve(import.meta.dirname, '..');
const DATA = path.join(ROOT, 'data');
const WP_ORIGIN = process.env.WP_ORIGIN || 'http://localhost:8081';
// Hosts WordPress may print into its markup (WP_HOME is localhost:8080).
const WP_HOSTS = ['localhost:8080', 'localhost:8081', 'zentrades.pro', 'www.zentrades.pro'];
const CONCURRENCY = Number(process.env.CONCURRENCY || 8);
const only = process.argv.find((a) => a.startsWith('--only='))?.slice(7);
// --missing: crawl only URLs not yet in data/manifest.json and merge results.
const missingOnly = process.argv.includes('--missing');

// Head tags carry absolute URLs (canonical, og:url, JSON-LD) so they get a
// placeholder that is swapped for the production domain at render time.
// Everything else (links, images, inline config) becomes root-relative.
const SITE = '__SITE_URL__';

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const hostAlt = WP_HOSTS.map(escapeRe).join('|');
const plainRe = new RegExp(`https?://(?:${hostAlt})`, 'g');
// Same URLs as they appear inside JSON strings: http:\/\/host
const jsonRe = new RegExp(String.raw`https?:\\\/\\\/(?:` + hostAlt + ')', 'g');
const encRe = new RegExp(`https?%3A%2F%2F(?:${WP_HOSTS.map((h) => escapeRe(encodeURIComponent(h))).join('|')})`, 'gi');

function relativize(s) {
  return s.replace(plainRe, '').replace(jsonRe, '').replace(encRe, '');
}

function absolutize(s) {
  return s
    .replace(plainRe, SITE)
    .replace(jsonRe, SITE.replace(/\//g, '\\/'))
    .replace(encRe, encodeURIComponent(SITE));
}

// ASCII whitespace only: filenames can contain Unicode spaces (macOS
// screenshots use U+202F before "PM").
const ASSET_RE = /\/(?:wp-content|wp-includes)\/[^"'()\t\n\r\f <>\\?#,]+/g;
const assets = new Set();

function collectAssets(s) {
  for (const m of s.matchAll(ASSET_RE)) assets.add(m[0]);
}

// Head tags that point at absolute site URLs and must stay absolute.
function isAbsoluteHeadTag(tag, attrs) {
  if (tag === 'link' && /^(canonical|alternate|shortlink|prev|next)$/i.test(attrs.rel || '')) return true;
  if (tag === 'meta') return true;
  if (tag === 'script' && /ld\+json/i.test(attrs.type || '')) return true;
  return false;
}

function parsePage(html) {
  const $ = cheerio.load(html, { decodeEntities: false });
  const head = [];
  $('head')
    .children()
    .each((_, el) => {
      const tag = el.tagName?.toLowerCase();
      if (!tag) return;
      const attrs = { ...el.attribs };
      if (tag === 'meta' && attrs.charset) return;
      const inner = ['style', 'script', 'title', 'noscript'].includes(tag) ? $(el).html() || '' : '';
      const abs = isAbsoluteHeadTag(tag, attrs);
      const fix = abs ? absolutize : relativize;
      const fixedAttrs = Object.fromEntries(Object.entries(attrs).map(([k, v]) => [k, fix(v)]));
      head.push({ tag, attrs: fixedAttrs, inner: fix(inner) });
    });

  const htmlAttrs = { ...$('html').attr() };
  const bodyAttrs = { ...$('body').attr() };
  const body = relativize($('body').html() || '');
  const title = $('head > title').first().text();
  const robots = $('meta[name="robots"]').attr('content') || '';

  collectAssets(JSON.stringify(head));
  collectAssets(body);
  return { lang: htmlAttrs.lang || 'en-US', htmlAttrs, bodyAttrs, head, body, title, robots };
}

function fileNameFor(p) {
  const slug = p === '/' ? 'index' : p.replace(/^\/|\/$/g, '').replace(/[^a-zA-Z0-9-_]+/g, '__');
  const short = slug.length > 120 ? slug.slice(0, 100) + '-' + createHash('md5').update(slug).digest('hex').slice(0, 8) : slug;
  return short + '.json';
}

// WordPress redirects any request whose Host differs from WP_HOME, so the
// crawl server is asked for pages as if it were localhost:8080. fetch() can't
// override Host, hence node:http.
function get(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, { headers: { host: 'localhost:8080' }, timeout: 180_000 }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () =>
        resolve({
          status: res.statusCode,
          headers: { get: (k) => res.headers[k.toLowerCase()] },
          text: async () => Buffer.concat(chunks).toString('utf8'),
        }),
      );
    });
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', reject);
  });
}

async function fetchOnce(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await get(url);
    } catch (e) {
      if (attempt === 3) throw e;
    }
  }
}

// Some URLs live with a trailing slash and some without; when WordPress
// redirects to the other form of the same path, follow it.
async function fetchPage(p) {
  let url = WP_ORIGIN + (p === '/' ? '/' : p + '/');
  for (let hop = 0; hop < 3; hop++) {
    const res = await fetchOnce(url);
    if (res.status < 300 || res.status >= 400) return res;
    const loc = relativize(res.headers.get('location') || '/');
    if ((loc.replace(/\/$/, '') || '/') !== p) return res;
    url = WP_ORIGIN + loc;
  }
  return fetchOnce(url);
}

async function main() {
  const urls = JSON.parse(await readFile(path.join(ROOT, 'scripts/urls.json'), 'utf8'));
  const existing = JSON.parse(await readFile(path.join(DATA, 'manifest.json'), 'utf8').catch(() => '{}'));
  const partial = Boolean(only || missingOnly);
  const list = only ? urls.filter((u) => u.path === only) : missingOnly ? urls.filter((u) => !existing[u.path]) : urls;
  if (!partial) await rm(path.join(DATA, 'pages'), { recursive: true, force: true });
  await mkdir(path.join(DATA, 'pages'), { recursive: true });

  const manifest = {};
  const redirects = [];
  const failures = [];
  let done = 0;
  const queue = [...list];

  async function worker() {
    while (queue.length) {
      const u = queue.shift();
      try {
        const res = await fetchPage(u.path);
        if (res.status >= 300 && res.status < 400) {
          const loc = relativize(res.headers.get('location') || '/').replace(/\/$/, '') || '/';
          if (loc !== u.path) redirects.push({ source: u.path, destination: loc, permanent: res.status === 301 || res.status === 308 });
        } else if (res.status === 200) {
          const page = parsePage(await res.text());
          const file = fileNameFor(u.path);
          // Stored gzipped (~11x smaller); lib/wp.ts reads <file>.gz.
          await writeFile(path.join(DATA, 'pages', file + '.gz'), gzipSync(JSON.stringify({ path: u.path, type: u.type, ...page }), { level: 9 }));
          manifest[u.path] = { file, type: u.type, modified: u.modified, title: page.title, noindex: /noindex/i.test(page.robots) };
        } else {
          failures.push({ path: u.path, status: res.status });
        }
      } catch (e) {
        failures.push({ path: u.path, error: String(e) });
      }
      if (++done % 50 === 0) console.log(`${done}/${list.length}`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  // WordPress's own 404 template, reused as the Next.js not-found page.
  const nf = await get(WP_ORIGIN + '/__nextjs-migration-404-probe__/');
  await writeFile(path.join(DATA, '404.json'), JSON.stringify({ path: '/404', type: '404', ...parsePage(await nf.text()) }));

  if (partial) {
    await writeFile(path.join(DATA, 'manifest.json'), JSON.stringify({ ...existing, ...manifest }, null, 1));
    const prevAssets = JSON.parse(await readFile(path.join(DATA, 'assets.json'), 'utf8').catch(() => '[]'));
    await writeFile(path.join(DATA, 'assets.json'), JSON.stringify([...new Set([...prevAssets, ...assets])].sort(), null, 1));
  } else {
    await writeFile(path.join(DATA, 'manifest.json'), JSON.stringify(manifest, null, 1));
    await writeFile(path.join(DATA, 'crawl-redirects.json'), JSON.stringify(redirects, null, 1));
    await writeFile(path.join(DATA, 'assets.json'), JSON.stringify([...assets].sort(), null, 1));
  }
  await writeFile(path.join(DATA, 'crawl-failures.json'), JSON.stringify(failures, null, 1));
  console.log(`pages: ${Object.keys(manifest).length}, redirects: ${redirects.length}, failures: ${failures.length}, assets: ${assets.size}`);
}

main();
