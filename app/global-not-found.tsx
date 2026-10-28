import { loadNotFoundPage } from '@/lib/wp';
import { WpHead } from '@/lib/wp-react';
import { applySiteChrome } from '@/lib/chrome';
import { CHATBOT, GOOGLE_TAG_ID, GTAG_INLINE, GTM_INLINE, OFFER_SCRIPT, TRACKING_BODY } from '@/lib/tracking';

// WordPress's 404 template, with its theme styles, header and footer, for any
// URL that isn't a page. As a global 404 it renders outside the root layout,
// so it brings its own tracking; and it isn't sent along with every other page
// (app/not-found.tsx is, which is why that one is kept tiny).
export default function GlobalNotFound() {
  const page = loadNotFoundPage();
  return (
    <html lang="en-US">
      <head>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`} />
        <script dangerouslySetInnerHTML={{ __html: GTAG_INLINE }} />
        <script dangerouslySetInnerHTML={{ __html: GTM_INLINE }} />
        <script async src={CHATBOT.src} data-widget-key={CHATBOT.widgetKey} />
        <script defer src={OFFER_SCRIPT} />
      </head>
      {/* Laid out like the root layout + a page: the WordPress head tags go in
          the body (React hoists title/meta/link), since its inline scripts add
          elements to <head> before hydration. */}
      <body className={page.bodyAttrs.class} suppressHydrationWarning>
        <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: TRACKING_BODY }} />
        <WpHead page={page} />
        <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: applySiteChrome(page.body, '/404') }} />
      </body>
    </html>
  );
}
