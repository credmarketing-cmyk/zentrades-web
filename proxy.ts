import { NextResponse, type NextRequest } from 'next/server';
import wpIds from '@/data/wp-ids.json';

const pageById = wpIds as Record<string, string>;

const GONE_HTML = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Page removed – ZenTrades</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;font-family:Inter,system-ui,sans-serif;background:#fff;color:#010101;text-align:center;padding:24px}h1{font-size:clamp(28px,4vw,44px);letter-spacing:-.03em;margin:0 0 12px}p{color:#5E5853;margin:0 0 28px;font-size:17px}a{display:inline-block;background:#010101;color:#fff;text-decoration:none;padding:14px 24px;border-radius:12px;font-weight:600}a:hover{background:#EE5566}</style></head>
<body><main><h1>This page has been removed</h1><p>The page you’re looking for no longer exists.</p><a href="/">Go to ZenTrades</a></main></body></html>`;

export function proxy(request: NextRequest) {
  const { pathname, search, searchParams } = request.nextUrl;

  // WordPress shortlinks (/?p=9704, /?page_id=…, /?attachment_id=…) used to
  // redirect to the post. Here they would just show the homepage, so Google
  // indexed them as copies of it. Send each to its page (data/wp-ids.json,
  // from the pages' shortlink tags); unknown or deleted IDs are gone (410).
  if (pathname === '/') {
    const id = searchParams.get('p') ?? searchParams.get('page_id') ?? searchParams.get('attachment_id');
    if (id !== null) {
      const target = /^\d+$/.test(id) ? pageById[id] : undefined;
      const url = request.nextUrl.clone();
      url.search = '';
      if (target) {
        url.pathname = target;
        return NextResponse.redirect(url, 301);
      }
      // Spam posts injected while the old WordPress site was hacked live on
      // in Google's index under these URLs: 410 Gone + noindex gets them
      // dropped faster than a 404.
      return new NextResponse(GONE_HTML, {
        status: 410,
        headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'noindex, nofollow', 'cache-control': 'public, max-age=3600' },
      });
    }
    return NextResponse.next();
  }

  // Page URLs are all lowercase, but links and typed URLs often aren't
  // (/zenHVAC/, /ZenFire/blog/…), and paths are case-sensitive, so those 404.
  // Send them to the lowercase URL instead. Files keep their case (uploads,
  // /NFPA.xml): the matcher skips asset folders and anything with an extension.
  const lower = pathname.toLowerCase();
  if (lower === pathname) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = lower.length > 1 ? lower.replace(/\/+$/, '') : lower;
  url.search = search;
  return NextResponse.redirect(url, 301);
}

export const config = {
  // The homepage (for shortlinks), and paths with a capital letter outside
  // asset folders and files.
  matcher: ['/', '/((?!_next/|api/|wp-content/|wp-includes/|wp-admin/|redesign/)(?=[^.]*[A-Z])[^.]*)'],
};
