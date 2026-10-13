import type { FeedbackSubmission } from '../../src/types';

/* ------------------------------------------------------------------ */
/* Result shape shared by the Vercel function and the local dev server */
/* ------------------------------------------------------------------ */

export interface SendResult {
  ok: boolean;
  status: number;
  body: { success: boolean; id?: string; error?: string };
}

const fail = (status: number, error: string): SendResult => ({ ok: false, status, body: { success: false, error } });
const okResult = (id?: string): SendResult => ({ ok: true, status: 200, body: { success: true, id } });

/* ------------------------------------------------------------------ */
/* Spam protection                                                     */
/* ------------------------------------------------------------------ */

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const MIN_FILL_MS = 8 * 1000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded on long-lived instances
  return recent.length > RATE_MAX;
}

/* ------------------------------------------------------------------ */
/* Input cleaning                                                      */
/* ------------------------------------------------------------------ */

const str = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);
const rating = (v: unknown) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? Math.max(0, Math.min(5, n)) : 0;
};
const RECS = ['Definitely', 'Probably', 'Not Sure', 'Probably Not'];
const PHOTO_RE = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;
const MAX_PHOTO_CHARS = 1_400_000; // roughly 1 MB of image

type Clean = Omit<FeedbackSubmission, 'hp' | 'startedAt'>;

function clean(raw: any): Clean {
  const photo = typeof raw?.testimonial?.photo === 'string' ? raw.testimonial.photo : '';
  const validPhoto = photo && photo.length <= MAX_PHOTO_CHARS && PHOTO_RE.test(photo) ? photo : '';
  return {
    client: {
      name: str(raw?.client?.name, 120),
      company: str(raw?.client?.company, 160),
      role: str(raw?.client?.role, 120),
      email: str(raw?.client?.email, 200),
    },
    ratings: {
      overall: rating(raw?.ratings?.overall),
      quality: rating(raw?.ratings?.quality),
      communication: rating(raw?.ratings?.communication),
      timeliness: rating(raw?.ratings?.timeliness),
      value: rating(raw?.ratings?.value),
    },
    feedback: {
      liked: str(raw?.feedback?.liked, 4000),
      improvements: str(raw?.feedback?.improvements, 4000),
      recommendation: RECS.includes(raw?.feedback?.recommendation) ? raw.feedback.recommendation : '',
    },
    testimonial: {
      text: str(raw?.testimonial?.text, 4000),
      permission: !!raw?.testimonial?.permission,
      photo: validPhoto || undefined,
      photoName: validPhoto ? str(raw?.testimonial?.photoName, 120) : undefined,
    },
    referrals: (Array.isArray(raw?.referrals) ? raw.referrals : []).slice(0, 10).map((r: any) => ({
      name: str(r?.name, 120),
      company: str(r?.company, 160),
      phone: str(r?.phone, 40),
      email: str(r?.email, 200),
      relationship: str(r?.relationship, 200),
      services: (Array.isArray(r?.services) ? r.services : []).slice(0, 6).map((s: unknown) => str(s, 60)),
      mentionMe: !!r?.mentionMe,
    })).filter((r: { name: string }) => r.name),
    submittedAt: str(raw?.submittedAt, 40) || new Date().toISOString(),
  };
}

/* ------------------------------------------------------------------ */
/* Email                                                               */
/* ------------------------------------------------------------------ */

const esc = (value: unknown): string =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
const nl = (s: string) => esc(s).replace(/\n/g, '<br/>');
const stars = (n: number) =>
  `<span style="color:#e0a92a;letter-spacing:2px;">${'★'.repeat(n)}</span><span style="color:#e4e1d9;letter-spacing:2px;">${'★'.repeat(5 - n)}</span>`;

const INK = '#0d0d0d';
const MUTED = '#7e7e7e';
const LINE = '#e4e1d9';
const AMBER = '#ffc53d';
const label = (t: string) =>
  `<p style="margin:28px 0 8px;font-family:Menlo,Consolas,monospace;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${MUTED};">${t}</p>`;

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-GB', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    }) + ' IST';
  } catch {
    return iso;
  }
}

