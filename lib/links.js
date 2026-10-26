// Resolves visible labels ("Book a demo", "HVAC", "See all features"…) to
// URLs, using the links a page's own WordPress menus point to. Shared by the
// redesigned pages and the site-wide nav/footer.

const norm = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[→↗▶›»]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

// Design labels -> the wording the site's menus use (tried in order; menus
// differ per vertical and include WordPress typos like "Inpsection").
const ALIASES = {
  'get started': ['book a demo'],
  'product tour': ['book a demo'],
  'book a free demo': ['book a demo'],
  'get my pricing': ['pricing'],
  'see pricing': ['pricing'],
  'explore all features': ['all features', 'see all features'],
  'see all features': ['all features', 'see all features'],
  'invoicing and estimates': ['invoicing and estimate', 'invoicing and estimates'],
  'recurring inspection': ['recurring inpsection', 'recurring inspection'],
  'recurring inspections': ['recurring inpsection', 'recurring inspection'],
  'see all verticals': ['all industries', 'see all verticals'],
  'explore all trades': ['all industries'],
  'explore integrations': ['integrations', 'intigrations'],
  integrations: ['integrations', 'intigrations'],
  'explore resources': ['all resources', 'see all resources', 'free resources'],
  'see all resources': ['all resources', 'see all resources', 'free resources'],
  'our story': ['about us'],
  'more customer proof': ['case studies'],
  'watch the story': ['testimonials'],
  reports: ['all features', 'see all features'],
  // Customer video cards are labelled with the customer's name.
  'vicky amend': ['testimonials'],
  'log in': ['login'],
  'contact sales': ['contact us'],
  'talk to sales': ['contact us'],
};

// Fallback by keyword for one-off CTA wording on individual pages.
const KEYWORDS = [
  [/\bdemo\b|\bsign up\b|fits your shop|get started/, ['book a demo']],
  [/customer stor|case stud/, ['case studies']],
  [/^explore\b.*\bfeatures?\b|^explore\b/, ['all features', 'see all features']],
  [/support|contact/, ['contact us']],
];

// Pages the menus don't link to: customer case studies and integrations.
const STATIC = {
  'pastion industries': '/zenfire/case-study/pastion-industries-success-story',
  'icy hot heating and air': '/zenhvac/case-study/controlled-fire-success-story',
  // No published Covenant Electric case study exists yet.
  'covenant electric': '/case-study',
  stripe: '/integrations/stripe',
  'quickbooks online': '/integrations/quickbooksonline',
  quickbooks: '/integrations/quickbooksonline',
  staxbill: '/integrations/stax',
  stax: '/integrations/stax',
  'gravity payments': '/integrations/gravity',
  'the compliance engine': '/zenfire/the-compliance-engine',
  // No dedicated integration pages yet.
  salesforce: '/integrations',
  dialpad: '/integrations',
  privacy: '/privacy-policy',
  terms: '/terms-and-conditions',
  '206 456 8988': 'tel:+12064568988',
  'hello zentrades pro': 'mailto:hello@zentrades.pro',
};

// Resolves a visible label to a URL using the current page's own
// navigation/footer links (passed from the server as `links`).
export function makeHref(links = {}) {
  const map = {};
  for (const [label, href] of Object.entries(links)) map[norm(label)] = href;
  return (label) => {
    const n = norm(label);
    if (!n) return '#';
    if (map[n]) return map[n];
    for (const alt of ALIASES[n] || []) if (map[alt]) return map[alt];
    if (STATIC[n]) return STATIC[n];
    // Cards whose text starts with a known label, e.g. "Podcast · EP 01 …".
    const prefix = Object.keys(map).find((k) => k.length > 3 && n.startsWith(k + ' '));
    if (prefix) return map[prefix];
    const aliasPrefix = Object.keys(ALIASES).find((k) => n.startsWith(k));
    for (const alt of ALIASES[aliasPrefix] || []) if (map[alt]) return map[alt];
    for (const [re, alts] of KEYWORDS) if (re.test(n)) for (const alt of alts) if (map[alt]) return map[alt];
    return '#';
  };
}
