import React, { useState, useEffect } from 'react';
import { UpskillGap, TaskCategory, Priority, UpskillActionItem } from '../../types';
import { X, Check, Target, Plus, Trash2, Zap } from 'lucide-react';

interface UpskillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveGap: (gap: UpskillGap) => void;
  initialGap?: UpskillGap | null;
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

export const UpskillModal: React.FC<UpskillModalProps> = ({
  isOpen,
  onClose,
  onSaveGap,
  initialGap
}) => {
  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState<TaskCategory>('System Design');
  const [currentProficiency, setCurrentProficiency] = useState<number>(5);
  const [targetProficiency, setTargetProficiency] = useState<number>(9);
  const [reasonForGap, setReasonForGap] = useState('');
  const [changesRequiredInput, setChangesRequiredInput] = useState('');
  const [actionItems, setActionItems] = useState<UpskillActionItem[]>([
    { id: 'item-1', text: '', completed: false }
  ]);
  const [priority, setPriority] = useState<Priority>('high');
  const [status, setStatus] = useState<'identified' | 'in-progress' | 'mastered'>('in-progress');
  const [targetDate, setTargetDate] = useState('');

  useEffect(() => {
    if (initialGap) {
      setSkillName(initialGap.skillName);
      setCategory(initialGap.category);
      setCurrentProficiency(initialGap.currentProficiency);
      setTargetProficiency(initialGap.targetProficiency);
      setReasonForGap(initialGap.reasonForGap);
      setChangesRequiredInput(initialGap.changesRequired.join('\n'));
      setActionItems(initialGap.actionItems);
      setPriority(initialGap.priority);
      setStatus(initialGap.status);
      setTargetDate(initialGap.targetDate);
    } else {
      setSkillName('');
      setCategory('System Design');
      setCurrentProficiency(5);
      setTargetProficiency(9);
      setReasonForGap('');
      setChangesRequiredInput('');
      setActionItems([{ id: `act-${Date.now()}`, text: '', completed: false }]);
      setPriority('high');
      setStatus('in-progress');
      // default 3 weeks out
      const future = new Date();
      future.setDate(future.getDate() + 21);
      setTargetDate(future.toISOString().split('T')[0]);
    }
  }, [initialGap, isOpen]);

  if (!isOpen) return null;

  const handleAddActionItem = () => {
    setActionItems([...actionItems, { id: `act-${Date.now()}`, text: '', completed: false }]);
  };

  const handleRemoveActionItem = (id: string) => {
    setActionItems(actionItems.filter(item => item.id !== id));
  };

  const handleActionChange = (id: string, text: string) => {
    setActionItems(actionItems.map(item => item.id === id ? { ...item, text } : item));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    const changes = changesRequiredInput
      .split('\n')
      .map(c => c.trim())
      .filter(Boolean);

    const validActionItems = actionItems.filter(i => i.text.trim().length > 0);

    const gapToSave: UpskillGap = {
      id: initialGap ? initialGap.id : `gap-${Date.now()}`,
      skillName: skillName.trim(),
      category,
      currentProficiency,
      targetProficiency,
      reasonForGap: reasonForGap.trim(),
      changesRequired: changes.length > 0 ? changes : ['Continuous practice and implementation'],
      actionItems: validActionItems.length > 0 ? validActionItems : [
        { id: `act-${Date.now()}`, text: `Master core principles of ${skillName}`, completed: false }
      ],
      priority,
      status,
      targetDate
    };

    onSaveGap(gapToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col glass-panel rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {initialGap ? 'Edit Upskill Plan' : 'Define Skill Gap & Changes Required'}
              </h3>
              <p className="text-xs text-slate-400">Map out the concrete changes and actions required to level up.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Skill or Competency *
              </label>
              <input
                type="text"
                required
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="e.g. Distributed Caching & Redis Clustering"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Domain
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

          {/* Proficiency Gap Sliders */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>Proficiency Gap Analysis</span>
              <span className="text-indigo-400 font-mono">
                Level {currentProficiency} → Level {targetProficiency} (+{Math.max(0, targetProficiency - currentProficiency)} gap)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Current Level ({currentProficiency}/10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentProficiency}
                  onChange={(e) => setCurrentProficiency(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Target Level ({targetProficiency}/10)
                </label>
                <input
                  type="range"
                  min={currentProficiency}
                  max="10"
                  value={targetProficiency}
                  onChange={(e) => setTargetProficiency(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Reason for Gap / Context
            </label>
            <textarea
              rows={2}
              value={reasonForGap}
              onChange={(e) => setReasonForGap(e.target.value)}
              placeholder="Why is this skill needed? (e.g. Preparing for Senior Architect interviews or scaling backend past 10k RPS)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Changes Required to Upskill (Key requirement from user prompt) */}
          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
            <label className="block text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-400" />
              Changes Required to Upskill (1 per line) *
            </label>
            <p className="text-[11px] text-slate-400">
              Specific, actionable engineering changes or mental shifts needed to bridge this gap:
            </p>
            <textarea
              rows={3}
              required
              value={changesRequiredInput}
              onChange={(e) => setChangesRequiredInput(e.target.value)}
              placeholder="e.g.
- Replace synchronous API calls with event streams
- Master Redis eviction policies and pipeline transactions
- Write automated load tests with k6 before deploying"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900/90 border border-indigo-500/40 text-white text-xs font-mono focus:outline-none focus:border-indigo-400 transition-all"
            />
          </div>

          {/* Concrete Action Items checklist */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                Milestone Action Items
              </label>
              <button
                type="button"
                onClick={handleAddActionItem}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                <Plus className="w-3.5 h-3.5" /> Add Step
              </button>
            </div>

            <div className="space-y-2">
              {actionItems.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 w-4 font-mono">{index + 1}.</span>
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => handleActionChange(item.id, e.target.value)}
                    placeholder="Specific milestone task..."
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                  {actionItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveActionItem(item.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="identified">Identified</option>
                <option value="in-progress">In Progress</option>
                <option value="mastered">Mastered / Level Reached</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Deadline
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
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
              {initialGap ? 'Update Upskill Plan' : 'Save Upskill Requirement'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
