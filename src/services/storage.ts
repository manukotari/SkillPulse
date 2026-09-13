import { Task, LearningEntry, UpskillGap, ScreenEvidence } from '../types';
import { INITIAL_TASKS, INITIAL_LEARNING_ENTRIES, INITIAL_UPSKILL_GAPS, INITIAL_EVIDENCE } from './mockData';

const TASKS_KEY = 'skillpulse_tasks_v1';
const LEARNING_KEY = 'skillpulse_learning_v1';
const UPSKILL_KEY = 'skillpulse_upskill_v1';
const EVIDENCE_KEY = 'skillpulse_evidence_v1';

// IndexedDB Helper for Evidence (Screenshots can be large)
const DB_NAME = 'SkillPulseDB';
const DB_VERSION = 1;
const EVIDENCE_STORE = 'screen_evidence';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(EVIDENCE_STORE)) {
        db.createObjectStore(EVIDENCE_STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const StorageService = {
  // TASKS
  getTasks(): Task[] {
    const raw = localStorage.getItem(TASKS_KEY);
    if (!raw) {
      localStorage.setItem(TASKS_KEY, JSON.stringify(INITIAL_TASKS));
      return INITIAL_TASKS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_TASKS;
    }
  },

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  },

  // LEARNING ENTRIES
  getLearningEntries(): LearningEntry[] {
    const raw = localStorage.getItem(LEARNING_KEY);
    if (!raw) {
      localStorage.setItem(LEARNING_KEY, JSON.stringify(INITIAL_LEARNING_ENTRIES));
      return INITIAL_LEARNING_ENTRIES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_LEARNING_ENTRIES;
    }
  },

  saveLearningEntries(entries: LearningEntry[]): void {
    localStorage.setItem(LEARNING_KEY, JSON.stringify(entries));
  },

  // UPSKILL GAPS
  getUpskillGaps(): UpskillGap[] {
    const raw = localStorage.getItem(UPSKILL_KEY);
    if (!raw) {
      localStorage.setItem(UPSKILL_KEY, JSON.stringify(INITIAL_UPSKILL_GAPS));
      return INITIAL_UPSKILL_GAPS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_UPSKILL_GAPS;
    }
  },

  saveUpskillGaps(gaps: UpskillGap[]): void {
    localStorage.setItem(UPSKILL_KEY, JSON.stringify(gaps));
  },

  // EVIDENCE (SCREENSHOTS)
  async getEvidenceList(): Promise<ScreenEvidence[]> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(EVIDENCE_STORE, 'readonly');
        const store = tx.objectStore(EVIDENCE_STORE);
        const req = store.getAll();
        req.onsuccess = () => {
          const res = req.result as ScreenEvidence[];
          if (!res || res.length === 0) {
            // Seed mock evidence
            INITIAL_EVIDENCE.forEach((item) => StorageService.saveEvidence(item));
            resolve(INITIAL_EVIDENCE);
          } else {
            resolve(res);
          }
        };
        req.onerror = () => {
          const raw = localStorage.getItem(EVIDENCE_KEY);
          resolve(raw ? JSON.parse(raw) : INITIAL_EVIDENCE);
        };
      });
    } catch {
      const raw = localStorage.getItem(EVIDENCE_KEY);
      return raw ? JSON.parse(raw) : INITIAL_EVIDENCE;
    }
  },

  async saveEvidence(evidence: ScreenEvidence): Promise<void> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(EVIDENCE_STORE, 'readwrite');
        const store = tx.objectStore(EVIDENCE_STORE);
        const req = store.put(evidence);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      const current = localStorage.getItem(EVIDENCE_KEY);
      const list: ScreenEvidence[] = current ? JSON.parse(current) : [];
      const updated = [evidence, ...list.filter(e => e.id !== evidence.id)].slice(0, 5); // limit fallback to 5
      localStorage.setItem(EVIDENCE_KEY, JSON.stringify(updated));
    }
  },

  async deleteEvidence(id: string): Promise<void> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(EVIDENCE_STORE, 'readwrite');
        const store = tx.objectStore(EVIDENCE_STORE);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      const current = localStorage.getItem(EVIDENCE_KEY);
      if (current) {
        const list: ScreenEvidence[] = JSON.parse(current);
        localStorage.setItem(EVIDENCE_KEY, JSON.stringify(list.filter(e => e.id !== id)));
      }
    }
  },

  // EXPORT / IMPORT
  async exportAllData(): Promise<string> {
    const tasks = StorageService.getTasks();
    const learning = StorageService.getLearningEntries();
    const upskills = StorageService.getUpskillGaps();
    const evidence = await StorageService.getEvidenceList();
    const payload = {
      version: 1,
      timestamp: new Date().toISOString(),
      tasks,
      learning,
      upskills,
      evidence
    };
    return JSON.stringify(payload, null, 2);
  },

  async importAllData(jsonString: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonString);
      if (data.tasks) StorageService.saveTasks(data.tasks);
      if (data.learning) StorageService.saveLearningEntries(data.learning);
      if (data.upskills) StorageService.saveUpskillGaps(data.upskills);
      if (Array.isArray(data.evidence)) {
        for (const item of data.evidence) {
          await StorageService.saveEvidence(item);
        }
      }
      return true;
    } catch (e) {
      console.error('Failed to import data:', e);
      return false;
    }
  },

  resetToDefaults(): void {
    localStorage.removeItem(TASKS_KEY);
    localStorage.removeItem(LEARNING_KEY);
    localStorage.removeItem(UPSKILL_KEY);
    localStorage.removeItem(EVIDENCE_KEY);
    window.location.reload();
  }
};
