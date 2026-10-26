// Converts Claude Design exports (*.dc.html) into React client components.
//
// Template syntax handled:
//   {{ expr }}                  text / attribute bindings
//   <sc-for list as>            -> list.map(...)
//   <sc-if value>               -> conditional
//   style="css" | "{{ obj }}"   -> style objects
//   style-hover / style-active  -> generated classes with :hover / :active rules
//   <image-slot src fit>        -> <img>
// The design's <header> is dropped: pages keep the site's current navigation.
// Each page's logic class (state + renderVals) is copied unchanged.
//
// Usage: node scripts/convert-design.mjs <export-dir>
import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { applyPatches } from './design-patches.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = process.argv[2] || '/Users/zentrades/Downloads/zentrades-redesign-src/export';
const OUT = path.join(ROOT, 'components/redesign');
const ASSET_URL = '/redesign/';

// Design file -> component name and the site URL it replaces.
export const PAGES = [
  { file: 'ZenTrades Home.dc.html', name: 'Home', path: '/' },
  { file: 'ZenHVAC.dc.html', name: 'ZenHvac', path: '/zenhvac' },
  { file: 'ZenPlumbing.dc.html', name: 'ZenPlumbing', path: '/zenplumbing' },
  { file: 'ZenElectrical.dc.html', name: 'ZenElectrical', path: '/zenelectrical' },
  { file: 'Elevator.dc.html', name: 'Elevator', path: '/elevator' },
  { file: 'Water Damage Restoration.dc.html', name: 'WaterRestoration', path: '/trades/water-restoration-software' },
];

// Site-wide layout for the redesigned pages: the designs were drawn at a
// 1200px content width with 24px gutters.
const LAYOUT = {
  maxWidth: { 1200: 1400, 1000: 1160 }, // design px -> site px (wide containers only)
  gutter: 'var(--zt-gutter)', // set in components/RedesignPage.tsx
};

// The hero (first section) was balanced for 1200px: scale its headline and
// paragraph caps with the wider layout and give the visual column more room,
// so text and image meet with a normal gap instead of empty space.
function scaleHero(section) {
  return section
    .replace(/(<h1[^>]*?font-size:clamp\(\d+px,[\d.]+vw,)(\d+)px\)/, (m, pre, max) => `${pre}${Math.round(max * 1.16)}px)`)
    .replace(/(<p\b[^>]*?max-width:)(\d+)px/g, (m, pre, w) => (w >= 440 && w <= 620 ? `${pre}${+w + 100}px` : m))
    // Text column: drop its extra grow; visual column: grow a little more.
    .replace(/flex:1\.1 1 (\d+)px;min-width:0;animation:zt-rise \.7s/, 'flex:1 1 $1px;min-width:0;animation:zt-rise .7s')
    .replace(/flex:1 1 380px;min-width:0;/, 'flex:1.15 1 380px;min-width:0;')
    .replace(/flex:1\.1 1 440px;min-width:0;position:relative/, 'flex:1.3 1 440px;min-width:0;position:relative');
}

function applyLayout(html) {
  const start = html.indexOf('<section');
  const end = html.indexOf('</section>', start);
  if (start >= 0 && end > start) html = html.slice(0, start) + scaleHero(html.slice(start, end)) + html.slice(end);
  html = html.replace(/max-width:(\d+)px/g, (m, w) => (LAYOUT.maxWidth[w] ? `max-width:${LAYOUT.maxWidth[w]}px` : m));
  // Section and footer side padding -> the shared gutter.
  return html.replace(/<(section|footer)\b([^>]*?)style="([^"]*)"/g, (m, tag, pre, style) => {
    const fixed = style.replace(/(^|;)\s*padding:([^;]+)/, (pm, sep, val) => {
      const v = val.trim().split(/\s+/);
      if (v[1] === '24px') v[1] = LAYOUT.gutter;
      if (v[3] === '24px') v[3] = LAYOUT.gutter;
      return `${sep}padding:${v.join(' ')}`;
    });
    return `<${tag}${pre}style="${fixed}"`;
  });
}

const EXPR_RE = /\{\{\s*([\s\S]+?)\s*\}\}/g;
const ONLY_EXPR_RE = /^\s*\{\{\s*((?:(?!\}\})[\s\S])+?)\s*\}\}\s*$/;