function renderEmail(p: Clean): string {
  const { client, ratings, feedback, testimonial, referrals } = p;
  const low = ratings.overall > 0 && ratings.overall <= 3;

  const detailRows = (
    [
      ['Quality of work', ratings.quality],
      ['Communication', ratings.communication],
      ['Timeliness', ratings.timeliness],
      ['Value for money', ratings.value],
    ] as Array<[string, number]>
  )
    .map(
      ([k, v]) =>
        `<tr><td style="padding:3px 16px 3px 0;color:${MUTED};">${k}</td><td style="padding:3px 0;">${
          v ? `${stars(v)} <span style="color:${INK};">${v}/5</span>` : `<span style="color:${MUTED};">Skipped</span>`
        }</td></tr>`
    )
    .join('');

  const referralBlocks = referrals
    .map(
      (r, i) => `
      <div style="border:1px solid ${LINE};border-radius:12px;padding:14px 16px;margin:0 0 10px;">
        <p style="margin:0;font-weight:700;font-size:15px;color:${INK};">${i + 1}. ${esc(r.name)}${
          r.company ? `<span style="font-weight:400;color:${MUTED};">, ${esc(r.company)}</span>` : ''
        }</p>
        <p style="margin:6px 0 0;font-size:14px;">
          ${r.phone ? `<a href="tel:${esc(r.phone.replace(/[^\d+]/g, ''))}" style="color:${INK};">${esc(r.phone)}</a>` : ''}
          ${r.phone && r.email ? ' &nbsp;/&nbsp; ' : ''}
          ${r.email ? `<a href="mailto:${esc(r.email)}" style="color:${INK};">${esc(r.email)}</a>` : ''}
        </p>
        ${r.relationship ? `<p style="margin:6px 0 0;font-size:13px;color:${MUTED};">Connection: ${esc(r.relationship)}</p>` : ''}
        ${r.services.length ? `<p style="margin:4px 0 0;font-size:13px;color:${MUTED};">Might need: ${esc(r.services.join(', '))}</p>` : ''}
        <p style="margin:4px 0 0;font-size:13px;color:${r.mentionMe ? INK : '#c2410c'};">${
          r.mentionMe ? `OK to mention ${esc(client.name)} referred them` : `Do NOT mention ${esc(client.name)}`
        }</p>
      </div>`
    )
    .join('');

  return `<!doctype html><html><body style="margin:0;background:#fafaf8;">
  <div style="font-family:Poppins,Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;padding:32px 24px;color:${INK};font-size:15px;line-height:1.55;">
    <p style="margin:0 0 4px;font-size:22px;font-weight:800;letter-spacing:-0.3px;">Mago <span style="font-weight:400;color:${MUTED};">labs</span></p>
    <p style="margin:0 0 24px;font-family:Menlo,Consolas,monospace;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${MUTED};">Client feedback / ${esc(formatWhen(p.submittedAt || ''))}</p>

    ${
      low
        ? `<div style="background:#fff4d6;border-left:4px solid ${AMBER};padding:12px 16px;margin:0 0 20px;font-weight:600;">Rated ${ratings.overall}/5. Worth a personal follow up soon.</div>`
        : ''
    }

    <div style="background:#fff;border:1px solid ${LINE};border-radius:16px;padding:20px 22px;">
      <p style="margin:0;font-size:20px;font-weight:700;">${esc(client.name)}</p>
      <p style="margin:2px 0 0;color:${MUTED};">${esc([client.role, client.company].filter(Boolean).join(', '))}</p>
      <p style="margin:8px 0 0;">${client.email ? `<a href="mailto:${esc(client.email)}" style="color:${INK};">${esc(client.email)}</a>` : ''}</p>
      <p style="margin:16px 0 0;font-size:18px;">${stars(ratings.overall)} <strong>${ratings.overall}/5 overall</strong></p>
      <p style="margin:4px 0 0;color:${MUTED};">Would recommend: <strong style="color:${INK};">${esc(feedback.recommendation || 'Not answered')}</strong></p>
    </div>

    ${label('Detail ratings')}
    <table style="border-collapse:collapse;font-size:14px;">${detailRows}</table>

    ${label('Liked most')}
    <p style="margin:0;">${feedback.liked ? nl(feedback.liked) : `<span style="color:${MUTED};">Skipped</span>`}</p>

    ${label('Could do better')}
    <p style="margin:0;">${feedback.improvements ? nl(feedback.improvements) : `<span style="color:${MUTED};">Skipped</span>`}</p>

    ${label('Testimonial')}
    ${
      testimonial.text
        ? `<blockquote style="margin:0;padding:4px 0 4px 16px;border-left:3px solid ${AMBER};font-style:italic;">${nl(testimonial.text)}</blockquote>`
        : `<p style="margin:0;color:${MUTED};">None written</p>`
    }
    ${
      testimonial.text || testimonial.photo
        ? `<p style="margin:8px 0 0;font-size:13px;font-weight:600;color:${testimonial.permission ? '#15803d' : '#c2410c'};">${
            testimonial.permission ? 'Permission given to publish on website and social media' : 'Private: do not publish'
          }</p>`
        : ''
    }
    ${testimonial.photo ? `<p style="margin:4px 0 0;font-size:13px;color:${MUTED};">Photo or logo attached to this email.</p>` : ''}

    ${label(`Referrals (${referrals.length})`)}
    ${referrals.length ? referralBlocks : `<p style="margin:0;color:${MUTED};">No referrals this time.</p>`}

    <p style="margin:32px 0 0;padding-top:16px;border-top:1px solid ${LINE};font-size:12px;color:${MUTED};">Sent from the Mago Labs client feedback form. Reply to this email to answer ${esc(client.name)} directly.</p>
  </div></body></html>`;
}

