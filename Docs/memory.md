# SkillPulse — Design Memory & Architecture Knowledge Base (`memory.md`)

> **Document Classification:** Engineering Design Memory & Architecture Decision Record (ADR)  
> **System Name:** SkillPulse  
> **Repository:** `https://github.com/manukotari/SkillPulse.git`  
> **Primary Maintainer:** Manoj Kumar  
> **Version:** 1.0.0 (Production Architecture)  
> **Last Updated:** September 2026  

---

## 1. Executive Identity & Core Philosophy

**SkillPulse** is an executive-grade, **Local-First Daily Command Center** designed for software engineers, technical learners, and architects. It unifies three critical operational cycles:
1. **Daily Execution:** High-granularity task board with domain tagging, priority filters, and quick time logging.
2. **Cognitive Retention:** Daily learning curve journal capturing breakthroughs ("Aha!" moments), blocker-resolution pairs, and 1–10 comprehension scores.
3. **Strategic Progression:** Upskill Engine diagnosing technical proficiency gaps and formulating concrete, actionable engineering changes.
4. **Verifiable Proof of Work:** Native screen-access popup providing high-resolution snapshotting, pen/highlighter markup, and local media persistence.

### Core Architectural Pillars:
* **Zero-Trust Privacy (Local-First):** User code, screenshots, and daily reflections never leave the client device.
* **Frictionless In-Flow Capture:** Grabbing a proof-of-work screenshot takes &lt;3 clicks and under 2 seconds.
* **Decoupled Time vs. Mastery:** Distinguishes hours clocked from true cognitive retention.
* **Measurable Seniority Upgrades:** Replaces vague career ambitions with concrete architectural deliverables.

---

## 2. Architecture Decision Records (ADRs)

### ADR-001: Hybrid Dual-Layer Storage Strategy
* **Status:** Accepted & Implemented
* **Context:** A web application storing high-resolution screen captures quickly exhausts the synchronous `window.localStorage` quota (~5 MB). Conversely, relational query logic (filtering tasks by date or category) is slower in raw IndexedDB without an ORM.
* **Decision:**
  * **Layer 1 — Structured Relational State (`LocalStorage`):** Tasks, Learning Entries, and Upskill Gaps are stored as JSON strings in `LocalStorage` (`skillpulse_tasks_v1`, `skillpulse_learning_v1`, `skillpulse_upskill_v1`). Read/write overhead is sub-millisecond.
  * **Layer 2 — Binary Blob / High-Res Media (`IndexedDB`):** Screen captures are stored in an IndexedDB object store (`SkillPulseDB`, store `screen_evidence`). Keyed by `id`, images are preserved in lossless PNG format with zero storage limits.
* **Consequences:** Zero remote cloud bills; infinite local screenshot capacity; sub-10ms dashboard boot time; offline-ready.

---

### ADR-002: Native Browser MediaDevices Capture vs. Extension Dependency
* **Status:** Accepted & Implemented
* **Context:** Traditional web apps require browser extensions or desktop companion daemons (Electron/Tauri) to capture user screens.
* **Decision:** Leverage native browser `navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: 'monitor' }, audio: false })`.
* **Execution Flow:**
  1. User triggers popup modal &rarr; Browser prompts native display picker (Screen, Window, Tab).
  2. Temporary invisible `<video>` element plays stream frame.
  3. Frame is projected onto an HTML5 `<canvas>` at full hardware resolution.
  4. All media stream tracks (`stream.getTracks().forEach(t => t.stop())`) are immediately terminated within 200ms to dismiss the OS recording indicator.
  5. Snapshot is rendered onto an interactive canvas allowing pen & highlighter annotations.
* **Consequences:** No extensions required; zero background battery drain; respects OS-level security permissions; fallback to `Ctrl+V` clipboard paste and manual file upload.

---

### ADR-003: Cognitive Learning Curve Dynamics Modeling
* **Status:** Accepted & Implemented
* **Context:** Developers often spend 6 hours on a task without grasping the underlying mental model, or spend 30 minutes reading an RFC that permanently upgrades their understanding.
* **Decision:** Track two orthogonal metrics per learning entry:
  * **Comprehension / Mastery Score (1 to 10):** Visualized as a luminous gradient area chart.
  * **Hours Invested:** Visualized as a dashed line overlay.
  * **Qualitative Pillars:** Mandatory "Aha! Breakthrough" and "Obstacle & How Solved" capture boxes.
* **Consequences:** Highlights high-efficiency learning days; exposes diminishing returns when tired; builds a personal troubleshooting encyclopedia.

---

