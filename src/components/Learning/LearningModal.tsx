import React, { useState, useEffect } from 'react';
import { LearningEntry, TaskCategory } from '../../types';
import { X, Check, BookOpen, Lightbulb, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface LearningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveEntry: (entry: LearningEntry) => void;
  initialEntry?: LearningEntry | null;
  currentDate: string;
}

const CATEGORIES: TaskCategory[] = [
  'Frontend',
  'Backend',
  'System Design',
  'DevOps',
  'Algorithms',
  'Architecture',
  'Soft Skills'
];

export const LearningModal: React.FC<LearningModalProps> = ({
  isOpen,
  onClose,
  onSaveEntry,
  initialEntry,
  currentDate
}) => {
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Frontend');
  const [summary, setSummary] = useState('');
  const [ahaMoment, setAhaMoment] = useState('');
  const [challengeFaced, setChallengeFaced] = useState('');
  const [howSolved, setHowSolved] = useState('');
  const [masteryScore, setMasteryScore] = useState<number>(8);
  const [hoursSpent, setHoursSpent] = useState<number>(2.0);
  const [tagsInput, setTagsInput] = useState('');
  const [date, setDate] = useState(currentDate);

  useEffect(() => {
    if (initialEntry) {
      setTopic(initialEntry.topic);
      setCategory(initialEntry.category);
      setSummary(initialEntry.summary);
      setAhaMoment(initialEntry.ahaMoment);
      setChallengeFaced(initialEntry.challengeFaced);
      setHowSolved(initialEntry.howSolved);
      setMasteryScore(initialEntry.masteryScore);
      setHoursSpent(initialEntry.hoursSpent);
      setTagsInput(initialEntry.tags.join(', '));
      setDate(initialEntry.date);
    } else {
      setTopic('');
      setCategory('Frontend');
      setSummary('');
      setAhaMoment('');
      setChallengeFaced('');
      setHowSolved('');
      setMasteryScore(8);
      setHoursSpent(2.0);
      setTagsInput('');
      setDate(currentDate);
    }
  }, [initialEntry, currentDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const entryToSave: LearningEntry = {
      id: initialEntry ? initialEntry.id : `learn-${Date.now()}`,
      date,
      topic: topic.trim(),
      category,
      summary: summary.trim(),
      ahaMoment: ahaMoment.trim(),
      challengeFaced: challengeFaced.trim(),
      howSolved: howSolved.trim(),
      masteryScore,
      hoursSpent: Number(hoursSpent) || 1,
      tags,
      evidenceIds: initialEntry ? initialEntry.evidenceIds : []
    };

    onSaveEntry(entryToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col glass-panel rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {initialEntry ? 'Edit Daily Learning Reflection' : 'Log Daily Learning & Curve'}
              </h3>
              <p className="text-xs text-slate-400">Capture what clicked today and how obstacles were conquered.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Topic or Concept Mastered *
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Distributed Transactions & 2-Phase Commit"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Domain Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mastery Score Slider */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span>Comprehension & Mastery Score (1 to 10)</span>
              </label>
              <span className="text-sm font-bold text-indigo-400 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30">
                {masteryScore} / 10 {masteryScore >= 8 ? '🔥 Deep Mastery' : masteryScore >= 6 ? '⚡ Solid Grasp' : '🌱 Emerging'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={masteryScore}
              onChange={(e) => setMasteryScore(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1 - Just exposed</span>
              <span>5 - Can apply with docs</span>
              <span>10 - Intuitive mastery / Can teach</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Core Takeaway Summary
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="What core principle or mental model did you acquire today?"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Aha Moment */}
          <div>
            <label className="block text-xs font-semibold text-amber-300 mb-1.5 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              The "Aha!" Moment (What clicked?)
            </label>
            <textarea
              rows={2}
              value={ahaMoment}
              onChange={(e) => setAhaMoment(e.target.value)}
              placeholder="The specific insight that made everything make sense..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-500/30 text-white text-sm focus:outline-none focus:border-amber-400 transition-all resize-none"
            />
          </div>

          {/* Challenge & Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-rose-300 mb-1.5 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                Obstacle / Error Encountered
              </label>
              <textarea
                rows={2}
                value={challengeFaced}
                onChange={(e) => setChallengeFaced(e.target.value)}
                placeholder="What error, bug, or mental block did you encounter?"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-rose-500/30 text-white text-xs focus:outline-none focus:border-rose-400 transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-300 mb-1.5 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                How It Was Solved
              </label>
              <textarea
                rows={2}
                value={howSolved}
                onChange={(e) => setHowSolved(e.target.value)}
                placeholder="The workaround, fix, or conceptual refactor..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-emerald-500/30 text-white text-xs focus:outline-none focus:border-emerald-400 transition-all resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Hours Invested
              </label>
              <input
                type="number"
                step="0.5"
                min="0.25"
                value={hoursSpent}
                onChange={(e) => setHoursSpent(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. React, Sharding, Docker"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <Check className="w-4 h-4" />
              {initialEntry ? 'Update Reflection' : 'Save Learning Log'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
