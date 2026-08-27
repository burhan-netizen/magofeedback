import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendFeedbackEmail } from './_lib/email.js';
import type { FeedbackSubmission } from '../src/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    // req.body should already be parsed JSON when Content-Type: application/json
    // is sent, but guard against it arriving as a raw string just in case.
    let payload = req.body as FeedbackSubmission | string | undefined;
    if (typeof payload === 'string') {
      payload = JSON.parse(payload) as FeedbackSubmission;
    }

    const result = await sendFeedbackEmail(payload as FeedbackSubmission);
    return res.status(result.status).json(result.body);
  } catch (err) {
    // Surfaced temporarily so we can see the exact failure from the browser
    // network tab without needing Vercel dashboard access. Safe to remove
    // once submissions are confirmed working.
    console.error('Unhandled error in submit-feedback:', err);
    return res.status(500).json({
      success: false,
      error: 'Unhandled server error',
      debug: err instanceof Error ? err.message : String(err),
    });
  }
}
