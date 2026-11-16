import type { Metadata } from 'next';
import { loadPage, SITE_URL } from '@/lib/wp';
import { chromeFromBody, renderFooter, renderNav } from '@/lib/chrome';
import BlackFriday from '@/components/redesign/BlackFriday';

// Black Friday 2026 campaign page (Claude Design export, converted to
// components/redesign/BlackFriday.jsx). The design's own nav and footer are
// replaced by the ZenTrades site navigation and footer (lib/chrome.ts).
const PATH = '/black-friday';
const TITLE = 'Black Friday 2026: 3 Months Free on ZenTrades Field Service Software';
const DESCRIPTION =
  'Black Friday field service software deal: sign a 12-month ZenTrades plan by Cyber Monday, Nov 30, 2026 and get 3 extra months free.';
const FONTS =
  'https://fonts.googleapis.com/css2?family=Inter:wght@300..900&family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@500;700;800&display=swap';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: SITE_URL + PATH },
  robots: { index: true, follow: true },
  openGraph: { type: 'website', url: SITE_URL + PATH, title: TITLE, description: DESCRIPTION, siteName: 'ZenTrades' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

const PAGE_CSS = `
body { margin: 0; background: #0E0E10; }
/* HubSpot form inside the light claim card */
.zt-hsform { color: #0E0E10; font-family: 'Inter', system-ui, sans-serif; }
.zt-hsform a { color: #0E0E10; }
.zt-hsform .hs-form fieldset { max-width: none !important; }
.zt-hsform .hs-form-field { margin-bottom: 16px; }
.zt-hsform .hs-form-field > label { display: block; margin-bottom: 7px; font-size: 13px; font-weight: 700; }
.zt-hsform .hs-input:not([type=checkbox]):not([type=radio]) { width: 100% !important; height: 50px; border: 1.5px solid #DDD8CC; border-radius: 12px; padding: 0 14px; font-size: 16px; font-weight: 500; background: #FFFFFF; color: #0E0E10; outline: none; }
.zt-hsform textarea.hs-input { height: 110px !important; padding: 12px 14px !important; }
.zt-hsform .hs-input:focus { border-color: #0E0E10; }
.zt-hsform .hs-error-msgs { list-style: none; margin: 6px 0 0; padding: 0; font-size: 13px; font-weight: 700; color: #B4233A; }
.zt-hsform .hs-button { width: 100%; height: 58px; border: none; border-radius: 999px; background: #EE5566; color: #0E0E10; font-weight: 800; font-size: 17px; cursor: pointer; transition: transform .2s, background .2s; }
.zt-hsform .hs-button:hover { transform: translateY(-2px); background: #0E0E10; color: #F4F1EA; }
.zt-hsform .legal-consent-container, .zt-hsform .hs-richtext { font-size: 12px; color: #6B675F; }
.zt-hsform .submitted-message { font-size: 18px; font-weight: 700; text-align: center; padding: 60px 0; }
`;

export default function Page() {
  // ZenTrades (home page) navigation and footer.
  const home = loadPage('/');
  const chrome = home ? chromeFromBody(home.body, '/') : null;
  const links = chrome?.links ?? {};

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href={FONTS} />
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />
      {chrome && <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: renderNav(chrome.nav, PATH) }} />}
      <BlackFriday links={links} />
      {chrome && <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: renderFooter(chrome.links, chrome.vertical) }} />}
    </>
  );
}
