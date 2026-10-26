import * as cheerio from 'cheerio';
import type { AnyNode, Element } from 'domhandler';
import { getManifest, type WpPage } from '@/lib/wp';

// Blog article template from the redesign ("Blog Article"): every blog post
// is re-rendered in the new layout using its own WordPress content. The
// WordPress post (an Elementor document) is read into plain blocks (headings,
// paragraphs, images, lists, download CTAs, FAQs, key takeaways) and laid out
// as: hero, sticky table of contents with reading progress, numbered sections,
// FAQ, "Keep reading" and a demo call to action. /zt-blog.js adds the
// interactive parts.

// Articles get the template; checklists, forms, templates, case studies and
// comparisons keep their own layouts.
export function isArticle(path: string, type: string): boolean {
  return type === 'post' && !/^\/zenfire\/(checklist|forms|templates|case-study|comparison)\/|\/(templates|case-study)\//.test(path);
}

type Block =
  | { kind: 'h2' | 'h3'; text: string }
  | { kind: 'html'; html: string }
  | { kind: 'cta'; label: string; href: string }
  | { kind: 'raw'; html: string };
type Faq = { q: string; a: string };

const esc = (s: string) => s.replace(/&(?![a-z0-9#]+;)/gi, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

// ------------------------------------------------------------------ vertical

type Vertical = { label: string; product: string; blog: string; cta: string };
function verticalFor(path: string): Vertical {
  const pages = getManifest();
  const pick = (...c: string[]) => c.find((p) => pages[p]) ?? '/blog';
  if (path.startsWith('/zenfire/private-equity-solutions')) return { label: 'Private Equity', product: 'ZenFire', blog: pick('/zenfire/private-equity-solutions/blogs', '/zenfire/blog'), cta: 'fire protection businesses run inspections, service and billing in one platform' };
  if (path.startsWith('/zenfire') || path.startsWith('/guides/zenfire')) return { label: path.startsWith('/guides') ? 'Guide' : 'Fire Software', product: 'ZenFire', blog: pick('/zenfire/blog'), cta: 'ZenFire handles fire inspections from schedule to invoice' };
  if (path.startsWith('/zenhvac') || path.startsWith('/hvac')) return { label: 'HVAC Software', product: 'ZenHVAC', blog: pick('/zenhvac/blog'), cta: 'ZenHVAC runs HVAC jobs from first call to paid invoice' };
  if (path.startsWith('/zenplumbing')) return { label: 'Plumbing Software', product: 'ZenPlumbing', blog: pick('/zenplumbing/blogs', '/zenplumbing/blog'), cta: 'ZenPlumbing runs plumbing jobs from first call to paid invoice' };
  if (path.startsWith('/zenelectrical')) return { label: 'Electrical Software', product: 'ZenElectrical', blog: pick('/zenelectrical/blog'), cta: 'ZenElectrical runs electrical jobs from first call to paid invoice' };
  return { label: 'Field Service', product: 'ZenTrades', blog: pick('/blog'), cta: 'ZenTrades runs field service jobs from schedule to invoice' };
}

// ------------------------------------------------------------------ extract

const KEEP_ATTRS: Record<string, string[]> = { a: ['href', 'target', 'rel'], img: ['src', 'alt', 'width', 'height', 'srcset', 'sizes'], td: ['colspan', 'rowspan'], th: ['colspan', 'rowspan'], iframe: ['src', 'title', 'allow', 'allowfullscreen', 'width', 'height'] };
const DROP_TAGS = 'script, style, noscript, form, input, button, svg';

// Strips Elementor/WordPress styling from content HTML so the article styles apply.
function sanitize($: cheerio.CheerioAPI, html: string): string {
  const $c = cheerio.load(`<div id="__c">${html}</div>`, null, false);
  const root = $c('#__c');
  root.find(DROP_TAGS).remove();
  root.find('*').each((_, el) => {
    const e = el as Element;
    const keep = KEEP_ATTRS[e.tagName] ?? [];
    for (const name of Object.keys(e.attribs)) if (!keep.includes(name)) $c(e).removeAttr(name);
    if (e.tagName === 'img') $c(e).attr('loading', 'lazy');
  });
  root.find('span, font').each((_, el) => {
    $c(el).replaceWith($c(el).contents());
  });
  // Empty paragraphs / spacers WordPress leaves behind.
  root.find('p, div').each((_, el) => {
    if (!$c(el).text().replace(/ /g, ' ').trim() && !$c(el).find('img, iframe, table').length) $c(el).remove();
  });
  return root.html() ?? '';
}

const isWidget = (el: Element) => !!el.attribs?.['data-widget_type'];

// Widgets of the main column, in order, excluding widgets nested in widgets.
function topWidgets(root: cheerio.Cheerio<Element>): Element[] {
  const top = root[0];
  return (root.find('[data-widget_type]').toArray() as Element[]).filter((el) => {
    for (let a = el.parent as Element | null; a && a !== top; a = a.parent as Element | null) if (isWidget(a)) return false;
    return true;
  });
}

const textLen = ($: cheerio.CheerioAPI, el: AnyNode) =>
  $(el)
    .find('.elementor-widget-text-editor, .elementor-widget-heading')
    .toArray()
    .reduce((n, w) => n + $(w).text().length, 0);

// The article column: the smallest container holding most of the post's text
// (leaves out the hero, the sidebar form and related-post grids).
function mainColumn($: cheerio.CheerioAPI, doc: cheerio.Cheerio<Element>): cheerio.Cheerio<Element> {
  const total = doc.find('.elementor-widget-text-editor').toArray().reduce((n, w) => n + $(w).text().length, 0);
  let best: Element | null = null;
  let bestSize = Infinity;
  doc.find('.e-con, .elementor-column, .elementor-section').each((_, c) => {
    const t = $(c).find('.elementor-widget-text-editor').toArray().reduce((n, w) => n + $(w).text().length, 0);
    if (total && t >= total * 0.7) {
      const size = $(c).find('*').length;
      if (size < bestSize) {
        best = c as Element;
        bestSize = size;
      }
    }
  });
  return best ? $(best) : doc;
}

function blocksFromTextEditor($: cheerio.CheerioAPI, container: cheerio.Cheerio<Element>, out: Block[]) {
  container.contents().each((_, node) => {
    if (node.type === 'text') {
      if (clean((node as unknown as { data: string }).data)) out.push({ kind: 'html', html: `<p>${esc(clean((node as unknown as { data: string }).data))}</p>` });
      return;
    }
    if (node.type !== 'tag') return;
    const el = node as Element;
    const tag = el.tagName.toLowerCase();
    if (/^h[1-6]$/.test(tag)) {
      const text = clean($(el).text());
      if (text && tag !== 'h1') out.push({ kind: tag === 'h2' ? 'h2' : 'h3', text });
      return;
    }
    if (tag === 'div' && $(el).children().length && !$(el).is('table')) {
      blocksFromTextEditor($, $(el), out);
      return;
    }
    const html = sanitize($, $.html(el));
    if (html.trim()) out.push({ kind: 'html', html });
  });
}

function extractBlocks($: cheerio.CheerioAPI, main: cheerio.Cheerio<Element>) {
  const blocks: Block[] = [];
  const faqs: Faq[] = [];
  for (const w of topWidgets(main)) {
    const type = (w.attribs['data-widget_type'] || '').split('.')[0];
    const $w = $(w);
    switch (type) {
      case 'heading':
      case 'elementskit-heading': {
        const h = $w.find('h1, h2, h3, h4, h5, h6').first();
        const text = clean(h.text() || $w.text());
        const tag = h.length ? h[0].tagName.toLowerCase() : 'h3';
        if (text && tag !== 'h1') blocks.push({ kind: tag === 'h2' ? 'h2' : 'h3', text });
        break;
      }
      case 'text-editor': {
        const c = $w.find('.elementor-widget-container').first();
        blocksFromTextEditor($, c.length ? c : $w, blocks);
        break;
      }
      case 'image': {
        const img = $w.find('img').first();
        if (img.length && Number(img.attr('width') || 999) >= 120) {
          const caption = clean($w.find('figcaption').text());
          blocks.push({ kind: 'html', html: `<figure>${sanitize($, $.html(img))}${caption ? `<figcaption>${esc(caption)}</figcaption>` : ''}</figure>` });
        }
        break;
      }
      case 'image-carousel':
        $w.find('img').each((_, img) => {
          blocks.push({ kind: 'html', html: `<figure>${sanitize($, $.html(img))}</figure>` });
        });
        break;
      case 'icon-list':
      case 'premium-icon-list': {
        const items = $w.find('li').map((_, li) => clean($(li).text())).get().filter(Boolean);
        if (items.length) blocks.push({ kind: 'html', html: `<ul>${items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` });
        break;
      }
      case 'video': {
        const iframe = $w.find('iframe[src*="youtube"], iframe[src*="vimeo"]').first();
        if (iframe.length) blocks.push({ kind: 'html', html: `<div class="video">${sanitize($, $.html(iframe))}</div>` });
        break;
      }
      case 'button': {
        const a = $w.find('a[href]').first();
        const label = clean(a.text());
        // Template downloads are the post's lead magnet; other buttons (Read
        // more, See all blogs, Request demo) are covered by the layout.
        if (a.length && /template|download/i.test(label)) blocks.push({ kind: 'cta', label, href: a.attr('href')! });
        break;
      }
      case 'accordion':
      case 'toggle':
      case 'eael-adv-accordion':
        $w.find('.elementor-accordion-item, .elementor-toggle-item, .eael-accordion-list').each((_, item) => {
          const q = clean($(item).find('.elementor-tab-title, .eael-accordion-tab-title, .eael-accordion-header').first().text());
          const aEl = $(item).find('.elementor-tab-content, .eael-accordion-content').first();
          if (q && aEl.length) faqs.push({ q, a: sanitize($, aEl.html() ?? '') });
        });
        break;
      case 'shortcode':
        // Plugin shortcodes are rendered later by lib/shortcodes.ts.
        blocks.push({ kind: 'raw', html: $w.find('.elementor-shortcode').html() ?? '' });
        break;
      default:
        // table-of-contents (rebuilt), html (HubSpot forms, scripts), dividers,
        // forms, post info, slides…
        break;
    }
  }
  return { blocks, faqs };
}

// "Key takeaways": a heading followed by a list, in the article or the hero.
function takeTakeaways($: cheerio.CheerioAPI, doc: cheerio.Cheerio<Element>, blocks: Block[]): string[] {
  const i = blocks.findIndex((b) => (b.kind === 'h2' || b.kind === 'h3') && /^key takeaways?\b/i.test(b.text));
  if (i >= 0) {
    // Only the list right after the heading; text after it is article content.
    let j = i + 1;
    const items: string[] = [];
    while (j < blocks.length && blocks[j].kind === 'html') {
      const $b = cheerio.load((blocks[j] as { html: string }).html, null, false);
      if (!$b('li').length) break;
      $b('li').each((_, li) => {
        items.push(clean($b(li).text()));
      });
      j++;
    }
    if (items.length) {
      blocks.splice(i, j - i);
      return items;
    }
  }
  // Hero takeaways (outside the article column).
  const h = doc.find('h1, h2, h3, h4, .elementor-heading-title').filter((_, e) => /^key takeaways?\b/i.test(clean($(e).text()))).first();
  if (h.length) {
    const box = h.closest('.e-con');
    const items = box.find('li').map((_, li) => clean($(li).text())).get().filter(Boolean);
    if (items.length) return items.slice(0, 6);
  }
  return [];
}

// An "FAQs" heading followed by question headings and answers.
function takeFaqSection(blocks: Block[]): Faq[] {
  const i = blocks.findIndex((b) => (b.kind === 'h2' || b.kind === 'h3') && /^(faqs?|frequently asked questions)\b/i.test(b.text));
  if (i < 0) return [];
  const faqs: Faq[] = [];
  let j = i + 1;
  let cur: Faq | null = null;
  for (; j < blocks.length; j++) {
    const b = blocks[j];
    if (b.kind === 'h2' && cur) break;
    if (b.kind === 'h3' || (b.kind === 'h2' && !cur)) {
      if (cur) faqs.push(cur);
      cur = { q: b.text, a: '' };
    } else if (b.kind === 'html' && cur) {
      cur.a += b.html;
    } else if (b.kind === 'html' && !cur) {
      // intro text under the FAQ heading
    } else break;
  }
  if (cur) faqs.push(cur);
  if (!faqs.length) return [];
  blocks.splice(i, j - i);
  return faqs;
}

export type Article = {
  title: string;
  intro: string;
  takeaways: string[];
  lead: Block[];
  sections: { id: string; title: string; blocks: Block[]; subs: { id: string; title: string }[] }[];
  faqs: Faq[];
  minutes: number;
};

export function extractArticle(page: WpPage): { article: Article; docStart: number; docEnd: number; titleRange?: [number, number] } | null {
  const $ = cheerio.load(page.body, { xml: { xmlMode: false, decodeEntities: false, withStartIndices: true, withEndIndices: true } }, false);
  const doc = $('[data-elementor-post-type="post"]').first() as cheerio.Cheerio<Element>;
  if (!doc.length) return null;
  // Second, entity-decoding parse for text extraction.
  const $d = cheerio.load(page.body);
  const ddoc = $d('[data-elementor-post-type="post"]').first() as cheerio.Cheerio<Element>;
  const main = mainColumn($d, ddoc);
  const { blocks, faqs: accordionFaqs } = extractBlocks($d, main);
  if (!blocks.some((b) => b.kind === 'html')) return null;

  const takeaways = takeTakeaways($d, ddoc, blocks);
  const faqs = [...accordionFaqs, ...takeFaqSection(blocks)];

  // Sections: by h2, or by h3 when a post never uses h2.
  const sectionLevel = blocks.some((b) => b.kind === 'h2') ? 'h2' : 'h3';
  const lead: Block[] = [];
  const sections: Article['sections'] = [];
  for (const b of blocks) {
    if (b.kind === sectionLevel) {
      const n = sections.length + 1;
      sections.push({ id: `s${n}`, title: b.text, blocks: [], subs: [] });
    } else if (b.kind === 'h3' && sections.length) {
      const s = sections[sections.length - 1];
      const id = `${s.id}-${s.subs.length + 1}`;
      s.subs.push({ id, title: b.text });
      s.blocks.push({ kind: 'h3', text: b.text });
    } else if (sections.length) {
      sections[sections.length - 1].blocks.push(b);
    } else {
      lead.push(b);
    }
  }

  // The post title, unless the on-page H1 differs; WordPress H1s are often a
  // shortened title ("…Contractors" vs "…Contractors: How ZenFire…").
  const fullTitle = page.title.replace(/\s+-\s+ZenTrades$/, '');
  const pageH1 = clean(ddoc.find('h1').first().text());
  const h1 = !pageH1 || fullTitle.toLowerCase().startsWith(pageH1.toLowerCase()) ? fullTitle : pageH1;

  // Old hero leftovers: the title/date/"N Min Read" line and the "Key
  // Takeaways" illustration (takeaways are rendered as their own box).
  const norm = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const isHeroText = (t: string) => (h1 && norm(t).includes(norm(h1))) || /\b\d+\s*min(ute)?s?\s+read\b/i.test(t) || /^key takeaways?\b/i.test(t.trim());
  const textOf = (html: string) => clean(cheerio.load(html).text());
  for (let i = lead.length - 1; i >= 0; i--) {
    const b = lead[i];
    if (b.kind !== 'html') continue;
    if (/<img[^>]+alt="[^"]*key takeaway/i.test(b.html) || (textOf(b.html) && isHeroText(textOf(b.html)))) lead.splice(i, 1);
  }

  // Hero intro: the opening paragraph of the post (in the article column or
  // the old hero), else the meta description.
  let intro = '';
  const firstP = lead.findIndex((b) => b.kind === 'html' && /^<p>/.test(b.html) && textOf(b.html).length >= 80);
  if (firstP >= 0) {
    intro = textOf((lead[firstP] as { html: string }).html);
    lead.splice(firstP, 1);
  }
  if (!intro) {
    const inMain = (el: Element) => $d(el).parents().toArray().includes(main[0]);
    const p = ddoc
      .find('.elementor-widget-text-editor p')
      .filter((_, el) => !inMain(el as Element))
      .map((_, el) => clean($d(el).text()))
      .get()
      .find((t) => t.length >= 100 && !isHeroText(t));
    if (p) intro = p;
  }
  if (!intro) {
    const meta = clean(page.head.find((t) => t.tag === 'meta' && t.attrs.name === 'description')?.attrs.content ?? '');
    if (!isHeroText(meta)) intro = meta;
  }

  // Promo blocks inside articles: a template download becomes an in-article
  // card; newsletter sign-ups are dropped; so are sections left empty.
  const PROMO = /^(use our free|get (your|the|our) free|download (our|the|your|free)|free .*template|get posts like this|subscribe|sign up for|join our newsletter)/i;
  for (let i = sections.length - 1; i >= 0; i--) {
    const sec = sections[i];
    if (PROMO.test(sec.title)) {
      const cta = sec.blocks.find((b) => b.kind === 'cta') as Extract<Block, { kind: 'cta' }> | undefined;
      sections.splice(i, 1);
      if (cta) (i > 0 ? sections[i - 1].blocks : lead).push({ kind: 'cta', label: sec.title.replace(/[.!]+$/, ''), href: cta.href });
    } else if (!sec.blocks.some((b) => b.kind === 'html' || b.kind === 'raw' || b.kind === 'cta')) {
      sections.splice(i, 1);
    }
  }
  sections.forEach((sec, i) => {
    const id = `s${i + 1}`;
    sec.subs.forEach((sub, j) => (sub.id = `${id}-${j + 1}`));
    sec.id = id;
  });
  const words = clean(main.text()).split(' ').length;
  return {
    article: { title: h1, intro, takeaways, lead, sections, faqs, minutes: Math.max(1, Math.round(words / 230)) },
    docStart: doc[0].startIndex!,
    docEnd: doc[0].endIndex! + 1,
    // The theme's own title block (a second H1, hidden by CSS on WordPress).
    titleRange: (() => {
      const t = $('main .page-header').first()[0] as Element | undefined;
      return t && t.endIndex! < doc[0].startIndex! ? ([t.startIndex!, t.endIndex! + 1] as [number, number]) : undefined;
    })(),
  };
}

// ------------------------------------------------------------------ render

const CSS = `
/* Zero-specificity reset (:where) so every rule below wins over it. */
:where(.zt-blog, .zt-blog *:not(svg, svg *, .zt-cl, .zt-cl *)) { all: revert; box-sizing: border-box; }
.zt-blog { --ink:#010101; --body:#3A3532; --muted:#5A5450; --soft:#7A736E; --line:#ECE8E4; --accent:#EE5566; --accent-dark:#C93347; --accent-soft:#FDECEE; --cream:#FAF8F6;
  --zt-gutter: clamp(16px, 1.6vw, 20px); display: block; background: #fff; color: var(--ink); font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; overflow-x: clip; }
.zt-blog a { color: inherit; text-decoration: none; }
.zt-blog .progress-top { position: fixed; left: 0; top: 0; height: 3px; width: 100%; z-index: 1100; pointer-events: none; }
.zt-blog .progress-top span { display: block; height: 100%; width: 0; background: var(--accent); transition: width .1s linear; }
@keyframes zt-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
/* Hero */
.zt-blog .hero { padding: 16px var(--zt-gutter) 0; }
.zt-blog .hero-card { position: relative; overflow: hidden; max-width: 1400px; margin: 0 auto; border-radius: 36px; background: linear-gradient(180deg,#FFF7F8 0%,#FFFFFF 100%); box-shadow: inset 0 0 0 1px #F6E3E6; padding: clamp(32px,4vw,56px) clamp(20px,3vw,40px); }
.zt-blog .hero-card .glow { position: absolute; left: 50%; top: -260px; width: 900px; height: 560px; transform: translateX(-50%); border-radius: 50%; background: radial-gradient(closest-side,rgba(238,85,102,.12),rgba(238,85,102,0)); pointer-events: none; }
.zt-blog .hero-card .deco { position: absolute; pointer-events: none; }
.zt-blog .hero-inner { position: relative; max-width: 1400px; margin: 0 auto; padding: clamp(24px,4vw,56px) clamp(0px,2vw,24px); }
.zt-blog .meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 32px; }
.zt-blog .back { display: inline-flex; align-items: center; gap: 8px; height: 36px; padding: 0 14px 0 10px; border-radius: 999px; background: #F6F3F1; font-size: 13px; font-weight: 500; color: var(--muted); transition: background .2s, color .2s; }
.zt-blog .back:hover { background: var(--ink); color: #fff; }
.zt-blog .pill { font-size: 12px; font-weight: 600; color: #fff; background: var(--accent); padding: 6px 11px; border-radius: 999px; }
.zt-blog .read { font-size: 13px; color: var(--soft); }
.zt-blog h1 { font-size: clamp(36px,5.2vw,76px); font-weight: 600; letter-spacing: -.05em; line-height: 1; margin: 0; max-width: 1200px; text-wrap: balance; animation: zt-rise .7s cubic-bezier(.2,.7,.2,1) both; }
.zt-blog h1 .accent { color: var(--accent); }
.zt-blog .hero-rule { height: 1px; background: #F0E3E5; margin: clamp(32px,4vw,48px) 0; }
.zt-blog .hero-row { display: flex; flex-wrap: wrap; gap: 32px 64px; align-items: flex-end; justify-content: space-between; }
.zt-blog .intro { flex: 1 1 420px; font-size: 18px; line-height: 1.7; color: var(--muted); margin: 0; max-width: 760px; text-wrap: pretty; }
.zt-blog .hero-side { flex: 0 1 auto; display: flex; flex-direction: column; gap: 16px; align-items: flex-start; }
.zt-blog .stats { display: flex; gap: 8px; flex-wrap: wrap; }
.zt-blog .stat { display: flex; flex-direction: column; gap: 2px; padding: 14px 18px; border-radius: 16px; background: #fff; box-shadow: 0 0 0 1px #F3D9DD; min-width: 96px; }
.zt-blog .stat b { font-size: 26px; font-weight: 600; letter-spacing: -.04em; line-height: 1.1; }
.zt-blog .stat span { font-size: 12px; color: var(--soft); }
.zt-blog .btn { display: inline-flex; align-items: center; gap: 10px; height: 52px; padding: 0 22px; border-radius: 13px; background: var(--ink); color: #fff !important; font-size: 15px; font-weight: 500; box-shadow: inset 0 1px 0 rgba(255,255,255,.18),0 1px 2px rgba(1,1,1,.3); transition: background .2s, transform .2s; }
.zt-blog .btn:hover { background: var(--accent); transform: translateY(-1px); }
/* Body: sticky TOC + article */
.zt-blog .body { padding: 72px var(--zt-gutter) 0; }
.zt-blog .body-inner { max-width: 1400px; margin: 0 auto; display: flex; gap: 64px; align-items: flex-start; }
.zt-blog aside { flex: 0 0 300px; position: sticky; top: 96px; display: flex; flex-direction: column; gap: 18px; max-height: calc(100vh - 116px); overflow-y: auto; scrollbar-width: none;
  background: #fff; border-radius: 24px; padding: 20px; box-shadow: 0 0 0 1px var(--line), 0 24px 48px -36px rgba(1,1,1,.25); }
.zt-blog .toc-head { display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 600; color: var(--soft); }
.zt-blog .toc-head .pct { font-family: 'Geist Mono', ui-monospace, monospace; font-size: 12px; color: var(--accent); }
.zt-blog .mini { height: 4px; border-radius: 4px; background: #F0EDEA; overflow: hidden; }
.zt-blog .mini span { display: block; height: 100%; width: 0; background: var(--accent); transition: width .15s; }
.zt-blog .toc { display: flex; flex-direction: column; gap: 2px; }
.zt-blog .toc-item > a { display: flex; align-items: flex-start; gap: 12px; padding: 8px 10px; border-radius: 10px; font-size: 14px; line-height: 1.4; color: var(--muted); transition: background .15s, color .15s; }
.zt-blog .toc-item > a:hover { background: #F6F3F1; color: var(--ink); }
.zt-blog .toc-item .n { font-family: 'Geist Mono', ui-monospace, monospace; font-size: 11px; color: #B0A9A3; padding-top: 2px; min-width: 18px; }
.zt-blog .toc-item .t { flex: 1; }
.zt-blog .toc-item .ok { color: #1F9D55; font-size: 12px; opacity: 0; transition: opacity .2s; }
.zt-blog .toc-item.done .ok { opacity: 1; }
.zt-blog .toc-item.active > a { background: var(--accent-soft); color: var(--ink); font-weight: 600; }
.zt-blog .toc-item.active .n { color: var(--accent); }
.zt-blog .toc-subs { display: none; flex-direction: column; margin: 4px 0 8px 40px; border-left: 1px solid var(--line); }
.zt-blog .toc-item.active .toc-subs { display: flex; }
.zt-blog .toc-subs a { font-size: 13px; line-height: 1.4; color: var(--soft); padding: 6px 12px; margin-left: -1px; border-left: 1px solid transparent; }
.zt-blog .toc-subs a:hover, .zt-blog .toc-subs a.on { color: var(--ink); border-left-color: var(--accent); }
.zt-blog .side-cta { background: var(--cream); border-radius: 20px; padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.zt-blog .side-cta p { margin: 0; font-size: 15px; font-weight: 600; line-height: 1.35; }
.zt-blog .side-cta a { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 44px; border-radius: 12px; background: var(--ink); color: #fff !important; font-size: 14px; font-weight: 500; transition: background .2s; }
.zt-blog .side-cta a:hover { background: var(--accent); }
.zt-blog article { flex: 1 1 auto; min-width: 0; }
/* Takeaways */
.zt-blog .takeaways { background: var(--ink); color: #fff; border-radius: 28px; padding: 28px 30px; margin: 0 0 48px; position: relative; overflow: hidden; }
.zt-blog .takeaways::before { content: ''; position: absolute; right: -80px; top: -100px; width: 300px; height: 300px; background: radial-gradient(closest-side,rgba(238,85,102,.4),rgba(238,85,102,0)); }
.zt-blog .takeaways .lbl { position: relative; font-size: 13px; font-weight: 600; color: var(--accent); margin: 0 0 16px; }
.zt-blog .takeaways ol { position: relative; list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; counter-reset: k; }
.zt-blog .takeaways li { display: flex; gap: 14px; font-size: 16px; line-height: 1.55; color: #E6E1DC; counter-increment: k; }
.zt-blog .takeaways li::before { content: counter(k, decimal-leading-zero); color: var(--accent); font-family: 'Geist Mono', ui-monospace, monospace; font-size: 12px; padding-top: 3px; }
/* Article typography */
.zt-blog .prose > section { scroll-margin-top: 100px; padding-top: 56px; margin-top: 24px; border-top: 1px solid #F0EDEA; }
.zt-blog .prose > section:first-child { border-top: 0; padding-top: 0; margin-top: 0; }
.zt-blog .prose > .lead { margin-bottom: 8px; }
.zt-blog .prose .num { font-family: 'Geist Mono', ui-monospace, monospace; font-size: 12px; color: var(--accent); margin: 0 0 12px; }
.zt-blog .prose h2 { font-size: clamp(28px,3vw,38px); font-weight: 600; letter-spacing: -.035em; line-height: 1.12; margin: 0 0 20px; text-wrap: balance; }
.zt-blog .prose h3 { font-size: 21px; font-weight: 600; letter-spacing: -.02em; line-height: 1.3; margin: 32px 0 12px; scroll-margin-top: 100px; }
.zt-blog .prose h4 { font-size: 18px; font-weight: 600; margin: 24px 0 10px; }
.zt-blog .prose p { font-size: 18px; line-height: 1.75; color: var(--body); margin: 0 0 22px; text-wrap: pretty; }
.zt-blog .prose > section:first-of-type > p:first-of-type::first-letter, .zt-blog .prose > .lead > p:first-child::first-letter { float: left; font-size: 64px; line-height: .9; font-weight: 600; color: var(--accent); margin: 6px 12px 0 0; }
.zt-blog .prose a { color: var(--accent-dark); text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; }
.zt-blog .prose a:hover { color: var(--accent); }
.zt-blog .prose strong, .zt-blog .prose b { font-weight: 600; color: var(--ink); }
.zt-blog .prose ul, .zt-blog .prose ol { margin: 0 0 24px; padding: 0 0 0 4px; list-style: none; display: flex; flex-direction: column; gap: 10px; }
.zt-blog .prose ul > li, .zt-blog .prose ol > li { position: relative; padding-left: 30px; font-size: 17px; line-height: 1.65; color: var(--body); }
.zt-blog .prose ul > li::before { content: ''; position: absolute; left: 6px; top: 11px; width: 7px; height: 7px; border-radius: 2px; background: var(--accent); }
.zt-blog .prose ol { counter-reset: o; }
.zt-blog .prose ol > li { counter-increment: o; }
.zt-blog .prose ol > li::before { content: counter(o); position: absolute; left: 0; top: 2px; width: 22px; height: 22px; border-radius: 7px; background: var(--accent-soft); color: var(--accent); font-size: 12px; font-weight: 600; display: grid; place-items: center; }
.zt-blog .prose li p { margin: 0; font-size: inherit; }
.zt-blog .prose figure { margin: 8px 0 28px; }
.zt-blog .prose img { max-width: 100%; height: auto; display: block; border-radius: 20px; }
.zt-blog .prose figcaption { font-size: 13px; color: var(--soft); margin-top: 8px; }
.zt-blog .prose blockquote { margin: 28px 0; padding: 8px 0 8px 24px; border-left: 3px solid var(--accent); font-size: 20px; line-height: 1.5; font-weight: 500; color: var(--ink); }
.zt-blog .prose blockquote p { font-size: inherit; color: inherit; margin: 0; }
.zt-blog .prose table { width: 100%; border-collapse: separate; border-spacing: 0; margin: 8px 0 28px; font-size: 15px; border-radius: 16px; overflow: hidden; box-shadow: 0 0 0 1px var(--line); display: block; overflow-x: auto; }
.zt-blog .prose th, .zt-blog .prose td { padding: 12px 14px; text-align: left; vertical-align: top; border-bottom: 1px solid var(--line); color: var(--body); line-height: 1.5; }
.zt-blog .prose th, .zt-blog .prose thead td { background: var(--cream); font-weight: 600; color: var(--ink); }
.zt-blog .prose tr:last-child td { border-bottom: 0; }
.zt-blog .prose .video { position: relative; aspect-ratio: 16 / 9; margin: 8px 0 28px; border-radius: 20px; overflow: hidden; }
.zt-blog .prose .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.zt-blog .prose .dl { position: relative; overflow: hidden; background: var(--accent-soft); border-radius: 24px; padding: 24px 26px; margin: 8px 0 28px; display: flex; flex-wrap: wrap; gap: 16px; align-items: center; justify-content: space-between; }
.zt-blog .prose .dl p { margin: 0; font-size: 17px; font-weight: 600; color: var(--ink); }
.zt-blog .prose .dl a { text-decoration: none; display: inline-flex; align-items: center; gap: 8px; height: 46px; padding: 0 20px; border-radius: 12px; background: var(--accent); color: #fff; font-size: 15px; font-weight: 500; transition: background .2s; }
.zt-blog .prose .dl a:hover { background: var(--ink); color: #fff; }
/* FAQ */
.zt-blog .faq { padding: 96px var(--zt-gutter) 0; }
.zt-blog .faq-inner, .zt-blog .more-inner { max-width: 1400px; margin: 0 auto; }
.zt-blog .faq-inner { display: flex; flex-wrap: wrap; gap: 48px; align-items: flex-start; }
.zt-blog .faq h2 { flex: 1 1 280px; max-width: 360px; font-size: clamp(32px,3.6vw,46px); font-weight: 600; letter-spacing: -.04em; line-height: 1.05; margin: 0; }
.zt-blog h2 .accent, .zt-blog .accent { color: var(--accent); }
.zt-blog .faq-list { flex: 999 1 480px; min-width: 0; border-top: 1px solid var(--line); }
.zt-blog details { border-bottom: 1px solid var(--line); }
.zt-blog summary { list-style: none; cursor: pointer; padding: 22px 0; display: flex; justify-content: space-between; align-items: center; gap: 20px; font-size: 18px; font-weight: 500; letter-spacing: -.01em; line-height: 1.4; }
.zt-blog summary::-webkit-details-marker { display: none; }
.zt-blog summary .pm { flex-shrink: 0; width: 32px; height: 32px; border-radius: 50%; box-shadow: inset 0 0 0 1px #E6E1DC; display: grid; place-items: center; font-size: 18px; transition: background .3s, color .3s, transform .3s; }
.zt-blog details[open] summary .pm { background: var(--ink); color: #fff; transform: rotate(45deg); box-shadow: none; }
.zt-blog .faq-a { padding: 0 48px 24px 0; font-size: 16px; line-height: 1.7; color: var(--muted); }
.zt-blog .faq-a p { margin: 0 0 12px; }
.zt-blog .faq-a ul, .zt-blog .faq-a ol { margin: 0 0 12px; padding-left: 20px; }
/* Keep reading */
.zt-blog .more { padding: 96px var(--zt-gutter) 0; }
.zt-blog .more-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; margin-bottom: 28px; }
.zt-blog .more-head h2 { font-size: clamp(28px,3.2vw,40px); font-weight: 600; letter-spacing: -.04em; line-height: 1.05; margin: 0; }
.zt-blog .all { font-size: 15px; font-weight: 500; padding: 6px 0; border-bottom: 1.5px solid var(--ink); transition: color .2s, border-color .2s; }
.zt-blog .all:hover { color: var(--accent); border-color: var(--accent); }
.zt-blog .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 16px; }
.zt-blog .card { display: flex; flex-direction: column; gap: 10px; padding: 22px 26px 26px; min-height: 200px; border-radius: 26px; background: var(--cream); transition: transform .3s, box-shadow .3s; }
.zt-blog .card:hover { transform: translateY(-4px); box-shadow: 0 0 0 1px var(--line), 0 30px 60px -36px rgba(1,1,1,.4); }
.zt-blog .card .tag { align-self: flex-start; font-size: 12px; font-weight: 600; color: var(--accent-dark); background: var(--accent-soft); padding: 5px 10px; border-radius: 999px; }
.zt-blog .card .ttl { font-size: 18px; font-weight: 600; letter-spacing: -.02em; line-height: 1.3; flex: 1; }
.zt-blog .card .go { font-size: 14px; font-weight: 500; color: var(--accent-dark); }
/* CTA */
.zt-blog .cta { padding: 96px var(--zt-gutter) 128px; }
.zt-blog .cta-inner { max-width: 1400px; margin: 0 auto; position: relative; overflow: hidden; background: #FDF1F2; border-radius: 36px; padding: clamp(32px,5vw,64px); display: flex; flex-wrap: wrap; gap: 28px; align-items: center; justify-content: space-between; }
.zt-blog .cta-inner .big { font-size: clamp(28px,3.4vw,44px); font-weight: 600; letter-spacing: -.04em; line-height: 1.1; text-wrap: balance; max-width: 680px; }
.zt-blog .cta-inner .small { font-size: 17px; color: var(--muted); margin-top: 14px; }
@media (max-width: 960px) {
  .zt-blog aside { display: none; }
  .zt-blog .body { padding-top: 48px; }
}
@media (max-width: 600px) {
  .zt-blog .prose p { font-size: 17px; }
  .zt-blog .faq-a { padding-right: 0; }
  .zt-blog .takeaways { padding: 22px; }
}
`;

const DECO = [
  ['6%', '14%', -10, 'M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.2 1-3.6 2.2-4.8.4 1.6 1.3 2.6 2.3 2.8C11 8.6 11.2 5.6 12 3z'],
  ['16%', '72%', 12, 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z'],
  ['30%', '8%', 8, 'M13 2 4 14h6l-1 8 9-12h-6l1-8z'],
  ['70%', '10%', -8, 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z'],
  ['85%', '62%', 10, 'M12 2v20M4.9 7l14.2 10M4.9 17 19.1 7'],
  ['93%', '20%', -6, 'M6 3h12v18H6zM12 3v18M9 9l-1.5 2h3zM15 15l1.5-2h-3z'],
] as const;

function renderBlocks(blocks: Block[], sectionId: string | null, subIds: string[]): string {
  let sub = 0;
  return blocks
    .map((b) => {
      if (b.kind === 'cta') return `<div class="dl"><p>${esc(b.label)}</p><a href="${esc(b.href)}">${/template/i.test(b.label) ? 'Get the template' : 'Download'} <span aria-hidden="true">→</span></a></div>`;
      if (b.kind === 'html' || b.kind === 'raw') return b.html;
      // Headings inside a section (h2s only appear here when sections are h3-based).
      return b.kind === 'h3' ? `<h3${sectionId ? ` id="${subIds[sub++] ?? ''}"` : ''}>${esc(b.text)}</h3>` : `<h3>${esc(b.text)}</h3>`;
    })
    .join('');
}

function titleHtml(title: string) {
  const i = title.indexOf(':');
  if (i > 10 && i < title.length - 8) return `${esc(title.slice(0, i + 1))}<br><span class="accent">${esc(title.slice(i + 1).trim())}</span>`;
  return esc(title);
}

type Related = { href: string; title: string };
function related(path: string, limit = 3): Related[] {
  const pages = getManifest();
  const prefix = path.split('/').slice(0, -1).join('/') + '/';
  return Object.entries(pages)
    .filter(([p, e]) => p !== path && p.startsWith(prefix) && isArticle(p, e.type) && !e.noindex)
    .sort((a, b) => String(b[1].modified).localeCompare(String(a[1].modified)))
    .slice(0, limit)
    .map(([p, e]) => ({ href: p, title: e.title.replace(/\s+-\s+ZenTrades$/, '') }));
}

export function renderArticle(a: Article, path: string, demoHref: string): string {
  const v = verticalFor(path);
  const sections = a.sections
    .map(
      (s, i) =>
        `<section id="${s.id}" data-sec="${i}"><div class="num">${String(i + 1).padStart(2, '0')}</div><h2>${esc(s.title)}</h2>${renderBlocks(s.blocks, s.id, s.subs.map((x) => x.id))}</section>`,
    )
    .join('');
  const toc = a.sections
    .map(
      (s, i) =>
        `<div class="toc-item" data-toc="${i}"><a href="#${s.id}"><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="t">${esc(s.title)}</span><span class="ok" aria-hidden="true">✓</span></a>` +
        (s.subs.length ? `<div class="toc-subs">${s.subs.map((x) => `<a href="#${x.id}">${esc(x.title)}</a>`).join('')}</div>` : '') +
        `</div>`,
    )
    .join('');
  const stats = [
    a.sections.length ? [a.sections.length, a.sections.length === 1 ? 'section' : 'sections'] : null,
    [a.minutes, 'min read'],
    a.faqs.length ? [a.faqs.length, a.faqs.length === 1 ? 'FAQ' : 'FAQs'] : null,
  ].filter(Boolean) as [number, string][];
  const more = related(path);
  const deco = DECO.map(([l, t, r, d]) => `<svg class="deco" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#EE5566" stroke-opacity=".28" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" style="left:${l};top:${t};transform:rotate(${r}deg)" aria-hidden="true"><path d="${d}"/></svg>`).join('');

  return (
    `<div class="zt-blog" data-zt-blog><style>${CSS}</style>` +
    `<div class="progress-top" aria-hidden="true"><span></span></div>` +
    `<section class="hero"><div class="hero-card">${deco}<div class="glow"></div><div class="hero-inner">` +
    `<div class="meta"><a class="back" href="${esc(v.blog)}">← Blog</a><span class="pill">${esc(v.label)}</span><span class="read">${a.minutes} min read</span></div>` +
    `<h1>${titleHtml(a.title)}</h1><div class="hero-rule"></div>` +
    `<div class="hero-row">${a.intro ? `<p class="intro">${esc(a.intro)}</p>` : '<span></span>'}<div class="hero-side">` +
    `<div class="stats">${stats.map(([n, l]) => `<div class="stat"><b>${n}</b><span>${l}</span></div>`).join('')}</div>` +
    `<a class="btn" href="#${a.sections[0]?.id ?? 'article'}">Start reading <span aria-hidden="true">↓</span></a></div></div>` +
    `</div></div></section>` +
    `<section class="body"><div class="body-inner">` +
    (a.sections.length > 1
      ? `<aside aria-label="On this page"><div class="toc-head"><span>On this page</span><span class="pct">0%</span></div><div class="mini"><span></span></div><nav class="toc">${toc}</nav>` +
        `<div class="side-cta"><p>${esc(`Run your business on ${v.product}`)}</p><a href="${esc(demoHref)}">Book a demo →</a></div></aside>`
      : '') +
    `<article id="article">` +
    (a.takeaways.length ? `<div class="takeaways"><p class="lbl">Key takeaways</p><ol>${a.takeaways.map((t) => `<li>${esc(t)}</li>`).join('')}</ol></div>` : '') +
    `<div class="prose">${a.lead.length ? `<div class="lead">${renderBlocks(a.lead, null, [])}</div>` : ''}${sections}</div>` +
    `</article></div></section>` +
    (a.faqs.length
      ? `<section class="faq"><div class="faq-inner"><h2>Frequently asked <span class="accent">questions</span></h2><div class="faq-list">${a.faqs
          .map((f, i) => `<details${i === 0 ? ' open' : ''}><summary><span>${esc(f.q)}</span><span class="pm" aria-hidden="true">+</span></summary><div class="faq-a">${f.a}</div></details>`)
          .join('')}</div></div></section>`
      : '') +
    (more.length
      ? `<section class="more"><div class="more-inner"><div class="more-head"><h2>Keep <span class="accent">reading</span></h2><a class="all" href="${esc(v.blog)}">All articles →</a></div><div class="cards">${more
          .map((r) => `<a class="card" href="${esc(r.href)}"><span class="tag">${esc(v.label)}</span><span class="ttl">${esc(r.title)}</span><span class="go">Read more →</span></a>`)
          .join('')}</div></div></section>`
      : '') +
    `<section class="cta"><div class="cta-inner"><div><div class="big">Want to see how ${esc(v.cta)}?</div><div class="small">Book a demo and bring your toughest job. We'll show you what it looks like on a phone.</div></div>` +
    `<a class="btn" href="${esc(demoHref)}">Book a demo <span aria-hidden="true">→</span></a></div></section>` +
    `<script src="/zt-blog.js" defer></script></div>`
  );
}

/**
 * Swaps a blog post's WordPress content for the redesigned article layout.
 * Returns the body unchanged when the post can't be read (no article text).
 */
export function applyBlogTemplate(page: WpPage, path: string, demoHref: string): string {
  const found = extractArticle(page);
  if (!found || (!found.article.sections.length && !found.article.lead.length)) return page.body;
  const before = found.titleRange ? page.body.slice(0, found.titleRange[0]) + page.body.slice(found.titleRange[1], found.docStart) : page.body.slice(0, found.docStart);
  return before + renderArticle(found.article, path, demoHref) + page.body.slice(found.docEnd);
}