async function sendEmail(p: Clean): Promise<{ ok: boolean; id?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error('RESEND_API_KEY is not set');
    return { ok: false };
  }
  const to = process.env.FEEDBACK_TO_EMAIL || 'burhan@magolabs.in';
  // Must be on a domain verified in Resend, or the sandbox sender, which only
  // delivers to the Resend account owner's own inbox.
  const from = process.env.FEEDBACK_FROM_EMAIL || 'Mago Labs Feedback <onboarding@resend.dev>';

  const subjectBits = [`${p.ratings.overall}/5`];
  if (p.referrals.length) subjectBits.push(`${p.referrals.length} referral${p.referrals.length > 1 ? 's' : ''}`);
  if (p.testimonial.text) subjectBits.push('testimonial');
  const subject = `Feedback from ${p.client.name}${p.client.company ? ` (${p.client.company})` : ''}: ${subjectBits.join(', ')}`;

  const attachments = p.testimonial.photo
    ? [
        {
          filename: `${(p.client.company || p.client.name).replace(/[^\w-]+/g, '-').toLowerCase() || 'client'}-photo.${
            p.testimonial.photo.slice(11, 15).startsWith('png') ? 'png' : p.testimonial.photo.slice(11, 15).startsWith('webp') ? 'webp' : 'jpg'
          }`,
          content: p.testimonial.photo.split(',')[1],
        },
      ]
    : undefined;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        ...(p.client.email ? { reply_to: p.client.email } : {}),
        subject,
        html: renderEmail(p),
        ...(attachments ? { attachments } : {}),
      }),
    });
    if (!res.ok) {
      console.error('Resend API error:', res.status, await res.text());
      return { ok: false };
    }
    const data = (await res.json()) as { id?: string };
    return { ok: true, id: data.id };
  } catch (err) {
    console.error('sendEmail error:', err);
    return { ok: false };
  }
}

/* ------------------------------------------------------------------ */
/* Google Sheet log (optional, set SHEETS_WEBHOOK_URL to enable)       */
/* ------------------------------------------------------------------ */

async function logToSheet(p: Clean): Promise<boolean | null> {
  const url = process.env.SHEETS_WEBHOOK_URL;
  if (!url) return null; // not configured
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const { photo: _photo, ...testimonial } = p.testimonial;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        secret: process.env.SHEETS_WEBHOOK_SECRET || '',
        ...p,
        testimonial: { ...testimonial, hasPhoto: !!p.testimonial.photo },
      }),
      redirect: 'follow',
      signal: controller.signal,
    });
    if (!res.ok) console.error('Sheet webhook error:', res.status);
    return res.ok;
  } catch (err) {
    console.error('Sheet webhook failed:', err);
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------------------------------------------ */
/* Entry point                                                         */
/* ------------------------------------------------------------------ */

export async function processFeedback(raw: unknown, ip = 'unknown'): Promise<SendResult> {
  if (!raw || typeof raw !== 'object') return fail(400, 'Something was missing from your answers.');
  const r = raw as FeedbackSubmission;

  // Bots: fill the hidden field or submit inhumanly fast. Pretend success, send nothing.
  if (r.hp && String(r.hp).trim()) return okResult();
  if (typeof r.startedAt === 'number' && Date.now() - r.startedAt < MIN_FILL_MS) return okResult();

  if (rateLimited(ip)) return fail(429, 'Too many submissions from this connection.');

  const p = clean(raw);
  if (!p.client.name || !p.client.email || !p.ratings.overall) {
    return fail(400, 'Your name, email and overall rating are needed.');
  }

  const [mail, sheet] = await Promise.all([sendEmail(p), logToSheet(p)]);
  if (mail.ok || sheet === true) return okResult(mail.id);
  return fail(502, 'We could not send your feedback just now.');
}

/** @deprecated kept for older imports */
export const sendFeedbackEmail = (payload: FeedbackSubmission) => processFeedback(payload);
