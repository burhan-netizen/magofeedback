import type { VercelRequest, VercelResponse } from '@vercel/node';
import { processFeedback } from './_lib/email.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    let payload: unknown = req.body;
    if (typeof payload === 'string') payload = JSON.parse(payload);

    const forwarded = req.headers['x-forwarded-for'];
    const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded || '').split(',')[0].trim() || 'unknown';

    const result = await processFeedback(payload, ip);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error('Unhandled error in submit-feedback:', err);
    return res.status(500).json({ success: false, error: 'Something went wrong on our side.' });
  }
}
