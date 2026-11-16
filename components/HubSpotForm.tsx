'use client';
import { useEffect, useId } from 'react';

// The site's HubSpot demo-request form (the one on /book-demo), embedded in a
// page. HubSpot records the page URL with each submission.
const PORTAL_ID = '45865556';
const DEMO_FORM_ID = '3083ac2d-f381-402d-b230-a47b7f449e46';
const SCRIPT = 'https://js.hsforms.net/forms/embed/v2.js';

type Hbspt = { forms: { create: (opts: Record<string, unknown>) => void } };

function loadScript(): Promise<void> {
  const w = window as unknown as { hbspt?: Hbspt; __ztHs?: Promise<void> };
  if (w.hbspt) return Promise.resolve();
  w.__ztHs ??= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SCRIPT;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('HubSpot forms script failed to load'));
    document.head.appendChild(s);
  });
  return w.__ztHs;
}

export default function HubSpotForm({ formId = DEMO_FORM_ID }: { formId?: string }) {
  const id = 'hs-' + useId().replace(/[^a-zA-Z0-9_-]/g, '');

  useEffect(() => {
    let cancelled = false;
    loadScript()
      .then(() => {
        const el = document.getElementById(id);
        if (cancelled || !el || el.childElementCount) return;
        (window as unknown as { hbspt: Hbspt }).hbspt.forms.create({ region: 'na1', portalId: PORTAL_ID, formId, target: '#' + id });
      })
      .catch(() => {
        const el = document.getElementById(id);
        if (el && !cancelled)
          el.innerHTML = 'The form couldn’t load. <a href="/book-demo">Book a demo here</a> or email <a href="mailto:hello@zentrades.pro">hello@zentrades.pro</a>.';
      });
    return () => {
      cancelled = true;
    };
  }, [id, formId]);

  return <div id={id} className="zt-hsform" style={{ minHeight: 380 }} />;
}
