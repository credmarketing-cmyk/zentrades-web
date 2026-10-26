import type { ReactNode } from 'react';

// Shared by the React pages (the redesigned pages and the 404 page). Migrated
// WordPress pages are served by app/[...slug]/route.ts and don't use it. Each
// page renders its own WordPress head tags and body classes.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-US">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
