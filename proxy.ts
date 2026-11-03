import { NextResponse, type NextRequest } from 'next/server';

// Page URLs are all lowercase, but links and typed URLs often aren't
// (/zenHVAC/, /ZenFire/blog/…), and paths are case-sensitive, so those 404.
// Send them to the lowercase URL instead. Files keep their case (uploads,
// /NFPA.xml): the matcher skips asset folders and anything with an extension.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const lower = pathname.toLowerCase();
  if (lower === pathname) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = lower.length > 1 ? lower.replace(/\/+$/, '') : lower;
  url.search = search;
  return NextResponse.redirect(url, 301);
}

export const config = {
  // Only paths with a capital letter, outside asset folders and files.
  matcher: ['/((?!_next/|api/|wp-content/|wp-includes/|wp-admin/|redesign/)(?=[^.]*[A-Z])[^.]*)'],
};
