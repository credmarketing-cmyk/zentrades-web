// Receives submissions from the native forms (lib/forms.ts, /zt-forms.js) and
// forwards them as JSON to FORMS_WEBHOOK_URL (Zapier, Make, HubSpot, a CRM…).
// Until that is set, submissions are declined and the form shows an email
// fallback; checklists hide their Submit button entirely.

const MAX_BYTES = 64 * 1024;

export async function POST(req: Request) {
  const webhook = process.env.FORMS_WEBHOOK_URL;
  if (!webhook) return Response.json({ error: 'Form submissions are not configured.' }, { status: 503 });

  const raw = await req.text();
  if (raw.length > MAX_BYTES) return Response.json({ error: 'Too large.' }, { status: 413 });

  let body: { formId?: unknown; kind?: unknown; page?: unknown; data?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: 'Invalid JSON.' }, { status: 400 });
  }
  if (!/^\d+$/.test(String(body.formId)) || typeof body.data !== 'object' || body.data === null) {
    return Response.json({ error: 'Invalid submission.' }, { status: 400 });
  }

  const res = await fetch(webhook, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      formId: Number(body.formId),
      kind: String(body.kind ?? ''),
      page: String(body.page ?? ''),
      data: body.data,
      submittedAt: new Date().toISOString(),
    }),
  });
  if (!res.ok) return Response.json({ error: 'Could not deliver the submission.' }, { status: 502 });
  return Response.json({ ok: true });
}
