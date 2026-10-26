// Edits applied to the design exports before conversion, for links the design
// doesn't have. `link="<label or {{ binding }}>"` on an element makes it link
// to whatever components/redesign/runtime.js resolves that label to.
//
// Every `find` must match exactly once, so a re-exported design that changed
// these sections fails loudly instead of silently losing links.
export const PATCHES = {
  'ZenTrades Home.dc.html': [
    // Hero image: scaled up with the 1400px layout (drawn at 520px for 1200px).
    {
      find: 'alt="Technician using ZenTrades on a tablet" style="display:block;width:100%;max-width:520px;',
      replace: 'alt="Technician using ZenTrades on a tablet" style="display:block;width:100%;max-width:720px;',
    },
    // Why field teams choose ZenTrades: each story opens that customer's case study.
    {
      find: '<a href="#" style="display:inline-flex;align-items:center;gap:10px;height:48px;padding:0 20px 0 6px;border-radius:999px;background:#FFFFFF;',
      replace: '<a href="#" link="{{ s.company }}" style="display:inline-flex;align-items:center;gap:10px;height:48px;padding:0 20px 0 6px;border-radius:999px;background:#FFFFFF;',
    },
    // Feature list: the open feature gets a link to its feature page.
    {
      find: '<p style="font-size:15px;line-height:1.55;color:#A8A29D;margin:0 0 14px">{{ f.desc }}</p>',
      replace:
        '<p style="font-size:15px;line-height:1.55;color:#A8A29D;margin:0 0 14px">{{ f.desc }}</p>' +
        '<a href="#" link="{{ f.name }}" style="display:inline-flex;align-items:center;gap:6px;font-size:14px;font-weight:500;color:#FFFFFF;margin:0 0 14px;padding-bottom:2px;border-bottom:1.5px solid #EE5566" style-hover="color:#EE5566">Explore {{ f.name }} →</a>',
    },
    // Integration tiles link to their integration pages.
    {
      find: 'const integTiles = integDefs.map(d => ({ select:',
      replace: 'const integTiles = integDefs.map(d => ({ name: d.name, select:',
    },
    {
      find: '<div onMouseEnter="{{ i.select }}" onClick="{{ i.select }}" style="{{ i.style }}"><div style="{{ i.bg }}"></div></div>',
      replace: '<a href="#" link="{{ i.name }}" aria-label="{{ i.name }}" onMouseEnter="{{ i.select }}" onFocus="{{ i.select }}" style="{{ i.style }}"><div style="{{ i.bg }}"></div></a>',
    },
    {
      find: '<div onMouseEnter="{{ tce.select }}" onClick="{{ tce.select }}" style="{{ tce.style }}">',
      replace: '<a href="#" link="The Compliance Engine" onMouseEnter="{{ tce.select }}" onFocus="{{ tce.select }}" style="{{ tce.style }}">',
    },
    {
      find: 'Fire &amp; inspection →</span>\n      </div>',
      replace: 'Fire &amp; inspection →</span>\n      </a>',
    },
  ],
};

export function applyPatches(file, html) {
  for (const { find, replace } of PATCHES[file] || []) {
    const count = html.split(find).length - 1;
    if (count !== 1) throw new Error(`${file}: patch target found ${count} times (expected 1):\n${find.slice(0, 120)}`);
    html = html.replace(find, () => replace);
  }
  return html;
}
