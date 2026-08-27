import 'dotenv/config';
import express from 'express';
import { sendFeedbackEmail } from '../api/_lib/email.js';

const app = express();
app.use(express.json({ limit: '2mb' }));

app.post('/api/submit-feedback', async (req, res) => {
  const result = await sendFeedbackEmail(req.body);
  res.status(result.status).json(result.body);
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 8787;
app.listen(PORT, () => {
  console.log(`Local dev API server listening on port ${PORT} (Vercel deploys use api/submit-feedback.ts instead)`);
});
