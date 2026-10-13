import { FeedbackSubmission } from '../types';
import { clearDraftDB, loadDraftDB, saveDraftDB } from './db';

export async function submitFeedback(payload: FeedbackSubmission): Promise<{ success: boolean; id?: string }> {
  const body = { ...payload, submittedAt: new Date().toISOString() };

  let response: Response;
  try {
    response = await fetch('/api/submit-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('We could not reach the server. Please check your connection.');
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error || 'We could not send your feedback.');
  }

  const data = (await response.json().catch(() => ({}))) as { success: boolean; id?: string };
  await clearDraftDB().catch(() => {});
  return { success: true, id: data.id };
}

export const saveDraft = (data: unknown) => saveDraftDB(data);
export const loadDraft = <T,>() => loadDraftDB<T>();
export const clearDraft = () => clearDraftDB();
