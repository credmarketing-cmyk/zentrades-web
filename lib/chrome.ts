import * as cheerio from 'cheerio';
import type { Element } from 'domhandler';
import { extractNav, repairNav, resolveLink, verticalSlugOf, type NavData, type NavItem, type NavLink } from '@/lib/nav';
import { loadPage } from '@/lib/wp';
import { makeHref } from '@/lib/links';

// Site-wide navigation and footer ("chrome") from the redesign, rendered as
// plain HTML so the same markup serves the React pages and every migrated
// WordPress page. Behaviour (dropdowns, mobile menu) lives in /zt-chrome.js.
//
// Each page keeps its own vertical: menus, logo, Book a Demo and footer links
// are read from that page's current WordPress header (see lib/nav.ts).

export type Vertical = 'zentrades' | 'fire' | 'hvac' | 'plumbing' | 'electrical';

const VERTICAL_HOME: Record<Vertical, string> = {
  zentrades: '/',
  fire: '/zenfire',
  hvac: '/zenhvac',
  plumbing: '/zenplumbing',
  electrical: '/zenelectrical',
};

// Big white logo at the bottom of the footer.
const FOOTER_LOGO: Record<Vertical, { src: string; alt: string; whiten?: boolean }> = {
  zentrades: { src: '/redesign/logo-zt-white.png', alt: 'ZenTrades' },
  hvac: { src: '/redesign/logo-zh-white.png', alt: 'ZenHVAC' },
  plumbing: { src: '/redesign/logo-zp-white.png', alt: 'ZenPlumbing' },
  electrical: { src: '/redesign/logo-zel-white.png', alt: 'ZenElectrical' },
  fire: { src: '/redesign/logo-zf-white.png', alt: 'ZenFire' },
};

export function verticalOf(nav: NavData | null, path: string): Vertical {
  const logo = nav?.logo.src.toLowerCase() ?? '';
  if (/fire/.test(logo)) return 'fire';
  if (/hvac/.test(logo)) return 'hvac';
  if (/plumbing/.test(logo)) return 'plumbing';
  if (/electrical/.test(logo)) return 'electrical';
  if (nav) return 'zentrades';
  const seg = path.split('/')[1] ?? '';
  return (Object.entries(VERTICAL_HOME).find(([, home]) => home !== '/' && home.slice(1) === seg)?.[0] as Vertical) ?? 'zentrades';
}

