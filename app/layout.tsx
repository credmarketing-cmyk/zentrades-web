import type { ReactNode } from 'react';
import { CHATBOT, GOOGLE_TAG_ID, GTAG_INLINE, GTM_INLINE, TRACKING_BODY } from '@/lib/tracking';

// Shared by the React pages (the redesigned pages and the 404 page). Migrated
// WordPress pages are served by app/[...slug]/route.ts and don't use it. Each
// page renders its own WordPress head tags and body classes; tracking and the
// chat widget (lib/tracking.ts) are added here for all of them.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-US">
      <head>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`} />
        <script dangerouslySetInnerHTML={{ __html: GTAG_INLINE }} />
        <script dangerouslySetInnerHTML={{ __html: GTM_INLINE }} />
        <script async src={CHATBOT.src} data-widget-key={CHATBOT.widgetKey} />
      </head>
      <body suppressHydrationWarning>
        <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: TRACKING_BODY }} />
        {children}
      </body>
    </html>
  );
}
