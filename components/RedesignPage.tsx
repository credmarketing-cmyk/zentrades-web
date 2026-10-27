import type { ComponentType } from 'react';
import { loadPage, SITE_URL } from '@/lib/wp';
import { BodyClass, splitWpBody, WpHead } from '@/lib/wp-react';
import { chromeFromBody, renderFooter, renderNav } from '@/lib/chrome';
import DemoModal from '@/components/DemoModal';
import pages from '@/components/redesign/pages.json';

// Puts the WordPress theme's styles back to browser defaults inside the
// redesigned sections, then reapplies the design's own base styles. Inline
// styles and the generated :hover/:active rules still win over this.
const BASE_CSS = `
body .zt-rd, body .zt-rd *:not(svg, svg *) { all: revert; box-sizing: border-box; }
body .zt-rd.zt-rd { --zt-gutter: clamp(24px, 6vw, 80px); display: block; background: #FFFFFF; color: #010101; font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
body .zt-rd.zt-rd a { color: #010101; text-decoration: none; }
body .zt-rd.zt-rd a:hover { color: #EE5566; }
`;

const FONTS = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Geist+Mono:wght@500&display=swap';

type Props = {
  path: string;
  Design: ComponentType<{ links: Record<string, string> }>;
};

// A page rebuilt from the redesign: the site navigation and footer (same as
// every page of its vertical), the page's SEO tags and the new page body.
export default function RedesignPage({ path, Design }: Props) {
  const wp = loadPage(path);
  if (!wp) throw new Error(`No crawled WordPress data for ${path}`);
  const chrome = splitWpBody(wp.body);
  // Same nav and footer as every other page of this vertical (lib/chrome.ts).
  const chromeData = chromeFromBody(wp.body, path);
  const jsonLd = pages.find((p) => p.path === path)?.jsonLd ?? [];
  const { class: pageClass, ...pageAttrs } = chrome.pageAttrs;

  return (
    <>
      <WpHead page={wp} />
      {jsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld.replaceAll('https://zentrades.pro', SITE_URL) }} />
      ))}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="stylesheet" href={FONTS} />
      <style dangerouslySetInnerHTML={{ __html: BASE_CSS }} />
      <BodyClass className={wp.bodyAttrs.class} />
      <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: chrome.before }} />
      {chromeData ? (
        <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: renderNav(chromeData.nav, path) }} />
      ) : (
        <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: chrome.header }} />
      )}
      <div {...pageAttrs} className={pageClass}>
        {/* Page links, with dead menu links repaired like the nav/footer ones. */}
        <Design links={{ ...chrome.links, ...(chromeData?.links ?? {}) }} />
      </div>
      {chromeData && <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: renderFooter(chromeData.links, chromeData.vertical) }} />}
      <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: chrome.after }} />
      <DemoModal />
    </>
  );
}