### ADR-004: Actionable "Changes Required to Upskill" Engine
* **Status:** Accepted & Implemented
* **Context:** Most upskilling roadmaps are passive reading lists. Engineers struggle to translate high-level ambitions (e.g., "Learn Kubernetes") into observable behavioral changes.
* **Decision:** Every upskill target requires:
  1. Current Proficiency (1–10) vs Target Benchmark Level (1–10).
  2. Explicit **"Changes Required to Upskill"** bullet points (e.g., *"Replace naive full table scans with compound indexes"*, *"Deploy OpenTelemetry distributed tracing"*).
  3. Sub-action milestone checklists with automatic status transition (Identified &rarr; In Progress &rarr; Mastered).
* **Consequences:** Focuses developer energy exclusively on high-impact delta engineering.

---

## 3. Design System & Visual Tokens

The user interface follows a **Cyberpunk Glassmorphism** aesthetic, optimized for high information density, low eye strain during late-night coding sessions, and clean hierarchy.

### 3.1 Color Token Matrix

| Token | Hex Value | Role / Semantics |
|---|---|---|
| `--bg-midnight` | `#0B0F19` | Primary viewport canvas background |
| `--surface-card` | `rgba(30, 41, 59, 0.5)` | Glassmorphism card surface with `backdrop-blur-md` |
| `--border-subtle` | `rgba(255, 255, 255, 0.07)` | Sleek card border with hover highlight to `#6366F159` |
| `--accent-indigo` | `#6366F1` | Primary brand accent, task checkmark glow, primary buttons |
| `--accent-cyan` | `#06B6D4` | Learning curve velocity, Frontend domain badge |
| `--accent-emerald` | `#10B981` | Completed tasks, high mastery scores (&ge;8/10), verified proofs |
| `--accent-amber` | `#F59E0B` | "Aha!" breakthroughs, DevOps domain, medium priority |
| `--accent-rose` | `#F43F5E` | Critical bugs, high priority badges, blockers encountered |
| `--accent-violet` | `#8B5CF6` | System Design domain, Upskill roadmap progress bar |

### 3.2 Typography & Spacing
* **Primary Sans:** `Plus Jakarta Sans`, weights 400, 500, 600, 700, 800.
* **Monospace:** `JetBrains Mono` / `Consolas` for timers, query plans, timestamps, and tags.
* **Elevation:** Custom drop-shadows with subtle neon glow (`box-shadow: 0 0 25px -5px rgba(99, 102, 241, 0.3)`).

---

## 4. Component Hierarchy & Module Breakdown

```
src/
├── App.tsx                             # Top-level state orchestrator & active tab router
├── main.tsx                            # Root DOM mounting
├── index.css                           # Tailwind v4 directives & glassmorphism utilities
├── types/
│   └── index.ts                        # Master TypeScript contracts & interfaces
├── services/
│   ├── storage.ts                      # StorageService (IndexedDB + LocalStorage + JSON backup)
│   └── mockData.ts                     # Preloaded realistic engineering seed data
├── components/
│   ├── Navbar.tsx                      # Brand, tab switchers, backup menu, Quick Guide trigger
│   ├── Onboarding/
│   │   └── GettingStartedModal.tsx     # 5-step guided walkthrough for first-time users
│   ├── Dashboard/
│   │   ├── DashboardView.tsx           # Assembles KPI cards, charts, today's focus, & heatmap
│   │   ├── OverviewMetrics.tsx         # 5 KPI summary cards with dynamic progress bars
│   │   ├── LearningCurveChart.tsx      # Dual-axis Area & Line chart (Recharts)
│   │   ├── SkillGapRadar.tsx           # Multi-competency Current vs Target Radar (Recharts)
│   │   ├── TaskDistributionChart.tsx  # Donut pie chart of domain concentration (Recharts)
│   │   └── ConsistencyHeatmap.tsx      # 28-day GitHub-style interactive activity grid
│   ├── Tasks/
│   │   ├── DailyTaskList.tsx           # Task board with date shifting, filters, time loggers
│   │   └── TaskModal.tsx               # Create / edit task dialog
│   ├── Learning/
│   │   ├── LearningJournal.tsx         # Reflection cards, breakthroughs, and blocker records
│   │   └── LearningModal.tsx           # Reflection editor with 1–10 mastery score slider
│   ├── Upskill/
│   │   ├── UpskillMatrix.tsx           # Skill delta meters, changes required, action checklists
│   │   └── UpskillModal.tsx            # Upskill target configuration dialog
│   └── ScreenCapture/
│       ├── ScreenCaptureModal.tsx      # getDisplayMedia access, canvas annotation, evidence saver
│       └── WorkEvidenceGallery.tsx     # Thumbnail gallery with full-screen zoom lightbox
```

---

## 5. Master Data Models & Contracts

