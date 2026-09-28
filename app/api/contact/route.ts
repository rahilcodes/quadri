import { NextResponse } from 'next/server';
import { validateContact, type ContactFields } from '@/lib/contact';
import { site } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Contact form endpoint. Emails the enquiry through Resend.
 *
 * Environment (see .env.example):
 *   RESEND_API_KEY      required
 *   CONTACT_TO_EMAIL    required: the chambers' inbox
 *   CONTACT_FROM_EMAIL  required: a sender on a domain verified in Resend
 *
 * Rate limit: 5 messages per 10 minutes per IP address. The counter lives in
 * memory, so it is per server instance and resets on a cold start. That is a
 * speed bump for one function on a small site, not a guarantee; if abuse
 * appears, move the counter to Upstash or Vercel KV.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const MAX_BODY_BYTES = 8 * 1024;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  // keep the map from growing without bound
  if (hits.size > 5000) {
    for (const [key, times] of hits) if (times.every((time) => now - time >= WINDOW_MS)) hits.delete(key);
  }
  return false;
}

const text = (value: unknown) => (typeof value === 'string' ? value : '');
/** Header values must never carry a line break taken from user input. */
const oneLine = (value: string) => value.replace(/[\r\n]+/g, ' ').trim();

export async function POST(request: Request) {
  // Same-origin only: a browser always sends Origin on a cross-site POST.
  const origin = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (origin && host && new URL(origin).host !== host) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return NextResponse.json({ ok: false }, { status: 413 });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Honeypot: report success so the script learns nothing, and send nothing.
  if (text(body.company) !== '') return NextResponse.json({ ok: true });

  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  if (limited(ip)) {
    return NextResponse.json({ ok: false }, { status: 429, headers: { 'Retry-After': String(WINDOW_MS / 1000) } });
  }

  const fields: ContactFields = {
    name: text(body.name),
    phone: text(body.phone),
    matter: text(body.matter),
    message: text(body.message),
  };
  const errors = validateContact(fields);
  if (Object.keys(errors).length > 0) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    console.error('Contact form: RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL must all be set.');
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const sent = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `${site.shortName} website <${CONTACT_FROM_EMAIL}>`,
      to: [CONTACT_TO_EMAIL],
      subject: oneLine(`Website enquiry: ${fields.matter}, ${fields.name}`),
      // Plain text only: nothing the visitor typed is ever rendered as HTML.
      text: [
        `Name: ${oneLine(fields.name)}`,
        `Phone: ${oneLine(fields.phone)}`,
        `Matter type: ${fields.matter}`,
        '',
        fields.message.trim(),
        '',
        `Sent from the contact form on ${site.name}.`,
      ].join('\n'),
    }),
  }).catch((error: unknown) => {
    console.error('Contact form: could not reach Resend.', error);
    return null;
  });

  if (!sent?.ok) {
    if (sent) console.error('Contact form: Resend replied', sent.status, await sent.text());
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
