/**
 * IndexedDB storage layer for Mago Labs Feedback & Referral form.
 * Provides persistent asynchronous storage for large referral lists and client drafts.
 */

const DB_NAME = 'MagoLabsFeedbackDB';
const DB_VERSION = 1;
const STORE_DRAFTS = 'drafts';
const STORE_SUBMISSIONS = 'submissions';

const DRAFT_KEY = 'current_feedback_draft';
const LEGACY_DRAFT_KEY = 'mago_labs_feedback_draft_v1';
const LEGACY_SUBMISSIONS_KEY = 'mago_labs_feedback_submissions_v1';

let dbPromise: Promise<IDBDatabase> | null = null;

function isIndexedDBAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && 'indexedDB' in window && window.indexedDB !== null;
  } catch {
    return false;
  }
}

export function getDB(): Promise<IDBDatabase> {
  if (!isIndexedDBAvailable()) {
    return Promise.reject(new Error('IndexedDB is not available in this environment'));
  }

  if (!dbPromise) {
    dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_DRAFTS)) {
            db.createObjectStore(STORE_DRAFTS);
          }
          if (!db.objectStoreNames.contains(STORE_SUBMISSIONS)) {
            db.createObjectStore(STORE_SUBMISSIONS, { keyPath: 'id' });
          }
        };

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          reject(request.error || new Error('Failed to open IndexedDB'));
        };

        request.onblocked = () => {
          console.warn('IndexedDB database open blocked');
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  return dbPromise;
}

/**
 * Save draft into IndexedDB with automatic fallback
 */
export async function saveDraftDB(data: unknown): Promise<void> {
  try {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_DRAFTS, 'readwrite');
      const store = tx.objectStore(STORE_DRAFTS);
      const req = store.put(data, DRAFT_KEY);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Fallback to localStorage
    try {
      localStorage.setItem(LEGACY_DRAFT_KEY, JSON.stringify(data));
    } catch {
      // Ignore quota errors
    }
  }
}

/**
 * Load draft from IndexedDB, migrating from legacy localStorage if necessary
 */
export async function loadDraftDB<T>(): Promise<T | null> {
  try {
    const db = await getDB();
    const result = await new Promise<T | null>((resolve, reject) => {
      const tx = db.transaction(STORE_DRAFTS, 'readonly');
      const store = tx.objectStore(STORE_DRAFTS);
      const req = store.get(DRAFT_KEY);

      req.onsuccess = () => {
        resolve((req.result as T) || null);
      };
      req.onerror = () => reject(req.error);
      tx.onerror = () => reject(tx.error);
    });

    if (result) {
      return result;
    }
  } catch {
    // IndexedDB failed or unavailable, check localStorage below
  }

  // Check legacy localStorage for migration
  try {
    const legacyRaw = localStorage.getItem(LEGACY_DRAFT_KEY);
    if (legacyRaw) {
      const parsed = JSON.parse(legacyRaw) as T;
      // Asynchronously migrate into IndexedDB
      saveDraftDB(parsed).catch(() => {});
      return parsed;
    }
  } catch {
    // ignore
  }

  return null;
}

/**
 * Clear draft from both IndexedDB and legacy localStorage
 */
export async function clearDraftDB(): Promise<void> {
  try {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_DRAFTS, 'readwrite');
      const store = tx.objectStore(STORE_DRAFTS);
      const req = store.delete(DRAFT_KEY);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // ignore
  }

  try {
    localStorage.removeItem(LEGACY_DRAFT_KEY);
  } catch {
    // ignore
  }
}

/**
 * Save final submitted feedback to IndexedDB
 */
export async function saveSubmissionDB<T extends { id?: string }>(submission: T): Promise<void> {
  const submissionWithId = {
    ...submission,
    id: submission.id || `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    submittedAt: new Date().toISOString(),
  };

  try {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_SUBMISSIONS, 'readwrite');
      const store = tx.objectStore(STORE_SUBMISSIONS);
      const req = store.put(submissionWithId);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Fallback to localStorage
    try {
      const existingRaw = localStorage.getItem(LEGACY_SUBMISSIONS_KEY);
      const existing: unknown[] = existingRaw ? JSON.parse(existingRaw) : [];
      existing.push(submissionWithId);
      localStorage.setItem(LEGACY_SUBMISSIONS_KEY, JSON.stringify(existing));
    } catch {
      // ignore
    }
  }

  // Always ensure the draft is cleared upon submission
  await clearDraftDB();
}
