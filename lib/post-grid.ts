import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

// Native replacement for the YMC Smart Filter post grid ([ymc_filter id="…"]):
// a card grid of the posts it listed (data/post-grids.json, exported from
// WordPress).

type Post = { title: string; href: string; excerpt: string; image: string; date: string };
type Grid = { name: string; perPage: number; posts: Post[] };

let grids: Record<string, Grid> | undefined;
function load() {
  const file = path.join(process.cwd(), 'data', 'post-grids.json');
  grids ??= existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};
  return grids!;
}

const esc = (s: string) => s.replace(/&(?![a-z0-9#]+;)/gi, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const CSS = `
.zt-grid, .zt-grid *:not(svg, svg *) { all: revert; box-sizing: border-box; }
.zt-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin: 8px 0 24px; font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
.zt-grid a { display: flex; flex-direction: column; color: #010101; text-decoration: none; background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 0 0 1px #ECE8E4; transition: transform .2s, box-shadow .2s; }
.zt-grid a:hover { transform: translateY(-3px); box-shadow: 0 0 0 1px #010101, 0 24px 40px -28px rgba(1,1,1,.4); }
.zt-grid img { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; display: block; background: #FAF8F6; }
.zt-grid .body { padding: 18px 20px 22px; display: flex; flex-direction: column; gap: 8px; }
.zt-grid .date { font-family: 'Geist Mono', ui-monospace, monospace; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: #7A736E; }
.zt-grid h3 { margin: 0; font-size: 18px; line-height: 1.3; font-weight: 600; letter-spacing: -.015em; }
.zt-grid p { margin: 0; font-size: 14px; line-height: 1.55; color: #5A5450; }
.zt-grid .more { margin-top: 4px; font-size: 14px; font-weight: 600; color: #EE5566; }
`;

export function renderPostGrid(id: string): string {
  const grid = load()[id];
  if (!grid) return '';
  const cards = grid.posts
    .map(
      (p) =>
        `<a href="${esc(p.href)}">${p.image ? `<img src="${esc(p.image)}" alt="" loading="lazy">` : ''}<div class="body"><span class="date">${esc(p.date)}</span><h3>${esc(p.title)}</h3>${p.excerpt ? `<p>${esc(p.excerpt)}</p>` : ''}<span class="more">Read more →</span></div></a>`,
    )
    .join('');
  return `<style>${CSS}</style><div class="zt-grid" aria-label="${esc(grid.name)}">${cards}</div>`;
}