All contracts reside in [`src/types/index.ts`](file:///c:/Users/manoj/Desktop/React/SkillPulse/src/types/index.ts):

### 5.1 Task Model
```typescript
export type TaskCategory = 
  | 'Frontend' | 'Backend' | 'System Design' 
  | 'DevOps' | 'Algorithms' | 'Soft Skills' | 'Architecture';

export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: Priority;
  status: TaskStatus;
  date: string;              // YYYY-MM-DD
  estimatedMinutes: number;
  actualMinutes: number;
  evidenceIds: string[];     // IDs of attached ScreenEvidence
  createdAt: string;
}
```

### 5.2 Learning Reflection Model
```typescript
export interface LearningEntry {
  id: string;
  date: string;              // YYYY-MM-DD
  topic: string;
  category: TaskCategory;
  summary: string;
  ahaMoment: string;         // Breakthrough concept that clicked
  challengeFaced: string;    // Specific obstacle or bug
  howSolved: string;         // Solution or mental workaround
  masteryScore: number;      // 1 to 10
  hoursSpent: number;
  tags: string[];
  evidenceIds: string[];
}
```

### 5.3 Upskill Gap & Changes Model
```typescript
export interface UpskillActionItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface UpskillGap {
  id: string;
  skillName: string;
  category: TaskCategory;
  currentProficiency: number; // 1 to 10
  targetProficiency: number;  // 1 to 10
  reasonForGap: string;
  changesRequired: string[];  // Concrete engineering changes
  actionItems: UpskillActionItem[];
  priority: Priority;
  status: 'identified' | 'in-progress' | 'mastered';
  targetDate: string;
}
```

### 5.4 Screen Evidence Model
```typescript
export interface ScreenEvidence {
  id: string;
  timestamp: string;
  title: string;
  notes: string;
  imageData: string;         // Base64 PNG data URL stored in IndexedDB
  taskId?: string;           // Optional link to specific task
  category?: TaskCategory;
}
```

---

## 6. Edge Cases, Guardrails & Error Handling

1. **Screen Access Permission Denied:**
   * Handled gracefully via `try/catch` around `navigator.mediaDevices.getDisplayMedia`.
   * Displays an inline warning with helpful shortcuts:
     * Press <kbd>Ctrl+V</kbd> anywhere in the modal to paste clipboard screenshots.
     * Click *"Upload Image"* to load files manually.
     * Click *"Sample Workspace Snapshot"* to generate a zero-permission test canvas.
2. **Hardware Video Release:**
   * All tracks from `MediaStream` are immediately stopped: `stream.getTracks().forEach(t => t.stop())`. This prevents unwanted persistent screen-sharing indicators in the OS or browser.
3. **Canvas Drawing Scaling:**
   * Bounding client rect scaling is calculated on mouse events (`scaleX = canvas.width / rect.width`) to ensure annotations remain razor-sharp regardless of CSS modal scaling.
4. **Data Portability & Corruption Guard:**
   * `StorageService.importAllData()` validates JSON schema structure before saving to prevent state corruption.
   * `resetToDefaults()` provides a one-click reset to seed data if localStorage becomes corrupted.

---

## 7. Developer Onboarding & Build Runbook

### Local Development Setup:
```bash
# Clone the repository
git clone https://github.com/manukotari/SkillPulse.git
cd SkillPulse

# Install dependencies (Node 20+)
npm install

# Start Vite dev server (host enabled)
npm run dev

# Run TypeScript compilation & production bundle
npm run build
```

### Key Technical Dependencies:
* **`react` & `react-dom`:** v19.2.8
* **`vite`:** v8.3.0
* **`tailwindcss`:** v4.3.3 via `@tailwindcss/vite`
* **`lucide-react`:** Icons
* **`recharts`:** Area, Radar, and Donut charts (requires `react-is` for React 19 compatibility)

---

## 8. Strategic Extension Guide (v2.0 Architecture Roadmap)

### 8.1 Connecting Gemini AI Upskill Copilot
To integrate automatic upskilling suggestions based on daily logs:
1. In `src/services/aiService.ts`, initialize `@google/genai`:
   ```typescript
   import { GoogleGenAI } from '@google/genai';
   const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
   ```
2. Feed the last 7 `LearningEntry` objects to `gemini-2.5-flash` with a system prompt:
   ```
   "Given these daily engineering reflections, identify recurring bottlenecks, synthesize the developer's mastery trajectory, and output 3 concrete 'Changes Required to Upskill' formatted as JSON."
   ```
3. Populate the `UpskillGap` action items directly from the structured AI response.

### 8.2 Adding Multi-Device Cloud Sync
To add optional multi-device synchronization:
1. Replace or supplement `storage.ts` with a Supabase / Firebase adapter.
2. Store media snapshots in an S3/Cloud Storage bucket using signed URLs.
3. Use Row-Level Security (RLS) so each user only queries their authenticated records.

---

<p align="center"><strong>SkillPulse Design Memory v1.0.0 — Documented for longevity, rigor, and craft. 🚀</strong></p>
