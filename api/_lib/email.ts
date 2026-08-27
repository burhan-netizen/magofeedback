import type { FeedbackSubmission } from '../../src/types';

const stars = (n: number) => '★'.repeat(Math.max(0, Math.min(5, n))) + '☆'.repeat(5 - Math.max(0, Math.min(5, n)));

const esc = (value: unknown): string =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

function renderFeedbackEmail(payload: FeedbackSubmission): string {
  const { client, ratings, feedback, testimonial, referrals } = payload;

  const ratingRows = Object.entries(ratings)
    .map(
      ([key, value]) => `
        <tr>
          <td style="padding:4px 12px 4px 0;color:#52525b;text-transform:capitalize;">${esc(key)}</td>
          <td style="padding:4px 0;color:#18181b;font-weight:600;">${stars(Number(value))} (${esc(value)}/5)</td>
        </tr>`
    )
    .join('');

  const referralRows = (referrals || [])
    .map(
      (r) => `
        <tr>
          <td style="padding:6px 10px;border:1px solid #e4e4e7;">${esc(r.name)}</td>
          <td style="padding:6px 10px;border:1px solid #e4e4e7;">${esc(r.company)}</td>
          <td style="padding:6px 10px;border:1px solid #e4e4e7;">${esc(r.phone)}</td>
          <td style="padding:6px 10px;border:1px solid #e4e4e7;">${esc(r.service)}</td>
        </tr>`
    )
    .join('');

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;color:#18181b;">
    <h2 style="margin-bottom:4px;">New client feedback submitted</h2>
    <p style="color:#71717a;margin-top:0;">via Mago Labs Client Feedback Portal</p>

    <h3 style="margin-bottom:4px;">Client</h3>
    <p style="margin:0;">
      <strong>${esc(client.name)}</strong>${client.company ? ` — ${esc(client.company)}` : ''}<br/>
      ${client.email ? `<a href="mailto:${esc(client.email)}">${esc(client.email)}</a>` : '<span style="color:#a1a1aa;">No email provided</span>'}
    </p>

    <h3 style="margin-bottom:4px;margin-top:20px;">Ratings</h3>
    <table style="border-collapse:collapse;">${ratingRows}</table>

    <h3 style="margin-bottom:4px;margin-top:20px;">Feedback</h3>
    <p style="margin:0 0 8px;"><strong>What they liked:</strong><br/>${esc(feedback.liked).replace(/\n/g, '<br/>')}</p>
    <p style="margin:0 0 8px;"><strong>What could improve:</strong><br/>${esc(feedback.improvements).replace(/\n/g, '<br/>')}</p>
    <p style="margin:0;"><strong>Would recommend Mago Labs:</strong> ${esc(feedback.recommendation)}</p>

    ${
      testimonial?.text
        ? `<h3 style="margin-bottom:4px;margin-top:20px;">Testimonial</h3>
           <p style="margin:0;font-style:italic;">"${esc(testimonial.text)}"</p>
           <p style="margin:4px 0 0;color:#71717a;">Permission to use publicly: ${testimonial.permission ? 'Yes' : 'No'}</p>`
        : ''
    }

    ${
      referrals && referrals.length
        ? `<h3 style="margin-bottom:4px;margin-top:20px;">Referrals (${referrals.length})</h3>
           <table style="border-collapse:collapse;width:100%;">
             <tr style="background:#f4f4f5;">
               <th style="padding:6px 10px;border:1px solid #e4e4e7;text-align:left;">Name</th>
               <th style="padding:6px 10px;border:1px solid #e4e4e7;text-align:left;">Company</th>
               <th style="padding:6px 10px;border:1px solid #e4e4e7;text-align:left;">Phone</th>
               <th style="padding:6px 10px;border:1px solid #e4e4e7;text-align:left;">Service</th>
             </tr>
             ${referralRows}
           </table>`
        : ''
    }

    <p style="margin-top:24px;color:#a1a1aa;font-size:12px;">Submitted ${esc(payload.submittedAt || new Date().toISOString())}</p>
  </div>`;
}

export interface SendResult {
  ok: boolean;
  status: number;
  body: { success: boolean; id?: string; error?: string };
}

export async function sendFeedbackEmail(payload: FeedbackSubmission): Promise<SendResult> {
  if (!payload?.client?.name?.trim()) {
    return { ok: false, status: 400, body: { success: false, error: 'Missing required client info' } };
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const TO_EMAIL = process.env.FEEDBACK_TO_EMAIL || 'burhan@magolabs.in';
  // Must be on a domain verified in Resend, or the shared sandbox sender
  // (onboarding@resend.dev), which only delivers to the Resend account
  // owner's own inbox.
  const FROM_EMAIL = process.env.FEEDBACK_FROM_EMAIL || 'Mago Labs Feedback <onboarding@resend.dev>';

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return { ok: false, status: 500, body: { success: false, error: 'Email service is not configured' } };
  }

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        ...(payload.client.email?.trim() ? { reply_to: payload.client.email.trim() } : {}),
        subject: `New client feedback — ${payload.client.name} (${payload.client.company || 'N/A'})`,
        html: renderFeedbackEmail(payload),
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error('Resend API error:', resendRes.status, errText);
      return { ok: false, status: 502, body: { success: false, error: 'Failed to send email' } };
    }

    const data = (await resendRes.json()) as { id: string };
    return { ok: true, status: 200, body: { success: true, id: data.id } };
  } catch (err) {
    console.error('sendFeedbackEmail error:', err);
    return { ok: false, status: 500, body: { success: false, error: 'Internal server error' } };
  }
}