const esc = (s: string) => s.replace(/&(?![a-z0-9#]+;)/gi, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const isExternal = (href: string) => /^https?:\/\//.test(href) && !/zentrades\.pro/.test(href);
const linkAttrs = (href: string) => `href="${esc(href)}"${isExternal(href) ? ' target="_blank" rel="noopener"' : ''}`;
const CARET = '<svg class="caret" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const FONTS = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Geist+Mono:wght@500&display=swap';

// ---------------------------------------------------------------- nav

const NAV_CSS = `
.zt-nav, .zt-nav *:not(svg, svg *) { all: revert; box-sizing: border-box; }
.zt-nav [hidden] { display: none !important; }
.zt-nav { --zt-gutter: clamp(24px, 6vw, 80px); --ink:#010101; --soft:#7A736E; --line:#F0EDEA; --hover:#F6F3F1; --accent:#EE5566; --accent-soft:#FDECEE;
  position: sticky; top: 0; z-index: 1000; display: block; font-family: 'Inter', system-ui, sans-serif; color: var(--ink);
  -webkit-font-smoothing: antialiased; background: rgba(255,255,255,.88); backdrop-filter: saturate(1.6) blur(16px);
  -webkit-backdrop-filter: saturate(1.6) blur(16px); border-bottom: 1px solid var(--line); }
.zt-nav a { color: inherit; text-decoration: none; }
.zt-nav button { font: inherit; color: inherit; background: none; border: 0; padding: 0; margin: 0; cursor: pointer; }
/* The WordPress theme colours buttons pink on focus; clicking a menu must not. */
.zt-nav button:focus, .zt-nav button:active { background: none; color: inherit; outline: none; box-shadow: none; }
.zt-nav a:focus, .zt-nav a:active { outline: none; }
.zt-nav .bar { max-width: calc(1250px + 2 * var(--zt-gutter)); margin: 0 auto; padding: 14px var(--zt-gutter); display: flex; align-items: center; gap: 32px; min-height: 76px; }
.zt-nav .logo { display: flex; align-items: center; flex-shrink: 1; min-width: 0; }
.zt-nav .logo img { height: 26px; width: auto; max-width: 100%; object-fit: contain; object-position: left center; display: block; }
.zt-nav .bar > nav { display: block; flex: 1; min-width: 0; }
.zt-nav .menu { display: flex; align-items: center; justify-content: center; gap: 4px; list-style: none; margin: 0; padding: 0; }
.zt-nav .menu > li { list-style: none; position: relative; }
.zt-nav .trigger { display: flex; align-items: center; gap: 7px; font-size: 15px; font-weight: 500; color: #2A2523; padding: 10px 14px;
  border-radius: 10px; white-space: nowrap; transition: background .15s, color .15s; }
.zt-nav .trigger:hover, .zt-nav .trigger[aria-expanded="true"] { background: var(--hover); color: var(--ink); }
.zt-nav .trigger:focus-visible, .zt-nav a:focus-visible, .zt-nav button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.zt-nav .caret { width: 9px; height: 9px; opacity: .5; transition: transform .2s; }
.zt-nav .trigger[aria-expanded="true"] .caret { transform: rotate(180deg); }
.zt-nav .actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.zt-nav .login { font-size: 15px; font-weight: 500; padding: 11px 16px; border-radius: 12px; transition: background .15s; }
.zt-nav .login:hover { background: var(--hover); }
.zt-nav .cta { display: inline-flex; align-items: center; gap: 8px; height: 46px; padding: 0 20px; border-radius: 12px; background: var(--ink);
  color: #fff !important; font-size: 15px; font-weight: 500; white-space: nowrap; box-shadow: inset 0 1px 0 rgba(255,255,255,.18), 0 1px 2px rgba(1,1,1,.3);
  transition: background .2s, transform .15s; }
.zt-nav .cta:hover { background: var(--accent); }
.zt-nav .cta:active { transform: scale(.98); }
.zt-nav .drop { position: absolute; top: 100%; left: 0; padding-top: 14px; z-index: 1; }
.zt-nav .panel { background: #fff; border-radius: 20px; max-width: calc(100vw - 2 * var(--zt-gutter));
  box-shadow: 0 0 0 1px var(--line), 0 30px 60px -20px rgba(1,1,1,.22); padding: 24px; display: flex; gap: 24px;
  animation: zt-nav-in .18s cubic-bezier(.2,.7,.2,1); }
@keyframes zt-nav-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
.zt-nav .cols { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 18px; }
.zt-nav .groups { display: grid; gap: 8px 28px; }
.zt-nav .group-head { font-family: 'Geist Mono', ui-monospace, monospace; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--soft); margin: 0 0 8px 12px; }
.zt-nav .links { display: grid; gap: 2px 8px; list-style: none; margin: 0; padding: 0; }
.zt-nav .links li { list-style: none; }
.zt-nav .link { display: flex; flex-direction: column; gap: 3px; padding: 10px 12px; border-radius: 12px; transition: background .15s; }
.zt-nav .link:hover { background: var(--hover); }
.zt-nav .link[aria-current="page"] { background: var(--accent-soft); }
.zt-nav .link[aria-current="page"] .link-label { color: #C93347; }
.zt-nav .link-label { font-size: 15px; font-weight: 600; letter-spacing: -.01em; display: flex; align-items: center; gap: 6px; }
.zt-nav .link-label .arrow { color: var(--accent); opacity: 0; transform: translateX(-4px); transition: opacity .15s, transform .15s; }
.zt-nav .link:hover .arrow { opacity: 1; transform: none; }
.zt-nav .link-desc { font-size: 13px; line-height: 1.45; color: var(--soft); }
.zt-nav .all { align-self: flex-start; display: inline-flex; align-items: center; gap: 6px; margin-left: 12px; font-size: 14px; font-weight: 500;
  padding-bottom: 2px; border-bottom: 1.5px solid var(--ink); transition: color .15s, border-color .15s; }
.zt-nav .all:hover { color: var(--accent); border-color: var(--accent); }
.zt-nav .promo { width: 260px; flex-shrink: 0; display: flex; flex-direction: column; gap: 14px; padding: 14px; border-radius: 16px; background: #FAF8F6; transition: background .2s; }
.zt-nav .promo:hover { background: var(--accent-soft); }
.zt-nav .promo img { width: 100%; height: auto; max-height: 220px; object-fit: contain; border-radius: 10px; display: block; }
.zt-nav .promo-text { font-size: 14px; line-height: 1.45; font-weight: 500; padding: 0 4px 4px; }
.zt-nav .promo-go { font-size: 13px; font-weight: 600; color: var(--accent); padding: 0 4px; }
.zt-nav .burger { display: none; width: 40px; height: 40px; border-radius: 10px; flex-direction: column; align-items: center; justify-content: center; gap: 5px; }
.zt-nav .burger:hover { background: var(--hover); }
.zt-nav .burger span { display: block; width: 18px; height: 1.5px; background: var(--ink); border-radius: 2px; transition: transform .25s, opacity .2s; }
.zt-nav .burger[aria-expanded="true"] span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
.zt-nav .burger[aria-expanded="true"] span:nth-child(2) { opacity: 0; }
.zt-nav .burger[aria-expanded="true"] span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }
/* backdrop-filter would make the fixed mobile sheet position itself relative to the bar */
.zt-nav.is-open { backdrop-filter: none; -webkit-backdrop-filter: none; background: #fff; }
.zt-nav .sheet { position: fixed; left: 0; right: 0; top: var(--zt-nav-h, 64px); bottom: 0; background: #fff; overflow-y: auto;
  padding: 8px var(--zt-gutter) 32px; display: flex; flex-direction: column; animation: zt-nav-in .2s ease; }
.zt-nav .acc { border-bottom: 1px solid var(--line); }
.zt-nav .acc-btn { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 18px 4px; font-size: 17px; font-weight: 600; text-align: left; }
.zt-nav .acc-btn .caret { width: 10px; height: 10px; }
.zt-nav .acc-btn[aria-expanded="true"] .caret { transform: rotate(180deg); }
.zt-nav .acc-body { padding: 0 0 16px; display: flex; flex-direction: column; gap: 14px; }
.zt-nav .acc-body .link { padding: 10px 8px; }
.zt-nav .acc-body .group-head, .zt-nav .acc-body .all { margin-left: 8px; }
.zt-nav .acc-body .promo { width: auto; flex-direction: row; align-items: center; }
.zt-nav .acc-body .promo img { width: 96px; max-height: 96px; }
.zt-nav .sheet-actions { display: flex; flex-direction: column; gap: 10px; margin-top: 24px; }
.zt-nav .sheet-actions .cta, .zt-nav .sheet-actions .login { justify-content: center; height: 50px; display: flex; align-items: center; font-size: 15px; }
.zt-nav .sheet-actions .login { box-shadow: inset 0 0 0 1px #E6E1DC; }
@media (max-width: 1080px) {
  .zt-nav .bar > nav, .zt-nav .actions .login { display: none; }
  .zt-nav .bar { justify-content: space-between; min-height: 64px; padding: 12px var(--zt-gutter); gap: 16px; }
  .zt-nav .logo img { height: 22px; }
  .zt-nav .cta { height: 40px; padding: 0 16px; font-size: 14px; }
  .zt-nav .burger { display: flex; order: 3; }
}
@media (max-width: 480px) {
  .zt-nav .actions .cta { height: 36px; padding: 0 12px; font-size: 13px; }
  .zt-nav .bar { padding: 10px var(--zt-gutter); gap: 10px; }
  .zt-nav .logo img { height: 18px; }
  .zt-nav .actions { gap: 4px; }
}
@media (prefers-reduced-motion: reduce) { .zt-nav *, .zt-nav { animation: none !important; transition: none !important; } }
`;

// Columns per group: wide lists flow into a grid so panels stay short.
function columnsFor(item: NavItem) {
  const groups = item.groups.length;
  const total = item.groups.reduce((n, g) => n + g.links.length, 0);
  const hasDesc = item.groups.some((g) => g.links.some((l) => l.desc));
  if (groups > 1) return total > 8 ? 2 : 1;
  if (hasDesc) return 2;
  return total > 8 ? 3 : total > 5 ? 2 : 1;
}

// Panel width from its content: link columns plus the promo card.
function panelWidth(item: NavItem) {
  const cols = columnsFor(item);
  const groups = Math.max(item.groups.length, 1);
  const hasDesc = item.groups.some((g) => g.links.some((l) => l.desc));
  const linkCols = groups > 1 ? groups * cols : cols;
  return linkCols * (hasDesc ? 300 : 190) + (groups - 1) * 28 + (item.promo ? 260 + 24 : 0) + 48;
}

function linkList(links: NavLink[], cols: number, current: string) {
  const items = links
    .map((l) => {
      const here = l.href.replace(/\/+$/, '') === current;
      return `<li><a class="link" ${linkAttrs(l.href)}${here ? ' aria-current="page"' : ''}><span class="link-label">${esc(l.label)}<span class="arrow" aria-hidden="true">→</span></span>${l.desc ? `<span class="link-desc">${esc(l.desc)}</span>` : ''}</a></li>`;
    })
    .join('');
  return `<ul class="links" style="grid-template-columns:repeat(${cols},minmax(0,1fr))">${items}</ul>`;
}

function panelContent(item: NavItem, mobile: boolean, current: string) {
  const cols = mobile ? 1 : columnsFor(item);
  const groupCols = mobile ? '1fr' : `repeat(${Math.max(item.groups.length, 1)},minmax(0,1fr))`;
  const groups = item.groups
    .map((g) => `<div>${g.heading ? `<div class="group-head">${esc(g.heading)}</div>` : ''}${linkList(g.links, cols, current)}</div>`)
    .join('');
  const all = item.all ? `<a class="all" ${linkAttrs(item.all.href)}>${esc(item.all.label)} <span aria-hidden="true">→</span></a>` : '';
  const promo = item.promo
    ? `<a class="promo" ${linkAttrs(item.promo.href)}>${item.promo.image ? `<img src="${esc(item.promo.image)}" alt="${esc(item.promo.alt || item.promo.text || item.label)}" loading="lazy">` : ''}${item.promo.text ? `<span class="promo-text">${esc(item.promo.text)}</span>` : ''}${mobile ? '' : '<span class="promo-go">Learn more →</span>'}</a>`
    : '';
  return `<div class="cols"><div class="groups" style="grid-template-columns:${groupCols}">${groups}</div>${all}</div>${promo}`;
}

export function renderNav(nav: NavData, current: string): string {
  const menu = nav.items
    .map((item, i) =>
      item.groups.length
        ? `<li><button class="trigger" type="button" aria-expanded="false" aria-controls="zt-nav-panel-${i}">${esc(item.label)}${CARET}</button>` +
          `<div class="drop" hidden><div class="panel" id="zt-nav-panel-${i}" role="region" aria-label="${esc(item.label)}" style="width:${panelWidth(item)}px">${panelContent(item, false, current)}</div></div></li>`
        : `<li><a class="trigger" ${linkAttrs(item.href || '#')}>${esc(item.label)}</a></li>`,
    )
    .join('');
  const sheet = nav.items
    .map((item) =>
      item.groups.length
        ? `<div class="acc"><button class="acc-btn" type="button" aria-expanded="false">${esc(item.label)}${CARET}</button><div class="acc-body" hidden>${panelContent(item, true, current)}</div></div>`
        : `<div class="acc"><a class="acc-btn" ${linkAttrs(item.href || '#')}>${esc(item.label)}</a></div>`,
    )
    .join('');
  const login = nav.login ? `<a class="login" ${linkAttrs(nav.login.href)}>Log in</a>` : '';
  const cta = nav.cta ? `<a class="cta" ${linkAttrs(nav.cta.href)}>${esc(nav.cta.label)} <span aria-hidden="true">→</span></a>` : '';
  return (
    `<link rel="stylesheet" href="${FONTS}"><header class="zt-nav" data-zt-nav><style>${NAV_CSS}</style>` +
    `<div class="bar"><a class="logo" ${linkAttrs(nav.logo.href)} aria-label="Home"><img src="${esc(nav.logo.src)}" alt="${esc(nav.logo.alt)}"></a>` +
    `<nav aria-label="Main"><ul class="menu">${menu}</ul></nav>` +
    `<div class="actions">${login}${cta}<button class="burger" type="button" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button></div></div>` +
    `<div class="sheet" role="dialog" aria-label="Menu" hidden>${sheet}<div class="sheet-actions">${cta}${login}</div></div>` +
    `</header><script src="/zt-chrome.js" defer></script>`
  );
}

// ---------------------------------------------------------------- footer

const FOOTER_CSS = `
.zt-ft, .zt-ft *:not(svg, svg *) { all: revert; box-sizing: border-box; }
.zt-ft { --zt-gutter: clamp(24px, 6vw, 80px); display: block; background: #010101; color: #fff; padding: 96px var(--zt-gutter) 32px; overflow: hidden;
  font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
.zt-ft a { color: inherit; text-decoration: none; }
.zt-ft .wrap { max-width: 1250px; margin: 0 auto; }
.zt-ft .news { display: flex; flex-wrap: wrap; gap: 24px; padding-bottom: 56px; border-bottom: 1px solid #2A2726; align-items: center; justify-content: space-between; }
.zt-ft .news-title { flex: 1 1 340px; font-size: clamp(26px,3vw,40px); font-weight: 600; letter-spacing: -.04em; line-height: 1.05; color: #fff; margin: 0; }
.zt-ft form { flex: 1 1 340px; max-width: 480px; display: flex; background: #1C1A19; border-radius: 16px; padding: 6px; box-shadow: 0 0 0 1px #2E2B29; margin: 0; }
.zt-ft input { flex: 1; min-width: 0; background: transparent; border: none; outline: none; color: #fff; font: inherit; font-size: 15px; padding: 0 14px; }
.zt-ft input::placeholder { color: #8F8984; }
.zt-ft form button { height: 46px; background: #fff; color: #010101; border: none; border-radius: 12px; padding: 0 20px; font: inherit; font-weight: 500; font-size: 15px; cursor: pointer; transition: background .2s, color .2s; }
.zt-ft form button:hover { background: #EE5566; color: #fff; }
.zt-ft .cols { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 32px; padding: 56px 0; }
.zt-ft .col-title { font-family: 'Geist Mono', ui-monospace, monospace; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: #6F6964; margin: 0 0 18px; }
.zt-ft .col ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 11px; }
.zt-ft .col li { list-style: none; }
.zt-ft .col a { font-size: 14px; color: #CFC9C4; transition: color .15s; }
.zt-ft .col a:hover { color: #EE5566; }
.zt-ft .card { background: #141312; border-radius: 20px; padding: 22px; display: flex; flex-direction: column; gap: 10px; font-size: 13px; color: #A8A29D; line-height: 1.55; box-shadow: inset 0 0 0 1px #2A2726; }
.zt-ft .stars { color: #F5A524; letter-spacing: 2px; font-size: 14px; }
.zt-ft .card strong { color: #fff; font-weight: 600; font-size: 14px; }
.zt-ft .card a { color: #fff; font-weight: 500; }
.zt-ft .card a:hover { color: #EE5566; }
.zt-ft .big-logo { width: 100%; height: auto; display: block; }
.zt-ft .big-logo.whiten { filter: brightness(0) invert(1); }
.zt-ft .legal { padding-top: 28px; margin-top: 28px; border-top: 1px solid #2A2726; display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; font-size: 13px; color: #8F8984; }
.zt-ft .legal nav { display: flex; gap: 20px; }
.zt-ft .legal a { color: #8F8984; }
.zt-ft .legal a:hover { color: #fff; }
`;

// Footer columns from the redesign; labels resolve to each vertical's pages.
const FOOTER_COLS: { title: string; links: string[] }[] = [
  { title: 'Features', links: ['Invoicing & Estimates', 'Online Payments', 'Schedule & Dispatch', 'Recurring Inspection', 'Project Management', 'Crew Management', 'Inventory Management', 'Job Costing', 'See all features'] },
  { title: 'Verticals', links: ['HVAC', 'Plumbing', 'Water', 'Fire', 'Kitchen', 'Electrical', 'Elevator', 'See all verticals'] },
  { title: 'Resources', links: ['Calculators', 'Templates', 'NFPA Handbook', 'Checklists', 'Blog', 'Forms', 'Podcast', 'Guides', 'See all resources'] },
  { title: 'Company', links: ['Our Story', 'Contact Us', 'Referrals', 'Events', 'FAQs', 'Integrations'] },
];

export function renderFooter(links: Record<string, string>, vertical: Vertical): string {
  const H = makeHref(links) as (label: string) => string;
  const logo = FOOTER_LOGO[vertical];
  const cols = FOOTER_COLS.map(
    (c) => `<div class="col"><div class="col-title">${esc(c.title)}</div><ul>${c.links.map((l) => `<li><a ${linkAttrs(H(l))}>${esc(l)}</a></li>`).join('')}</ul></div>`,
  ).join('');
  return (
    `<footer class="zt-ft" data-zt-footer><style>${FOOTER_CSS}</style><div class="wrap">` +
    `<div class="news"><p class="news-title">Field service updates,<br>in your inbox.</p>` +
    `<form onsubmit="return false" aria-label="Newsletter"><input type="email" placeholder="you@company.com" aria-label="Email address"><button type="submit">Subscribe</button></form></div>` +
    `<div class="cols">${cols}<div class="card"><div class="stars">★★★★★</div><strong>Recognized by field service businesses nationwide</strong>` +
    `<div>236 W 27th St, Floor 12, New York, NY 10001</div><div>A-302, Nyati Tech Park, Kalyani Nagar, Pune 411014</div>` +
    `<a href="tel:+12064568988">(206) 456-8988</a><a href="mailto:hello@zentrades.pro">hello@zentrades.pro</a></div></div>` +
    `<img class="big-logo${logo.whiten ? ' whiten' : ''}" src="${logo.src}" alt="${logo.alt}" loading="lazy">` +
    `<div class="legal"><span>© ${new Date().getFullYear()} ZenTrades Inc. All rights reserved.</span><nav aria-label="Legal"><a ${linkAttrs(H('Privacy'))}>Privacy</a><a ${linkAttrs(H('Terms'))}>Terms</a></nav></div>` +
    `</div></footer>`
  );
}

// ---------------------------------------------------------------- pages

type Located = {
  header?: Element;
  footer?: Element;
  /** Where to add chrome on pages that have none (archives, canvas pages). */
  main?: Element;
  /** A header without a menu (campaign landing pages): left untouched. */
  campaign: boolean;
};

function load(body: string) {
  return cheerio.load(body, { xml: { xmlMode: false, decodeEntities: false, withStartIndices: true, withEndIndices: true } }, false);
}

function locate($: cheerio.CheerioAPI): Located {
  const masthead = $('#masthead').get(0) as Element | undefined;
  const hf = $('[data-elementor-post-type="elementor-hf"]').get() as Element[];
  const hasMenu = (el: Element) => $(el).find('.e-n-menu').length > 0;
  const header = masthead ?? hf.find(hasMenu);
  const footer = ($('#colophon').get(0) as Element | undefined) ?? [...hf].reverse().find((el) => !hasMenu(el) && el !== header);
  const main = ($('main').get(0) ?? $('[data-elementor-type="archive"]').get(0) ?? $('[data-elementor-type]').get(0)) as Element | undefined;
  return { header, footer, main, campaign: !!masthead && !$(masthead).find('.e-n-menu').length };
}

// Labels -> hrefs from a page's header and footer menus (for footer links).
function menuLinks($: cheerio.CheerioAPI, roots: (Element | undefined)[]): Record<string, string> {
  const links: Record<string, string> = {};
  for (const root of roots) {
    if (!root) continue;
    $(root)
      .find('a[href]')
      .each((_, a) => {
        // Parsed without entity decoding (to keep source offsets), so decode the few that matter for labels.
        const label = $(a)
          .text()
          .replace(/&(amp|#0?38);/g, '&')
          .replace(/&(nbsp|#160);/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        const href = $(a).attr('href')!.replace(/&(amp|#0?38);/g, '&');
        if (label && label.length < 60 && href !== '#' && !(label in links)) links[label] = href;
      });
  }
  return links;
}

type Chrome = { nav: NavData; links: Record<string, string>; vertical: Vertical };
const verticalChrome = new Map<Vertical, Chrome | null>();

// Nav and links of a vertical's home page, for pages without their own header.
function chromeForVertical(v: Vertical): Chrome | null {
  if (!verticalChrome.has(v)) {
    const home = loadPage(VERTICAL_HOME[v]);
    const c = home ? chromeFromBody(home.body, VERTICAL_HOME[v]) : null;
    verticalChrome.set(v, c);
  }
  return verticalChrome.get(v)!;
}

function logoHrefFor(v: Vertical) {
  return VERTICAL_HOME[v];
}

export function chromeFromBody(body: string, path: string): Chrome | null {
  const $ = load(body);
  const loc = locate($);
  const raw = extractNav(body);
  if (!raw || !raw.items.length) return null;
  const vertical = verticalOf(raw, path);
  const nav = repairNav({ ...raw, logo: { ...raw.logo, href: logoHrefFor(vertical) } });
  // Footer links go through the same dead-link repair as the nav.
  const slug = verticalSlugOf(raw);
  const fallback = nav.cta?.href ?? '/';
  const links = Object.fromEntries(Object.entries(menuLinks($, [loc.header, loc.footer])).map(([label, href]) => [label, resolveLink(href, label, slug, fallback)]));
  return { nav, links, vertical };
}

/**
 * Swaps a migrated page's WordPress header and footer for the redesigned
 * ones. Pages without a header get the chrome of their vertical; campaign
 * landing pages (a logo-only header) are left as they are.
 */
export function applySiteChrome(body: string, path: string): string {
  const $ = load(body);
  const loc = locate($);
  if (loc.campaign) return body;

  const own = loc.header ? chromeFromBody(body, path) : null;
  const chrome = own ?? chromeForVertical(verticalOf(null, path));
  if (!chrome) return body;

  const navHtml = renderNav(chrome.nav, path.replace(/\/+$/, '') || '/');
  const footerHtml = renderFooter(chrome.links, chrome.vertical);

  // Splice by source offsets so the rest of the page stays byte-for-byte.
  const edits: { start: number; end: number; html: string }[] = [];
  const range = (el: Element) => ({ start: el.startIndex!, end: el.endIndex! + 1 });
  if (loc.header) edits.push({ ...range(loc.header), html: navHtml });
  else edits.push({ start: 0, end: 0, html: navHtml });
  if (loc.footer) edits.push({ ...range(loc.footer), html: footerHtml });
  else if (loc.main) edits.push({ start: loc.main.endIndex! + 1, end: loc.main.endIndex! + 1, html: footerHtml });
  else edits.push({ start: body.length, end: body.length, html: footerHtml });

  edits.sort((a, b) => b.start - a.start);
  let out = body;
  for (const e of edits) out = out.slice(0, e.start) + e.html + out.slice(e.end);
  return out;
}
