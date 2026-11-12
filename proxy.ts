import { NextResponse, type NextRequest } from 'next/server';
import wpIds from '@/data/wp-ids.json';

const pageById = wpIds as Record<string, string>;

export function proxy(request: NextRequest) {
  const { pathname, search, searchParams } = request.nextUrl;

  // WordPress shortlinks (/?p=9704, /?page_id=…, /?attachment_id=…) used to
  // redirect to the post. Here they would just show the homepage, so Google
  // indexed them as copies of it. Send each to its page (data/wp-ids.json,
  // from the pages' shortlink tags); unknown or deleted IDs get the 404 page.
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
      url.pathname = '/wp-shortlink-not-found';
      return NextResponse.rewrite(url);
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
