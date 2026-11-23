import type { ComponentType, ReactNode } from 'react';
import { loadPage, SITE_URL, type WpPage } from '@/lib/wp';
import { BodyClass, splitWpBody, WpHead } from '@/lib/wp-react';
import { chromeFromBody, renderFooter, renderNav } from '@/lib/chrome';
import DemoModal from '@/components/DemoModal';
import pages from '@/components/redesign/pages.json';

// Same base styles as components/RedesignPage.tsx.
const BASE_CSS = `
body .zt-rd, body .zt-rd *:not(svg, svg *) { all: revert; box-sizing: border-box; }
body .zt-rd.zt-rd { --zt-gutter: clamp(24px, 6vw, 80px); display: block; background: #FFFFFF; color: #010101; font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
body .zt-rd.zt-rd a { color: #010101; text-decoration: none; }
body .zt-rd.zt-rd a:hover { color: #EE5566; }
`;
const FONTS = 'https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Geist+Mono:wght@500&display=swap';

type Props = {
  path: string;
  Design: ComponentType<{ links: Record<string, string> }>;
  /** Home page of the vertical whose nav and footer a new page uses. */
  vertical?: string;
  /** Rendered between the navigation and the page (e.g. an offer band). */
  top?: ReactNode;
};

type PageInfo = { path: string; jsonLd?: string[]; seo?: { title?: string; description?: string } };

// WordPress head without its FAQ schema: the old FAQ is not on the
// redesigned page (the design brings its own schema when it has an FAQ).
function wpHeadFor(wp: WpPage, dropFaq: boolean): WpPage {
  if (!dropFaq) return wp;
  const head = wp.head.flatMap((t) => {
    if (t.tag !== 'script' || t.attrs.type !== 'application/ld+json') return [t];
    try {
      const ld = JSON.parse(t.inner);
      if (ld['@type'] === 'FAQPage') return [];
      if (Array.isArray(ld['@graph'])) ld['@graph'] = ld['@graph'].filter((n: { '@type'?: string }) => n['@type'] !== 'FAQPage');
      return [{ ...t, inner: JSON.stringify(ld) }];
    } catch {
      return [t];
    }
  });
  return { ...wp, head };
}

/**
 * A page from the Claude Design redesign. Pages that existed on the old site
 * keep their SEO tags (title, description, canonical, schema); new pages use
 * the design's title and description. Every page gets the site navigation and
 * footer of its vertical (lib/chrome.ts).
 */
export default function DesignPage({ path, Design, vertical = '/', top }: Props) {
  const info = (pages as PageInfo[]).find((p) => p.path === path);
  const jsonLd = info?.jsonLd ?? [];
  const wp = loadPage(path);
  const home = loadPage(vertical);
  const source = wp ?? home;
  if (!source) throw new Error(`No page data for ${path} or ${vertical}`);
  const chromeData = chromeFromBody(source.body, wp ? path : vertical);
  const chrome = wp ? splitWpBody(wp.body) : null;
  const links = { ...(chrome?.links ?? {}), ...(chromeData?.links ?? {}) };
  const title = info?.seo?.title || 'ZenTrades';
  const description = info?.seo?.description || '';
  const url = SITE_URL + path;
  const { class: pageClass, ...pageAttrs } = chrome?.pageAttrs ?? { class: '' };

  return (
    <>
      {wp ? (
        <WpHead page={wpHeadFor(wp, true)} lean />
      ) : (
        <>
          <title>{title}</title>
          {description && <meta name="description" content={description} />}
          <meta name="robots" content="index, follow, max-image-preview:large" />
          <link rel="canonical" href={url} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={url} />
          <meta property="og:title" content={title} />
          {description && <meta property="og:description" content={description} />}
          <meta property="og:site_name" content="ZenTrades" />
          <meta name="twitter:card" content="summary_large_image" />
          <link rel="icon" href="/wp-content/uploads/2023/12/cropped-App-Icons-ZT_with-Curve-1-32x32.png" sizes="32x32" />
          <link rel="apple-touch-icon" href="/wp-content/uploads/2023/12/cropped-App-Icons-ZT_with-Curve-1-180x180.png" />
        </>
      )}
      {jsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld.replaceAll('https://zentrades.pro', SITE_URL) }} />
      ))}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="stylesheet" href={FONTS} />
      <style dangerouslySetInnerHTML={{ __html: BASE_CSS + 'body { margin: 0; }' }} />
      {wp && <BodyClass className={wp.bodyAttrs.class} />}
      {chrome && <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: chrome.before }} />}
      {chromeData ? (
        <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: renderNav(chromeData.nav, path) }} />
      ) : (
        chrome && <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: chrome.header }} />
      )}
      {top}
      <div {...pageAttrs} className={pageClass || undefined}>
        <Design links={links} />
      </div>
      {chromeData && <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: renderFooter(chromeData.links, chromeData.vertical) }} />}
      <DemoModal />
    </>
  );
}
