import { getManifest, loadNotFoundPage, loadPage, renderDocument } from '@/lib/wp';
import { applySiteChrome, chromeFromBody } from '@/lib/chrome';
import { applyBlogTemplate, isArticle } from '@/lib/blog';
import { applyShortcodes } from '@/lib/shortcodes';
import redesigned from '@/components/redesign/pages.json';

// Every migrated WordPress URL is pre-rendered at build time from the crawled
// HTML. Unknown paths fall through to app/not-found.tsx.
//
// To rebuild a page in React, add app/<its-path>/page.tsx and list its path in
// components/redesign/pages.json (or exclude it below): a more specific route
// always wins over this catch-all.
export const dynamic = 'force-static';
export const dynamicParams = false;

const reactPages = new Set(['/', ...redesigned.map((p) => p.path)]);

export function generateStaticParams() {
  return Object.keys(getManifest())
    .filter((p) => !reactPages.has(p))
    .map((p) => ({ slug: p.slice(1).split('/') }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const pathname = '/' + slug.map(decodeURIComponent).join('/');
  const page = loadPage(pathname) ?? loadNotFoundPage();
  // Redesigned navigation and footer for the page's vertical.
  // Blog articles get the redesigned article layout; then native checklists,
  // forms and post grids replace plugin shortcodes; then the redesigned
  // navigation and footer for the page's vertical.
  // WordPress comments ("Leave a Reply") are not carried over.
  let body = page.body.replace(/<section id="comments" class="comments-area">[\s\S]*?<\/section>/g, '');
  const entry = getManifest()[pathname];
  if (entry && isArticle(pathname, entry.type)) {
    const demoHref = chromeFromBody(page.body, pathname)?.nav.cta?.href ?? '/book-demo';
    body = applyBlogTemplate({ ...page, body }, pathname, demoHref);
  }
  body = applyShortcodes(body, page.title);
  const withChrome = { ...page, body: applySiteChrome(body, page.path === '/404' ? '/404' : pathname) };

  return new Response(renderDocument(withChrome), {
    status: page.path === '/404' ? 404 : 200,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}
