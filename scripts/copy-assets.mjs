// Copies the static files the crawled pages need from the WordPress install
// into public/, keeping their /wp-content and /wp-includes paths.
//
// - Plugins/themes used by any page: all their static files (their scripts
//   lazy-load chunks, fonts and images that never appear in the HTML).
// - wp-includes: js, css, fonts and images.
// - Uploads: only files referenced by pages or by the CSS they load.
//
// Usage: WP_ROOT=/path/to/wordpress node scripts/copy-assets.mjs
import { readFile, readdir, mkdir, copyFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const WP_ROOT =
  process.env.WP_ROOT ||
  '/Users/zentrades/Downloads/b9117fab-fcef-4f14-9b99-1b6788e3c373_full_2026-10-26T13_43_22Z';

const STATIC_EXT = new Set(
  'css js mjs json woff woff2 ttf eot otf svg png jpg jpeg gif webp avif ico bmp mp4 webm mp3 ogg wav pdf txt xml lottie'.split(' '),
);
const isStatic = (f) => STATIC_EXT.has(path.extname(f).slice(1).toLowerCase());

let copied = 0;
let bytes = 0;
const missing = new Set();

async function copyOne(rel) {
  rel = decodeURIComponent(rel).replace(/^\/+/, '');
  const src = path.join(WP_ROOT, rel);
  const dest = path.join(PUBLIC, rel);
  if (!src.startsWith(WP_ROOT + path.sep) || !isStatic(src)) return false;
  if (existsSync(dest)) return true;
  if (!existsSync(src)) {
    missing.add('/' + rel);
    return false;
  }
  await mkdir(path.dirname(dest), { recursive: true });
  await copyFile(src, dest);
  copied++;
  bytes += (await stat(src)).size;
  return true;
}

async function copyTree(relDir) {
  const abs = path.join(WP_ROOT, relDir);
  if (!existsSync(abs)) return;
  for (const entry of await readdir(abs, { withFileTypes: true, recursive: true })) {
    if (!entry.isFile() || !isStatic(entry.name)) continue;
    const full = path.join(entry.parentPath, entry.name);
    await copyOne(path.relative(WP_ROOT, full));
  }
}

// url(...) and @import references inside a CSS file, resolved against it.
async function cssReferences(relCss) {
  const abs = path.join(WP_ROOT, relCss);
  if (!existsSync(abs)) return [];
  const css = await readFile(abs, 'utf8');
  const refs = [];
  for (const m of css.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)|@import\s+['"]([^'"]+)['"]/g)) {
    const ref = (m[1] || m[2]).trim();
    if (/^(data:|https?:|\/\/|#)/i.test(ref)) {
      const local = ref.match(/^https?:\/\/(?:localhost:\d+|(?:www\.)?zentrades\.pro)(\/.*)$/);
      if (local) refs.push(local[1].split(/[?#]/)[0]);
      continue;
    }
    const clean = ref.split(/[?#]/)[0];
    refs.push(clean.startsWith('/') ? clean : '/' + path.posix.join(path.posix.dirname(relCss), clean));
  }
  return refs;
}

async function main() {
  const assets = JSON.parse(await readFile(path.join(ROOT, 'data/assets.json'), 'utf8'));

  const trees = new Set(['wp-includes/js', 'wp-includes/css', 'wp-includes/fonts', 'wp-includes/images', 'wp-content/uploads/elementor']);
  for (const a of assets) {
    const m = a.match(/^\/wp-content\/(plugins|themes)\/([^/]+)\//);
    if (m) trees.add(`wp-content/${m[1]}/${m[2]}`);
  }
  for (const t of trees) {
    console.log('tree', t);
    await copyTree(t);
  }

  // Individually referenced files (mostly uploads), then whatever their CSS pulls in.
  const queue = [...assets];
  const seen = new Set();
  while (queue.length) {
    const a = queue.shift();
    if (seen.has(a)) continue;
    seen.add(a);
    const ok = await copyOne(a);
    if (ok && a.endsWith('.css')) queue.push(...(await cssReferences(a.replace(/^\//, ''))));
  }
  // CSS inside copied trees can also reference uploads (e.g. Elementor kit backgrounds).
  for (const t of trees) {
    const abs = path.join(WP_ROOT, t);
    if (!existsSync(abs)) continue;
    for (const entry of await readdir(abs, { withFileTypes: true, recursive: true })) {
      if (entry.isFile() && entry.name.endsWith('.css')) {
        for (const r of await cssReferences(path.relative(WP_ROOT, path.join(entry.parentPath, entry.name)))) await copyOne(r);
      }
    }
  }

  console.log(`copied ${copied} files (${(bytes / 1024 / 1024).toFixed(1)} MB), missing ${missing.size}`);
  if (missing.size) console.log([...missing].slice(0, 30).join('\n'));
}

main();
