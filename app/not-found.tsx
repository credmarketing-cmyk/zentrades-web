import { loadNotFoundPage } from '@/lib/wp';
import { BodyClass, WpHead } from '@/lib/wp-react';
import { applySiteChrome } from '@/lib/chrome';

// WordPress's 404 template, with its theme styles, header and footer.
export default function NotFound() {
  const page = loadNotFoundPage();
  return (
    <>
      <WpHead page={page} />
      <BodyClass className={page.bodyAttrs.class} />
      <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: applySiteChrome(page.body, '/404') }} />
    </>
  );
}
