import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';

// Native replacements for the Forminator shortcodes WordPress rendered:
//   [forminator_form id="…"]  inspection checklists and a few short forms
//   [forminator_quiz id="…"]  the conference quiz
// Rendered as HTML (so checklist questions are indexable page content);
// /zt-forms.js adds filling in, saving progress, printing and the quiz.

type Field = {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  multiline?: boolean;
  min?: number;
  max?: number;
  step?: number;
  parts?: { key: string; label: string }[];
};
type Form = { id: number; name: string; thankYou: string; fields: Field[] };
type Quiz = {
  id: number;
  name: string;
  questions: { title: string; answers: { title: string; result: string }[] }[];
  results: { slug: string; title: string; description: string }[];
};
type FormsData = { forms: Record<string, Form>; quizzes: Record<string, Quiz>; missing: string[] };

let data: FormsData | undefined;
function load(): FormsData {
  const file = path.join(process.cwd(), 'data', 'forms.json.gz');
  data ??= existsSync(file) ? JSON.parse(gunzipSync(readFileSync(file)).toString('utf8')) : { forms: {}, quizzes: {}, missing: [] };
  return data!;
}

// Checklist submissions are optional: the Submit button only appears once a
// destination is configured (see app/api/forms/route.ts).
const submissionsEnabled = () => Boolean(process.env.FORMS_WEBHOOK_URL);

