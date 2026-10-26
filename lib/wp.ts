import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';

// Content crawled from the WordPress site.
const DATA_DIR = path.join(process.cwd(), 'data');

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://zentrades.pro').replace(/\/$/, '');

export type HeadTag = {
  tag: string;
  attrs: Record<string, string>;
  inner: string;
};

export type WpPage = {
  path: string;
  type: string;
  lang: string;
  htmlAttrs: Record<string, string>;
  bodyAttrs: Record<string, string>;
  head: HeadTag[];
  body: string;
  title: string;
  robots: string;
};

export type ManifestEntry = {
  file: string;
  type: 'home' | 'page' | 'post' | 'category' | 'post_tag';
  modified: string | null;
  title: string;
  noindex: boolean;
};

let manifest: Record<string, ManifestEntry> | undefined;

export function getManifest(): Record<string, ManifestEntry> {
  manifest ??= JSON.parse(readFileSync(path.join(DATA_DIR, 'manifest.json'), 'utf8'));
  return manifest!;
}

// Page files are stored gzipped (<file>.json.gz) to keep the repository small.
function readJson(file: string) {
  const gz = file + '.gz';
  return JSON.parse(existsSync(gz) ? gunzipSync(readFileSync(gz)).toString('utf8') : readFileSync(file, 'utf8'));
}

export function loadPage(pathname: string): WpPage | null {
  const entry = getManifest()[pathname];
  if (!entry) return null;
  return readJson(path.join(DATA_DIR, 'pages', entry.file));
}

export function loadNotFoundPage(): WpPage {
  return readJson(path.join(DATA_DIR, '404.json'));
}

// Head tags were saved with a placeholder for the site origin so canonical
// URLs, Open Graph tags and JSON-LD point at whichever domain this deploys to.
export function withSiteUrl(s: string): string {
  return s.replaceAll('__SITE_URL__', SITE_URL);
}

// Attribute values are stored exactly as WordPress printed them (entities
// still encoded), so only the delimiting quote needs escaping.
function attrsToString(attrs: Record<string, string>): string {
  return Object.entries(attrs)
    .map(([k, v]) => (v === '' ? ` ${k}` : ` ${k}="${v.replaceAll('"', '&quot;')}"`))
    .join('');
}

const VOID_TAGS = new Set(['meta', 'link', 'base']);

function headTagToString({ tag, attrs, inner }: HeadTag): string {
  const open = `<${tag}${attrsToString(attrs)}>`;
  return VOID_TAGS.has(tag) ? open : `${open}${inner}</${tag}>`;
}

export function renderDocument(page: WpPage): string {
  const head = page.head.map(headTagToString).join('\n');
  return withSiteUrl(
    `<!DOCTYPE html>\n<html${attrsToString(page.htmlAttrs)}>\n<head>\n<meta charset="UTF-8">\n${head}\n</head>\n` +
      `<body${attrsToString(page.bodyAttrs)}>${page.body}</body>\n</html>\n`,
  );
}