const fixAssets = (s) => s.replace(/(^|["'(\s])\.?\/?assets\//g, `$1${ASSET_URL}`);

// Root identifiers that are not loop variables come from renderVals().
function scopeExpr(expr, locals) {
  const trimmed = expr.trim();
  if (/^(true|false|null|undefined|-?\d+(\.\d+)?)$/.test(trimmed)) return trimmed;
  const root = trimmed.match(/^[A-Za-z_$][\w$]*/)?.[0];
  if (!root) return trimmed;
  return locals.has(root) ? trimmed : 'v.' + trimmed;
}

const camel = (p) => (p.startsWith('--') ? p : p.replace(/^-ms-/, 'ms-').replace(/-([a-z])/g, (_, c) => c.toUpperCase()));

function splitDecls(css) {
  const out = [];
  let depth = 0, quote = null, cur = '';
  for (const ch of css) {
    if (quote) { if (ch === quote) quote = null; cur += ch; continue; }
    if (ch === '"' || ch === "'") { quote = ch; cur += ch; continue; }
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ';' && depth === 0) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  out.push(cur);
  return out.map((d) => d.trim()).filter(Boolean);
}

function cssToObject(css) {
  const obj = {};
  for (const d of splitDecls(css)) {
    const i = d.indexOf(':');
    if (i < 0) continue;
    obj[camel(d.slice(0, i).trim())] = fixAssets(d.slice(i + 1).trim());
  }
  return obj;
}

const jsString = (s) => JSON.stringify(s);

// Class names for style-hover / style-active, deduplicated by rule text.
function makeStateClasses() {
  const rules = new Map();
  return {
    add(kind, css) {
      const key = kind + '|' + css;
      if (!rules.has(key)) rules.set(key, { cls: `zt-${kind[0]}${rules.size}`, kind, css });
      return rules.get(key).cls;
    },
    css() {
      return [...rules.values()]
        .map(({ cls, kind, css }) => {
          const decls = splitDecls(fixAssets(css)).map((d) => d.replace(/\s*!important\s*$/, '') + ' !important').join(';');
          return `.zt-rd .${cls}:${kind}{${decls}}`;
        })
        .join('\n');
    },
  };
}

const ATTR_RENAME = { class: 'className', for: 'htmlFor', tabindex: 'tabIndex', readonly: 'readOnly', maxlength: 'maxLength', colspan: 'colSpan', rowspan: 'rowSpan', autoplay: 'autoPlay', playsinline: 'playsInline', srcset: 'srcSet', crossorigin: 'crossOrigin', 'stroke-width': 'strokeWidth', 'stroke-linecap': 'strokeLinecap', 'stroke-linejoin': 'strokeLinejoin', 'fill-rule': 'fillRule', 'clip-rule': 'clipRule', viewbox: 'viewBox' };
const VOID = new Set(['img', 'input', 'br', 'hr', 'meta', 'link', 'source', 'area', 'col', 'wbr', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse', 'stop']);

function convert(html, name) {
  const $ = cheerio.load(html, { xml: { xmlMode: false, lowerCaseAttributeNames: false, lowerCaseTags: false, recognizeSelfClosing: true, decodeEntities: true } });
  const states = makeStateClasses();

  // Logic class, with asset paths pointed at /redesign/.
  const logic = fixAssets($('script[data-dc-script]').html() || '').replace(/class\s+Component\s+extends\s+DCLogic/, 'class Logic extends DCLogic');

  const helmet = $('x-dc > helmet');
  const globalCss = helmet.find('style').map((_, el) => $(el).html()).get().join('\n');
  const jsonLd = helmet.find('script[type="application/ld+json"]').map((_, el) => $(el).html().trim()).get();
  helmet.remove();

  // Header and footer come from the shared site chrome (lib/chrome.ts).
  $('x-dc header').first().remove();
  $('x-dc footer').last().remove();

  function textOf(node) {
    return $(node).text().replace(/\s+/g, ' ').trim();
  }

  function hrefFor(node, locals) {
    const t = textOf(node).replace(/[→↗▶]/g, '').trim();
    const m = t.match(ONLY_EXPR_RE);
    if (m) return `{H(${scopeExpr(m[1], locals)})}`;
    if (!/\{\{/.test(t) && t) return `{H(${jsString(t)})}`;
    // Several bindings (e.g. number + title + description): link by the title.
    const named = [...t.matchAll(EXPR_RE)].map((x) => x[1]).find((e) => /\.(title|label|name|link|cta)$/.test(e));
    return named ? `{H(${scopeExpr(named, locals)})}` : '{H("")}';
  }

  function attrsToJsx(node, locals) {
    const tag = node.name;
    const parts = [];
    const classes = [];
    // link="label" / link="{{ expr }}" (added by design-patches.mjs) picks the href.
    const linkAttr = node.attribs.link;
    const linkMatch = linkAttr?.match(ONLY_EXPR_RE);
    const linkHref = linkAttr == null ? null : `{H(${linkMatch ? scopeExpr(linkMatch[1], locals) : jsString(linkAttr)})}`;
    for (let [k, val] of Object.entries(node.attribs)) {
      if (k.startsWith('hint-') || k === 'link') continue;
      if (k === 'href' && linkHref) {
        parts.push(`href=${linkHref}`);
        continue;
      }
      if (k === 'style-hover' || k === 'style-active' || k === 'style-focus') {
        classes.push(states.add(k.slice(6), val));
        continue;
      }
      const m = val.match(ONLY_EXPR_RE);
      if (k === 'style') {
        parts.push(m ? `style={${scopeExpr(m[1], locals)}}` : `style={${JSON.stringify(cssToObject(val))}}`);
        continue;
      }
      if (/^on[A-Z]/.test(k) || k === 'ref') {
        if (m) parts.push(`${k}={${scopeExpr(m[1], locals)}}`);
        continue;
      }
      if (k === 'class') { classes.push(val); continue; }
      if (tag === 'a' && k === 'href' && (val === '#' || val === '')) {
        parts.push(`href=${hrefFor(node, locals)}`);
        continue;
      }
      const name = ATTR_RENAME[k.toLowerCase()] || k;
      if (m) parts.push(`${name}={${scopeExpr(m[1], locals)}}`);
      else if (EXPR_RE.test(val)) {
        EXPR_RE.lastIndex = 0;
        const tpl = val.replace(/`/g, '\\`').replace(EXPR_RE, (_, e) => '${' + scopeExpr(e, locals) + '}');
        parts.push(`${name}={\`${fixAssets(tpl)}\`}`);
      } else if (val === '' && !['alt', 'value', 'placeholder'].includes(k)) parts.push(name);
      else parts.push(`${name}={${jsString(['src', 'href', 'poster'].includes(k) ? fixAssets(val) : val)}}`);
      EXPR_RE.lastIndex = 0;
    }
    if (classes.length) parts.push(`className=${jsString(classes.join(' '))}`);
    return parts.length ? ' ' + parts.join(' ') : '';
  }

  function textToJsx(text, locals) {
    if (!/\S/.test(text)) return /\n/.test(text) || text.length ? '{" "}' : '';
    const out = [];
    let last = 0;
    for (const m of text.matchAll(EXPR_RE)) {
      if (m.index > last) out.push(`{${jsString(text.slice(last, m.index).replace(/\s+/g, ' '))}}`);
      out.push(`{${scopeExpr(m[1], locals)}}`);
      last = m.index + m[0].length;
    }
    if (last < text.length) out.push(`{${jsString(text.slice(last).replace(/\s+/g, ' '))}}`);
    return out.join('');
  }

  function children(node, locals) {
    return (node.children || []).map((c) => toJsx(c, locals)).join('');
  }

  function toJsx(node, locals) {
    if (node.type === 'text') return textToJsx(node.data, locals);
    if (node.type === 'comment') return '';
    if (node.type !== 'tag' && node.type !== 'script' && node.type !== 'style') return '';
    const tag = node.name;

    if (tag === 'sc-for') {
      const list = node.attribs.list.match(ONLY_EXPR_RE)[1];
      const as = node.attribs.as || 'item';
      const idx = `${as}__i`;
      const inner = new Set([...locals, as]);
      return `{(${scopeExpr(list, locals)} || []).map((${as}, ${idx}) => (<React.Fragment key={${idx}}>${children(node, inner)}</React.Fragment>))}`;
    }
    if (tag === 'sc-if') {
      const cond = node.attribs.value.match(ONLY_EXPR_RE)[1];
      return `{(${scopeExpr(cond, locals)}) ? (<>${children(node, locals)}</>) : null}`;
    }
    if (tag === 'image-slot') {
      const { src = '', fit = 'cover', placeholder = '' } = node.attribs;
      return `<img src=${jsString(fixAssets(src))} alt=${jsString(placeholder)} loading="lazy" style={${JSON.stringify({ width: '100%', height: '100%', objectFit: fit, display: 'block' })}} />`;
    }
    if (tag === 'x-dc') return children(node, locals);
    if (tag === 'script' || tag === 'style') return '';

    const attrs = attrsToJsx(node, locals);
    if (VOID.has(tag)) return `<${tag}${attrs} />`;
    return `<${tag}${attrs}>${children(node, locals)}</${tag}>`;
  }

  const root = $('x-dc')[0];
  const jsx = children(root, new Set());

  const keyframes = [...globalCss.matchAll(/@keyframes[^{]+\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g)].map((m) => m[0]).join('\n');

  const source = `'use client';
// Generated by scripts/convert-design.mjs from "${name}" — edit the design and re-run rather than editing by hand.
import React from 'react';
import { DCLogic, makeHref } from './runtime';

${logic.trim()}

const CSS = ${jsString(keyframes + '\n' + states.css())};

export default class ${name}Page extends Logic {
  render() {
    const v = this.renderVals();
    const H = makeHref(this.props.links);
    return (
      <div className="zt-rd">
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        ${jsx}
      </div>
    );
  }
}
`;
  return { source, jsonLd };
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const ldIndex = {};
  for (const p of PAGES) {
    const html = applyLayout(applyPatches(p.file, await readFile(path.join(SRC, p.file), 'utf8')));
    const { source, jsonLd } = convert(html, p.name);
    await writeFile(path.join(OUT, `${p.name}.jsx`), source);
    ldIndex[p.path] = jsonLd;
    console.log(`${p.file} -> components/redesign/${p.name}.jsx (${(source.length / 1024).toFixed(0)} KB)`);
  }
  await writeFile(path.join(OUT, 'pages.json'), JSON.stringify(PAGES.map((p) => ({ ...p, jsonLd: ldIndex[p.path] })), null, 1));
  await cp(path.join(SRC, 'assets'), path.join(ROOT, 'public/redesign'), { recursive: true });
}

main();
