import 'dotenv/config';
import express from 'express';
import { processFeedback } from '../api/_lib/email.js';

const app = express();
app.use(express.json({ limit: '4mb' }));

app.post('/api/submit-feedback', async (req, res) => {
  const result = await processFeedback(req.body, req.ip || 'local');
  res.status(result.status).json(result.body);
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 8787;
app.listen(PORT, () => {
  console.log(`Local dev API server on port ${PORT} (Vercel uses api/submit-feedback.ts instead)`);
});
