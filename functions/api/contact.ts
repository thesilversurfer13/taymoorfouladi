/**
 * Cloudflare Pages Function: /api/contact
 *
 * Receives a JSON payload { name, email, subject, message } from the contact form,
 * validates it, and forwards the message to the configured destination.
 *
 * Configure these environment variables in the Cloudflare Pages dashboard
 * (Settings → Environment variables):
 *
 *   RESEND_API_KEY   — API key from https://resend.com (free tier: 100 emails/day)
 *   CONTACT_TO       — destination email address (your inbox)
 *   CONTACT_FROM     — sender address. Defaults to "onboarding@resend.dev" which
 *                      works without DNS setup. For a custom from-address, verify
 *                      your domain in Resend first.
 *
 * Without RESEND_API_KEY + CONTACT_TO the endpoint returns 503 so the form shows
 * a friendly "not configured yet" message — the email address is never exposed
 * in client-side HTML.
 */

interface Env {
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
}

interface ContactPayload {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  company?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let payload: ContactPayload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  if (payload.company && payload.company.trim() !== '') {
    return json({ ok: true, message: 'Thanks!' }, 200);
  }

  const name = (payload.name || '').trim().slice(0, 200);
  const email = (payload.email || '').trim().slice(0, 320);
  const subject = (payload.subject || '').trim().slice(0, 200);
  const message = (payload.message || '').trim().slice(0, 8000);

  if (!name || !email || !message) {
    return json({ error: 'Please fill in your name, email and message.' }, 400);
  }
  if (!EMAIL_RE.test(email)) {
    return json({ error: 'Please enter a valid email address.' }, 400);
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO) {
    console.warn(
      '[contact] RESEND_API_KEY or CONTACT_TO not set — see functions/api/contact.ts for setup.'
    );
    return json(
      {
        error: 'Contact form is not configured yet.',
        hint: 'Set RESEND_API_KEY and CONTACT_TO in the Cloudflare Pages dashboard.',
      },
      503
    );
  }

  const from = env.CONTACT_FROM || 'onboarding@resend.dev';
  const safeSubject = subject || `New message from ${name}`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #111; border-bottom: 2px solid #e5e5e5; padding-bottom: 12px;">New contact form message</h2>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr><td style="padding: 8px 0; color: #666; width: 100px;"><strong>From</strong></td><td style="padding: 8px 0;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;"><strong>Email</strong></td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        ${subject ? `<tr><td style="padding: 8px 0; color: #666;"><strong>Subject</strong></td><td style="padding: 8px 0;">${escapeHtml(subject)}</td></tr>` : ''}
      </table>
      <div style="background: #f7f7f7; padding: 16px; border-radius: 8px; white-space: pre-wrap; line-height: 1.5;">${escapeHtml(message)}</div>
      <p style="color: #999; font-size: 12px; margin-top: 20px;">Sent from taymoorfouladi.pages.dev</p>
    </div>
  `;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Taymoor Site <${from}>`,
        to: [env.CONTACT_TO],
        reply_to: email,
        subject: safeSubject,
        html,
      }),
    });

    if (!r.ok) {
      const errText = await r.text().catch(() => '');
      console.error('[contact] Resend error', r.status, errText);
      return json({ error: 'Could not send your message. Please try again later.' }, 502);
    }

    return json(
      { ok: true, message: 'Thanks — message received. I\u2019ll get back to you shortly.' },
      200
    );
  } catch (err) {
    console.error('[contact] Fetch failed', err);
    return json({ error: 'Could not send your message. Please try again later.' }, 502);
  }
};

export const onRequest: PagesFunction = async () => {
  return json({ error: 'Method not allowed' }, 405);
};
