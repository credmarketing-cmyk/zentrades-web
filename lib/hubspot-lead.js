// Sends a lead from a redesigned page's own form to the same HubSpot form the
// old page used, through HubSpot's Forms Submission API (v3, made for custom
// forms). The embedded HubSpot forms render inside an iframe, so they can't be
// filled from the page; the API takes the same fields the form has.
//
// Fields of the site's forms (portal 45865556):
//   3083ac2d… demo (Book a Demo, Contact) and 6afda844… quote (Pricing):
//     demo_date, firstname*, lastname, company*, industry*, phone*, email*
//   4edd3e7f… feature pages: demo_date*, firstname* ("Your Name"), company*, email*, phone*
// (* required). demo_date is YYYY-MM-DD; industry must be one of HS_INDUSTRIES.

const PORTAL_ID = '45865556';

// The HubSpot "Industry" dropdown options: [value, label].
export const HS_INDUSTRIES = [
  ['HVAC + Plumbing Both', 'HVAC & Plumbing'],
  ['HVAC + Electrical + Plumbing (Residential & Commercial)', 'HVAC + Electrical + Plumbing (Residential & Commercial)'],
  ['Enterprise - HVAC & Plumbing', 'Enterprise - HVAC & Plumbing'],
  ['Mechanical Contractor', 'Mechanical Contractor'],
  ['Electrical Enterprise - Services', 'Electrical Enterprise - Services'],
  ['Electrical Enterprise - Construction', 'Electrical Enterprise - Construction'],
  ['Electrical - Transformer', 'Electrical - Transformer'],
  ['EV Charger', 'EV Charger'],
  ['Fire Inspection', 'FP Inspection'],
  ['Fire Protection', 'FP Construction'],
  ['Fire Enterprise - Services', 'Fire Enterprise - Services/Inspection'],
  ['Fire Enterprise - Construction', 'Fire Enterprise - Construction'],
  ['Fire + Security', 'Fire + Security'],
  ['Fire Door', 'Fire Door'],
  ['Backflow Testing', 'Backflow Testing'],
  ['Security', 'Security'],
  ['Elevator Inspection', 'Elevator Inspection'],
  ['Kitchen Equipment', 'Kitchen Equipment'],
  ['Water Restoration', 'Water Restoration'],
  ['Water Treatment', 'Water Treatment'],
  ['Water Purification', 'Water Purification'],
  ['Water Delivery', 'Water Delivery'],
  ['Pump Services', 'Pump Services'],
  ['Well Drilling', 'Well Drilling'],
  ['Garage Doors', 'Garage Doors'],
  ['Cleaning Services', 'Cleaning Services'],
  ['Janitorial Services', 'Janitorial Services'],
  ['Window Cleaning', 'Window Cleaning'],
  ['Chimney', 'Chimney'],
  ['Fireplace', 'Fireplace'],
  ['Pool Service', 'Pool Service'],
  ['Roofing Contractors', 'Roofing Contractors'],
  ['Pest Control', 'Pest Control'],
  ['Awning', 'Awning'],
  ['Locksmith', 'Locksmith'],
  ['Handyman Services', 'Handyman Services'],
  ['Appliance Repair', 'Appliance Repair'],
  ['Oil & Gas', 'Oil & Gas'],
  ['PE', 'PE'],
  ['PE Backed', 'PE Backed'],
  ['Other', 'Other'],
];

// A local calendar date as HubSpot's date format (YYYY-MM-DD).
export function isoDate(d) {
  const p = (n) => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}

const FIELD = { first: 'firstname', last: 'lastname', company: 'company', email: 'email', phone: 'phone', industry: 'industry', date: 'demo_date' };

const MESSAGES = {
  INVALID_EMAIL: 'Please enter a valid email address.',
  BLOCKED_EMAIL: 'Please use your work email address.',
  REQUIRED_FIELD: 'Please fill in all the required fields.',
  INVALID_NUMBER: 'Please enter a valid phone number.',
  NUMBER_OUT_OF_RANGE: 'Please enter a valid phone number.',
  INVALID_DATE: 'Please choose a valid date.',
};

function cookie(name) {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : '';
}

/**
 * lead: { first, last, company, email, phone, industry, date }
 * Resolves once HubSpot accepts the submission; rejects with a message to show.
 */
export async function submitLead(formId, lead) {
  const fields = Object.entries(FIELD)
    .filter(([key]) => lead[key] != null && String(lead[key]).trim() !== '')
    .map(([key, name]) => ({ objectTypeId: '0-1', name, value: String(lead[key]).trim() }));
  const hutk = cookie('hubspotutk');
  const body = { fields, context: { pageUri: location.href, pageName: document.title, ...(hutk ? { hutk } : {}) } };
  let res;
  try {
    res = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${formId}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('We couldn’t reach our form service. Please check your connection and try again, or email hello@zentrades.pro.');
  }
  if (res.ok) return;
  let data = {};
  try {
    data = await res.json();
  } catch {}
  const errors = Array.isArray(data.errors) ? data.errors : [];
  const msgs = [...new Set(errors.map((e) => MESSAGES[e.errorType] || ''))].filter(Boolean);
  throw new Error(msgs.length ? msgs.join(' ') : 'Something went wrong sending the form. Please try again or email hello@zentrades.pro.');
}
