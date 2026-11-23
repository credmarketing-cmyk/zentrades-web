// Sends a lead from a redesigned page's own form to HubSpot.
//
// The real HubSpot form is created off screen, the visitor's answers are
// copied into its fields and its own Submit is clicked, so HubSpot's
// validation, tracking cookie and workflows run exactly as on the embedded
// forms elsewhere on the site (same approach as the old pricing calculator).

const PORTAL_ID = '45865556';
const SCRIPT = 'https://js.hsforms.net/forms/embed/v2.js';

const FIELDS = {
  first: ['firstname'],
  last: ['lastname'],
  company: ['company'],
  email: ['email'],
  phone: ['phone', 'mobilephone'],
  plan: ['team_size', 'teamsize', 'company_size', 'number_of_licenses'],
  notes: ['message', 'your_message', 'comments', 'notes', 'how_can_we_help_you_', 'additional_information'],
};

function loadScript() {
  if (window.hbspt && window.hbspt.forms) return Promise.resolve();
  if (!window.__ztHsLoad) {
    window.__ztHsLoad = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = SCRIPT;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => {
        window.__ztHsLoad = null;
        reject(new Error('The form couldn’t connect. Please try again or email hello@zentrades.pro.'));
      };
      document.head.appendChild(s);
    });
  }
  return window.__ztHsLoad;
}

const forms = {};

// One hidden HubSpot form per form id, created on first use.
function hiddenForm(formId) {
  if (forms[formId]) return forms[formId];
  forms[formId] = loadScript().then(
    () =>
      new Promise((resolve, reject) => {
        const holder = document.createElement('div');
        holder.id = 'zt-hs-' + formId.slice(0, 8);
        holder.setAttribute('aria-hidden', 'true');
        holder.style.cssText = 'position:absolute;left:-10000px;top:0;width:600px;height:1px;overflow:hidden';
        document.body.appendChild(holder);
        const state = { done: null };
        const timer = setTimeout(() => reject(new Error('The form took too long to load. Please try again.')), 15000);
        window.hbspt.forms.create({
          region: 'na1',
          portalId: PORTAL_ID,
          formId,
          target: '#' + holder.id,
          onFormReady: (form) => {
            clearTimeout(timer);
            const el = form && form.jquery ? form[0] : form instanceof HTMLElement ? form : holder.querySelector('form');
            resolve({ holder, state, form: el || holder.querySelector('form') });
          },
          onFormSubmitted: () => state.done && state.done(),
        });
      }),
  );
  forms[formId].catch(() => delete forms[formId]);
  return forms[formId];
}

function setValue(el, value) {
  const proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, value);
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

function fieldByName(form, names) {
  for (const n of names) {
    const el = form.querySelector(`[name="${n}"]`);
    if (el) return el;
  }
  return null;
}

// Industry is a dropdown in HubSpot: pick the closest option.
function setIndustry(form, industry) {
  const label = [...form.querySelectorAll('label')].find((l) => /industry|trade/i.test(l.textContent || ''));
  const sel = (label && (form.querySelector('#' + CSS.escape(label.htmlFor || '_')) || label.closest('.hs-form-field')?.querySelector('select'))) || form.querySelector('select[name*="industry" i]');
  if (!sel || sel.tagName !== 'SELECT') return;
  const want = String(industry || '').toLowerCase();
  const opts = [...sel.options].filter((o) => o.value);
  const pick =
    (want && opts.find((o) => o.text.toLowerCase() === want)) ||
    (want && opts.find((o) => o.text.toLowerCase().includes(want) || want.includes(o.text.toLowerCase()))) ||
    (want && opts.find((o) => want.split(/\W+/).some((w) => w.length > 3 && o.text.toLowerCase().includes(w)))) ||
    opts.find((o) => /other/i.test(o.text)) ||
    null;
  if (pick) setValue(sel, pick.value);
}

/**
 * lead: { first, last, company, email, phone, industry, plan, notes }
 * Resolves once HubSpot accepts the submission; rejects with a message to show.
 */
export async function submitLead(formId, lead) {
  const { form, state, holder } = await hiddenForm(formId);
  if (!form) throw new Error('The form couldn’t load. Please try again or email hello@zentrades.pro.');
  for (const [key, names] of Object.entries(FIELDS)) {
    const v = lead[key];
    if (!v) continue;
    const el = fieldByName(form, names);
    if (el) setValue(el, String(v));
  }
  setIndustry(form, lead.industry);
  // Consent checkboxes the visitor agreed to by submitting (the design shows the notice).
  form.querySelectorAll('input[type=checkbox][required]').forEach((c) => {
    if (!c.checked) c.click();
  });
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      state.done = null;
      const errs = [...form.querySelectorAll('.hs-error-msg, .hs-error-msgs label')].map((e) => e.textContent.trim()).filter(Boolean);
      reject(new Error(errs.length ? 'Please check your details: ' + [...new Set(errs)].join(' ') : 'Something went wrong sending the form. Please try again or email hello@zentrades.pro.'));
    }, 8000);
    state.done = () => {
      clearTimeout(timer);
      state.done = null;
      // HubSpot swaps the form for its thank-you message: the next lead gets a fresh form.
      delete forms[formId];
      setTimeout(() => holder.remove(), 1000);
      resolve();
    };
    const btn = form.querySelector('input[type=submit], button[type=submit]');
    if (btn) btn.click();
    else form.requestSubmit ? form.requestSubmit() : form.submit();
  });
}
