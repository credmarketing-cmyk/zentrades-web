// Compares the SEO tags of every migrated URL between the WordPress site and
// the Next.js build, after mapping both to the production domain.
//
// Usage: WP_ORIGIN=http://localhost:8081 NEXT_ORIGIN=http://localhost:3000 node scripts/verify-seo.mjs
import { readFile, writeFile } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import * as cheerio from 'cheerio';

const ROOT = path.resolve(import.meta.dirname, '..');
const WP_ORIGIN = process.env.WP_ORIGIN || 'http://localhost:8081';
const NEXT_ORIGIN = process.env.NEXT_ORIGIN || 'http://localhost:3000';
const SITE = 'https://zentrades.pro';

function get(url, host) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, { headers: host ? { host } : {}, timeout: 180_000 }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, location: res.headers.location, body: Buffer.concat(chunks).toString('utf8') }));
    });
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', reject);
  });
}

// WordPress pages are fetched with a trailing slash first, like the crawler did.
async function getWp(p) {
  let url = WP_ORIGIN + (p === '/' ? '/' : p + '/');
  for (let i = 0; i < 3; i++) {
    const res = await get(url, 'localhost:8080');
    if (res.status < 300 || res.status >= 400) return res;
    url = WP_ORIGIN + res.location.replace(/^https?:\/\/[^/]+/, '');
  }
  return get(url, 'localhost:8080');
}

const norm = (s) =>
  (s || '')
    .replace(/https?:\/\/localhost:\d+/g, SITE)
    .replace(/https?:\\\/\\\/localhost:\d+/g, SITE.replace(/\//g, '\\/'))
    .replace(/\s+/g, ' ')
    .trim();

function seo(html) {
  const $ = cheerio.load(html);
  const meta = {};
  $('meta[name], meta[property]').each((_, el) => {
    const k = $(el).attr('name') || $(el).attr('property');
    if (/^(generator|viewport)$/i.test(k)) return;
    meta[k] = norm($(el).attr('content'));
  });
  return {
    title: norm($('title').first().text()),
    canonical: norm($('link[rel="canonical"]').attr('href')),
    meta,
    // Parsed and re-serialized, so escaping differences (\/ vs /) don't count.
    jsonld: $('script[type="application/ld+json"]')
      .map((_, el) => {
        const raw = $(el).html();
        try {
          return norm(JSON.stringify(JSON.parse(raw)));
        } catch {
          return norm(raw);
        }
      })
      .get(),
    h1: norm($('h1').first().text()),
  };
}

function diff(a, b) {
  const out = [];
  for (const k of ['title', 'canonical', 'h1']) if (a[k] !== b[k]) out.push({ field: k, wp: a[k], next: b[k] });
  for (const k of new Set([...Object.keys(a.meta), ...Object.keys(b.meta)]))
    if (a.meta[k] !== b.meta[k]) out.push({ field: 'meta:' + k, wp: a.meta[k], next: b.meta[k] });
  if (a.jsonld.join('\n') !== b.jsonld.join('\n')) out.push({ field: 'json-ld', wp: a.jsonld.length + ' blocks', next: b.jsonld.length + ' blocks' });
  return out;
}

async function main() {
  const manifest = JSON.parse(await readFile(path.join(ROOT, 'data/manifest.json'), 'utf8'));
  const limit = Number(process.env.LIMIT || 0);
  const paths = Object.keys(manifest).filter((_, i, all) => !limit || i % Math.ceil(all.length / limit) === 0);
  const results = { ok: 0, mismatched: [], errors: [] };
  const queue = [...paths];

  async function worker() {
    while (queue.length) {
      const p = queue.shift();
      try {
        const [wp, nx] = await Promise.all([getWp(p), get(NEXT_ORIGIN + p)]);
        if (nx.status !== 200) {
          results.errors.push({ path: p, nextStatus: nx.status, wpStatus: wp.status });
          continue;
        }
        const d = diff(seo(wp.body), seo(nx.body));
        if (d.length) results.mismatched.push({ path: p, diffs: d });
        else results.ok++;
      } catch (e) {
        results.errors.push({ path: p, error: String(e) });
      }
    }
  }
  await Promise.all(Array.from({ length: 8 }, worker));
  await writeFile(path.join(ROOT, 'data/seo-verification.json'), JSON.stringify(results, null, 1));
  console.log(`checked ${paths.length}: identical ${results.ok}, mismatched ${results.mismatched.length}, errors ${results.errors.length}`);
  const fields = {};
  for (const m of results.mismatched) for (const d of m.diffs) fields[d.field] = (fields[d.field] || 0) + 1;
  console.log('mismatched fields:', fields);
  for (const m of results.mismatched.slice(0, 5)) console.log(m.path, JSON.stringify(m.diffs).slice(0, 400));
  for (const e of results.errors.slice(0, 5)) console.log('error', JSON.stringify(e));
}

main();
