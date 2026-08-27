import { FeedbackSubmission } from '../types';
import { clearDraftDB, loadDraftDB, saveDraftDB, saveSubmissionDB } from './db';

export async function submitFeedback(payload: FeedbackSubmission): Promise<{ success: boolean; id: string }> {
  const submittedAt = new Date().toISOString();
  const submissionWithMeta = { ...payload, submittedAt };

  const response = await fetch('/api/submit-feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submissionWithMeta),
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody?.error || 'Failed to submit feedback. Please try again.');
  }

  const data = (await response.json()) as { success: boolean; id: string };
  const id = data.id || `ml-fb-${Date.now().toString(36)}`;

  try {
    await saveSubmissionDB({ ...submissionWithMeta, id });
  } catch (err) {
    console.warn('Submission persistence warning (non-blocking):', err);
  }

  return { success: true, id };
}

export async function saveDraft(data: unknown): Promise<void> {
  await saveDraftDB(data);
}

export async function loadDraft<T>(): Promise<T | null> {
  return await loadDraftDB<T>();
}

export async function clearDraft(): Promise<void> {
  await clearDraftDB();
}

