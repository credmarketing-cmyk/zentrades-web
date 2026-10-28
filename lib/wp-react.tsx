import * as cheerio from 'cheerio';
import { withSiteUrl, type HeadTag, type WpPage } from '@/lib/wp';
import { isWpAsset } from '@/lib/lean';

const ATTR_NAMES: Record<string, string> = {
  class: 'className',
  charset: 'charSet',
  crossorigin: 'crossOrigin',
  'http-equiv': 'httpEquiv',
  referrerpolicy: 'referrerPolicy',
  fetchpriority: 'fetchPriority',
  itemprop: 'itemProp',
  nomodule: 'noModule',
  imagesrcset: 'imageSrcSet',
  imagesizes: 'imageSizes',
};

function HeadElement({ tag, attrs, inner }: HeadTag) {
  const props: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(attrs)) {
    const key = ATTR_NAMES[k] ?? k;
    props[key] = key === 'async' || key === 'defer' || key === 'noModule' ? true : withSiteUrl(v);
  }
  if (tag === 'title') return <title>{inner}</title>;
  if (tag === 'meta' || tag === 'link') {
    const El = tag;
    return <El {...props} />;
  }
  const El = tag as 'style' | 'script' | 'noscript';
  return <El {...props} dangerouslySetInnerHTML={{ __html: withSiteUrl(inner) }} />;
}

// A WordPress page's <head> as React elements. React hoists <title>, <meta>
// and <link> into the document head; styles and scripts render in place.
// `lean` leaves out the WordPress theme and plugin assets (lib/lean.ts).
export function WpHead({ page, lean = false }: { page: WpPage; lean?: boolean }) {
  return (
    <>
      {page.head
        .filter((t) => !(t.tag === 'meta' && t.attrs.name === 'viewport'))
        .filter((t) => !lean || !isWpAsset(t))
        .map((t, i) => (
          <HeadElement key={i} {...t} />
        ))}
    </>
  );
}

// The root layout is shared by every React page, so each page sets its own
// WordPress body classes (Elementor kit, theme) before any content renders.
export function BodyClass({ className }: { className?: string }) {
  if (!className) return null;
  return <script dangerouslySetInnerHTML={{ __html: `document.body.className=${JSON.stringify(className)};` }} />;
}

export type WpChrome = {
  /** Skip link and anything else before #page. */
  before: string;
  /** Attributes of the #page wrapper. */
  pageAttrs: Record<string, string>;
  /** The site header / navigation (#masthead). */
  header: string;
  /** Scripts, popups and styles WordPress prints after #page. */
  after: string;
  /** Visible label -> href for every link in the nav and footer. */
  links: Record<string, string>;
};

// Splits a crawled WordPress body into the site chrome around the content.
export function splitWpBody(body: string): WpChrome {
  const $ = cheerio.load(`<body>${body}</body>`, null, false);
  const page = $('#page').first();
  const links: Record<string, string> = {};
  $('#masthead a[href], #colophon a[href]').each((_, a) => {
    const label = $(a).text().replace(/\s+/g, ' ').trim();
    const href = $(a).attr('href')!;
    if (label && label.length < 60 && href !== '#' && !(label in links)) links[label] = href;
  });
  // Buttons that open an Elementor popup holding a Supademo product tour
  // ("Product tour", "Watch demo") link straight to that tour.
  $('a[href*="elementor-action"]').each((_, a) => {
    const label = $(a).text().replace(/\s+/g, ' ').trim();
    const settings = decodeURIComponent($(a).attr('href')!).match(/settings=([A-Za-z0-9+/=]+)/)?.[1];
    if (!label || !settings) return;
    try {
      const { id } = JSON.parse(Buffer.from(settings, 'base64').toString('utf8'));
      const src = $(`[data-elementor-id="${id}"] iframe[src*="supademo.com/embed/"]`).attr('src');
      const demo = src?.match(/embed\/([a-z0-9]+)/i)?.[1];
      if (demo && !(label in links)) links[label] = `https://app.supademo.com/demo/${demo}`;
    } catch {
      // Not a popup action we understand.
    }
  });
  return {
    before: page.prevAll().get().reverse().map((el) => $.html(el)).join(''),
    pageAttrs: { ...page.attr() },
    header: $.html($('#masthead').first()),
    after: page.nextAll().get().map((el) => $.html(el)).join(''),
    links,
  };
}