const esc = (s: string) => s.replace(/&(?![a-z0-9#]+;)/gi, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const QUESTION_TYPES = new Set(['checkbox', 'radio']);
const isChecklist = (f: Form) => f.fields.filter((x) => QUESTION_TYPES.has(x.type)).length >= 5;

const CSS = `
.zt-cl, .zt-cl *:not(svg, svg *) { all: revert; box-sizing: border-box; }
.zt-cl [hidden] { display: none !important; }
.zt-cl { --ink:#010101; --muted:#5A5450; --soft:#7A736E; --line:#ECE8E4; --bg:#FAF8F6; --accent:#EE5566; --accent-soft:#FDECEE;
  display: block; font-family: 'Inter', system-ui, sans-serif; color: var(--ink); -webkit-font-smoothing: antialiased; margin: 8px 0 24px; text-align: left; }
.zt-cl form { margin: 0; background: #fff; border-radius: 24px; box-shadow: 0 0 0 1px var(--line), 0 30px 60px -40px rgba(1,1,1,.25); overflow: hidden; }
.zt-cl .head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px 20px; padding: 22px 24px; border-bottom: 1px solid var(--line); background: var(--bg); }
.zt-cl .title { margin: 0; font-size: 20px; font-weight: 600; letter-spacing: -.02em; line-height: 1.25; }
.zt-cl .sub { margin: 4px 0 0; font-size: 14px; color: var(--soft); }
.zt-cl .progress { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--muted); font-weight: 500; white-space: nowrap; }
.zt-cl .bar { width: 120px; height: 6px; border-radius: 6px; background: #E6E1DC; overflow: hidden; }
.zt-cl .bar span { display: block; height: 100%; width: 0; background: var(--accent); transition: width .25s; }
.zt-cl .section { padding: 22px 24px; border-bottom: 1px solid var(--line); }
.zt-cl .section-title { font-family: 'Geist Mono', ui-monospace, monospace; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--soft); margin: 0 0 14px; }
.zt-cl .details { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px 16px; }
.zt-cl .fld { display: flex; flex-direction: column; gap: 6px; margin: 0; }
.zt-cl .fld.wide { grid-column: 1 / -1; }
.zt-cl .fld > span { font-size: 13px; font-weight: 600; color: var(--muted); }
.zt-cl input[type=text], .zt-cl input[type=email], .zt-cl input[type=tel], .zt-cl input[type=date], .zt-cl input[type=number], .zt-cl textarea {
  font: inherit; font-size: 15px; color: var(--ink); background: #fff; border: 1px solid #DDD7D2; border-radius: 12px; padding: 11px 14px; width: 100%; min-height: 46px; outline: none; transition: border-color .15s, box-shadow .15s; }
.zt-cl textarea { min-height: 96px; resize: vertical; }
.zt-cl input:focus, .zt-cl textarea:focus { border-color: var(--ink); box-shadow: 0 0 0 3px rgba(1,1,1,.06); }
.zt-cl ol.items { list-style: none; margin: 0; padding: 0; counter-reset: q; }
.zt-cl ol.items > li { list-style: none; border-bottom: 1px solid var(--line); }
.zt-cl ol.items > li:last-child { border-bottom: 0; }
.zt-cl fieldset.q { margin: 0; padding: 16px 24px; border: 0; min-width: 0; display: flex; align-items: center; gap: 16px 24px; flex-wrap: wrap; }
.zt-cl fieldset.q legend { float: left; flex: 1 1 320px; padding: 0; font-size: 15px; line-height: 1.5; font-weight: 500; display: flex; gap: 14px; align-items: baseline; }
.zt-cl .num { font-family: 'Geist Mono', ui-monospace, monospace; font-size: 12px; color: #B0A9A3; flex-shrink: 0; min-width: 22px; }
.zt-cl .opts { display: flex; gap: 6px; flex-shrink: 0; }
.zt-cl .opt { position: relative; cursor: pointer; margin: 0; }
.zt-cl .opt input { position: absolute; opacity: 0; inset: 0; margin: 0; cursor: pointer; }
.zt-cl .opt span { display: inline-flex; align-items: center; justify-content: center; min-width: 64px; height: 38px; padding: 0 14px; border-radius: 10px;
  font-size: 14px; font-weight: 600; color: var(--muted); box-shadow: inset 0 0 0 1px #DDD7D2; background: #fff; transition: all .15s; }
.zt-cl .opt:hover span { box-shadow: inset 0 0 0 1px var(--ink); color: var(--ink); }
.zt-cl .opt input:focus-visible + span { outline: 2px solid var(--accent); outline-offset: 2px; }
.zt-cl .opt input:checked + span { color: #fff; box-shadow: none; }
.zt-cl .opt.yes input:checked + span { background: #1F9D55; }
.zt-cl .opt.no input:checked + span { background: #C93347; }
.zt-cl .opt.na input:checked + span, .zt-cl .opt.other input:checked + span { background: #5A5450; }
.zt-cl li.done legend { color: var(--muted); }
.zt-cl .slider { display: flex; align-items: center; gap: 12px; }
.zt-cl .slider input { flex: 1; accent-color: var(--accent); }
.zt-cl .slider output { min-width: 28px; font-weight: 600; text-align: right; }
.zt-cl .foot { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; padding: 18px 24px; background: var(--bg); border-top: 1px solid var(--line); }
.zt-cl .note { font-size: 13px; color: var(--soft); margin: 0; }
.zt-cl .actions { display: flex; flex-wrap: wrap; gap: 8px; }
.zt-cl button { font: inherit; font-size: 15px; font-weight: 500; cursor: pointer; border: 0; border-radius: 12px; height: 46px; padding: 0 20px; display: inline-flex; align-items: center; gap: 8px; transition: background .2s, color .2s, box-shadow .2s; }
.zt-cl .primary { background: var(--ink); color: #fff; box-shadow: inset 0 1px 0 rgba(255,255,255,.18); }
.zt-cl .primary:hover { background: var(--accent); }
.zt-cl .ghost { background: #fff; color: var(--ink); box-shadow: inset 0 0 0 1px #DDD7D2; }
.zt-cl .ghost:hover { box-shadow: inset 0 0 0 1px var(--ink); }
.zt-cl .status { margin: 0; padding: 14px 24px; font-size: 14px; font-weight: 500; }
.zt-cl .status.ok { background: #E8F6EC; color: #1F7A45; }
.zt-cl .status.err { background: var(--accent-soft); color: #A42A3B; }
.zt-cl .status a { color: inherit; }
.zt-cl .quiz-result { padding: 22px 24px; border-top: 1px solid var(--line); background: var(--accent-soft); }
.zt-cl .quiz-result h3 { margin: 0 0 8px; font-size: 20px; letter-spacing: -.02em; }
.zt-cl .quiz-result .desc { font-size: 15px; line-height: 1.6; color: #3A3532; }
.zt-cl .quiz-result .desc * { all: revert; }
.zt-cl fieldset.quiz-q { display: block; }
.zt-cl fieldset.quiz-q legend { float: none; margin-bottom: 12px; }
.zt-cl .quiz-opts { display: grid; gap: 8px; }
.zt-cl .quiz-opt { display: flex; gap: 10px; align-items: flex-start; padding: 12px 14px; border-radius: 12px; box-shadow: inset 0 0 0 1px #DDD7D2; cursor: pointer; font-size: 15px; line-height: 1.45; margin: 0; }
.zt-cl .quiz-opt:hover { box-shadow: inset 0 0 0 1px var(--ink); }
.zt-cl .quiz-opt input { margin: 3px 0 0; accent-color: var(--accent); }
.zt-cl .quiz-opt:has(input:checked) { box-shadow: inset 0 0 0 1.5px var(--accent); background: var(--accent-soft); }
@media (max-width: 600px) {
  .zt-cl .head, .zt-cl .section, .zt-cl .foot, .zt-cl fieldset.q { padding-left: 16px; padding-right: 16px; }
  .zt-cl .opts { width: 100%; }
  .zt-cl .opt { flex: 1; }
  .zt-cl .opt span { width: 100%; min-width: 0; }
  .zt-cl .actions, .zt-cl .actions button { width: 100%; justify-content: center; }
}
/* Print: a copy of the checklist (with its answers) is placed in .zt-print-root
   on <body>; everything else is hidden, so the report starts at the top. */
@media screen { .zt-print-root { display: none !important; } }
@media print {
  html.zt-printing body > *:not(.zt-print-root) { display: none !important; }
  html.zt-printing body { background: #fff !important; margin: 0 !important; padding: 0 !important; }
  .zt-print-root .zt-cl { margin: 0; }
  .zt-print-root .zt-cl form { box-shadow: none; border: 1px solid #ccc; border-radius: 0; }
  .zt-print-root .zt-cl .foot, .zt-print-root .zt-cl .progress, .zt-print-root .zt-cl .status { display: none !important; }
  .zt-print-root .zt-cl fieldset.q { break-inside: avoid; padding: 8px 12px; }
  .zt-print-root .zt-cl .head, .zt-print-root .zt-cl .section { padding: 12px; }
  .zt-print-root .zt-cl .opt span { min-width: 44px; height: 26px; font-size: 12px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .zt-print-root .zt-cl .opt input:checked + span { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .zt-print-root .zt-cl input, .zt-print-root .zt-cl textarea { border: 0; border-bottom: 1px solid #999; border-radius: 0; min-height: 0; padding: 4px 0; }
  .zt-print-root .printed-on { font-size: 11px; color: #7A736E; margin: 0 0 8px; }
}
`;

// Page-level assets, added once per page that has a form.
export const FORMS_ASSETS = `<style>${CSS}</style><script src="/zt-forms.js" defer></script>`;

const optClass = (label: string) => (/^yes$/i.test(label) ? 'yes' : /^no$/i.test(label) ? 'no' : /^n\/?a$/i.test(label) ? 'na' : 'other');

function detailField(f: Field): string {
  const req = f.required ? ' required' : '';
  const name = `name="${esc(f.id)}"`;
  switch (f.type) {
    case 'name':
      return `<label class="fld"><span>${esc(f.label || 'Name')}</span><input type="text" ${name} autocomplete="name"${req}></label>`;
    case 'email':
      return `<label class="fld"><span>${esc(f.label || 'Email')}</span><input type="email" ${name} autocomplete="email"${req}></label>`;
    case 'phone':
      return `<label class="fld"><span>${esc(f.label || 'Phone')}</span><input type="tel" ${name} autocomplete="tel"${req}></label>`;
    case 'date':
      return `<label class="fld"><span>${esc(f.label || 'Date')}</span><input type="date" ${name}${req}></label>`;
    case 'number':
      return `<label class="fld"><span>${esc(f.label)}</span><input type="number" ${name}${req}></label>`;
    case 'address':
      return (f.parts ?? [])
        .map((p) => `<label class="fld${p.key === 'street_address' ? ' wide' : ''}"><span>${esc(p.label)}</span><input type="text" name="${esc(f.id)}-${p.key}"${p.key === 'street_address' ? ' autocomplete="street-address"' : ''}${req}></label>`)
        .join('');
    case 'textarea':
      return `<label class="fld wide"><span>${esc(f.label)}</span><textarea ${name}${req}></textarea></label>`;
    case 'slider':
      return `<label class="fld wide"><span>${esc(f.label)}</span><span class="slider"><input type="range" ${name} min="${f.min ?? 0}" max="${f.max ?? 10}" step="${f.step ?? 1}" value="${f.min ?? 0}"><output>${f.min ?? 0}</output></span></label>`;
    default:
      return f.multiline
        ? `<label class="fld wide"><span>${esc(f.label)}</span><textarea ${name}${req}></textarea></label>`
        : `<label class="fld"><span>${esc(f.label)}</span><input type="text" ${name}${req}></label>`;
  }
}

function question(f: Field, n: number): string {
  const opts = (f.options ?? [])
    .map((o) => `<label class="opt ${optClass(o)}"><input type="radio" name="${esc(f.id)}" value="${esc(o)}"><span>${esc(o)}</span></label>`)
    .join('');
  const num = String(n).padStart(2, '0');
  return `<li><fieldset class="q"><legend><span class="num">${num}</span><span>${esc(f.label)}</span></legend><div class="opts" role="radiogroup">${opts}</div></fieldset></li>`;
}

function humanize(slug: string) {
  return slug.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim().replace(/\b\w/g, (c) => c.toUpperCase());
}

export function renderForm(id: string, pageTitle: string): string {
  const form = load().forms[id];
  if (!form) return '';
  const questions = form.fields.filter((f) => QUESTION_TYPES.has(f.type));
  const details = form.fields.filter((f) => !QUESTION_TYPES.has(f.type));

  if (isChecklist(form)) {
    const title = pageTitle.replace(/\s+-\s+ZenTrades$/, '') || humanize(form.name);
    const submit = submissionsEnabled() ? '<button type="submit" class="ghost">Submit</button>' : '';
    return (
      `<div class="zt-cl" data-zt-form="checklist" data-form-id="${form.id}"><form novalidate>` +
      `<div class="head"><div><p class="title">${esc(title)}</p><p class="sub">${questions.length} inspection items · Yes / No / N/A</p></div>` +
      `<div class="progress" aria-live="polite"><span class="bar"><span></span></span><span class="count">0 / ${questions.length} answered</span></div></div>` +
      (details.length ? `<div class="section"><p class="section-title">Inspection details</p><div class="details">${details.map(detailField).join('')}</div></div>` : '') +
      `<ol class="items">${questions.map((q, i) => question(q, i + 1)).join('')}</ol>` +
      `<div class="foot"><p class="note">Your answers are saved in this browser.</p><div class="actions">${submit}<button type="button" class="ghost" data-action="clear">Clear</button><button type="button" class="primary" data-action="print">Print / Save as PDF</button></div></div>` +
      `<p class="status" hidden></p>` +
      `</form></div>`
    );
  }

  // Short forms (blog feedback, lead form): submitted to /api/forms.
  return (
    `<div class="zt-cl" data-zt-form="form" data-form-id="${form.id}" data-thanks="${esc(form.thankYou)}"><form novalidate>` +
    `<div class="section"><div class="details">${form.fields.map((f) => (QUESTION_TYPES.has(f.type) ? `<div class="fld wide"><span>${esc(f.label)}</span><div class="opts">${(f.options ?? []).map((o) => `<label class="opt ${optClass(o)}"><input type="radio" name="${esc(f.id)}" value="${esc(o)}"><span>${esc(o)}</span></label>`).join('')}</div></div>` : detailField(f))).join('')}</div></div>` +
    `<div class="foot"><span></span><div class="actions"><button type="submit" class="primary">Submit</button></div></div>` +
    `<p class="status" hidden></p>` +
    `</form></div>`
  );
}

export function renderQuiz(id: string): string {
  const quiz = load().quizzes[id];
  if (!quiz) return '';
  const results = Object.fromEntries(quiz.results.map((r) => [r.slug, { title: r.title, description: r.description }]));
  const qs = quiz.questions
    .map(
      (q, i) =>
        `<li><fieldset class="q quiz-q"><legend><span class="num">${String(i + 1).padStart(2, '0')}</span><span>${esc(q.title)}</span></legend><div class="quiz-opts">${q.answers
          .map((a) => `<label class="quiz-opt"><input type="radio" name="q${i}" value="${esc(a.result)}"><span>${esc(a.title)}</span></label>`)
          .join('')}</div></fieldset></li>`,
    )
    .join('');
  return (
    `<div class="zt-cl" data-zt-form="quiz"><form novalidate>` +
    `<div class="head"><div><p class="title">Which fire conference is right for you?</p><p class="sub">${quiz.questions.length} quick questions</p></div>` +
    `<div class="progress"><span class="bar"><span></span></span><span class="count">0 / ${quiz.questions.length} answered</span></div></div>` +
    `<ol class="items">${qs}</ol>` +
    `<div class="foot"><p class="note">Answer every question to see your match.</p><div class="actions"><button type="button" class="ghost" data-action="clear">Start over</button><button type="submit" class="primary">See my result</button></div></div>` +
    `<div class="quiz-result" hidden></div>` +
    `<script type="application/json" class="quiz-data">${JSON.stringify(results).replace(/</g, '\\u003c')}</script>` +
    `</form></div>`
  );
}
