# SkillPulse

**A daily task, learning curve, and upskill tracker for developers — with built-in screen-capture proof-of-work and a real-time analytics dashboard.**

![React](https://img.shields.io/badge/React-18%2F19-06B6D4?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6366F1?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-0B0F19?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8)
![Recharts](https://img.shields.io/badge/Recharts-10B981?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)

---

## ✨ Overview

SkillPulse helps developers stay accountable to their own growth — one day at a time. It combines a **daily task hub**, a **learning reflection journal**, an **upskill gap-analysis engine**, and a **screen-capture proof-of-work system**, all wrapped in a glassmorphism dark-mode dashboard.

No backend, no sign-up — your data stays local (IndexedDB + LocalStorage), fully exportable as JSON whenever you want a backup.

---

## 🚀 Features

### 📋 Daily Task Hub
- Categorize tasks by domain (Frontend, Backend, System Design, DevOps, Algorithms, Architecture, Soft Skills)
- Priority tags (High / Medium / Low) and status tracking (Todo / In-Progress / Completed)
- Time logging: estimated vs. actual minutes, with a one-click +15m quick logger
- Attach screen-capture evidence directly to any task

### 📓 Daily Learning Curve & Reflection Journal
- Log what you learned, key mental models, and "Aha!" breakthroughs
- Track obstacles and the exact solution that resolved them
- 1–10 mastery/confidence slider per entry
- Searchable domain tags (`#React19`, `#PostgreSQL`, `#Docker`, etc.)

### 📈 Upskill & Gap Analysis Engine
- Map current role → target role (e.g. Frontend Dev → Senior Full-Stack)
- Diagnose skill gaps with a proficiency vs. target delta meter
- Concrete "Changes Required to Upskill" action items with milestone tracking
- Deadlines and status (Identified → In Progress → Mastered)

### 📸 Screen Capture — "Access Screen to Capture Daily Works"
- One-click capture via `navigator.mediaDevices.getDisplayMedia`
- High-res canvas snapshot with a full markup toolbar: pen, highlighter, color palette, undo/retake
- Clipboard paste (Ctrl+V) and drag-and-drop fallbacks
- Proof metadata: link snapshots to specific tasks or reflections

### 📊 Analytics Dashboard
- KPI cards: tasks completed, average mastery index, upskill progress, time invested, streak
- Learning Curve Chart (mastery vs. hours invested over time)
- Skill Gap Radar across all tracked domains
- Domain Focus Donut (task distribution by discipline)
- 28-day Consistency Heatmap (GitHub-style activity grid)

### 💾 Data Portability
- Full JSON export/import — your data, fully portable across devices
- "Reset to Demo Data" for a clean showcase state anytime

---

## 🎨 Design System

| Purpose | Color |
|---|---|
| Background | Midnight Slate `#0B0F19` |
| Primary Accent | Electric Indigo `#6366F1` |
| Learning Velocity | Cyan `#06B6D4` |
| Milestones / Success | Emerald `#10B981` |
| Warnings / Breakthroughs | Amber `#F59E0B` |
| High Priority / Obstacles | Rose `#F43F5E` |

Glassmorphism cards, subtle glow accents, and Plus Jakarta Sans typography throughout.

---

## 🛠️ Tech Stack

- **Framework:** React 18/19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Charts:** Recharts
- **Storage:** IndexedDB (media) + LocalStorage (structured data)

---

## 📦 Getting Started

```bash
# Clone the repo
git clone https://github.com/manukotari/SkillPulse.git
cd SkillPulse

# Install dependencies
npm install

# Run the dev server
npm run dev

# Build for production
npm run build
```

The app runs locally at `http://localhost:5173/` by default.

---

## 📖 User Guide

New to SkillPulse? Check the in-app onboarding guide for the recommended order of use — logging tasks, journaling reflections, setting upskill targets, and capturing proof-of-work — so the analytics dashboard reflects accurate, meaningful data from day one.

---

## 🗺️ Roadmap

- [ ] Cloud sync across devices
- [ ] Mobile-responsive capture flow
- [ ] Weekly/monthly digest reports
- [ ] Shareable public progress snapshots

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">Built with focus, one commit at a time. 🚀</p>
