import React, { useState } from 'react';
import { UpskillGap } from '../../types';
import { 
  Target, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Zap, 
  Calendar, 
  Edit3, 
  Trash2, 
  ArrowUpRight
} from 'lucide-react';


interface UpskillMatrixProps {
  gaps: UpskillGap[];
  onOpenModal: () => void;
  onEditGap: (gap: UpskillGap) => void;
  onDeleteGap: (id: string) => void;
  onToggleActionItem: (gapId: string, actionId: string) => void;
  onUpdateStatus: (gapId: string, status: 'identified' | 'in-progress' | 'mastered') => void;
}

export const UpskillMatrix: React.FC<UpskillMatrixProps> = ({
  gaps,
  onOpenModal,
  onEditGap,
  onDeleteGap,
  onToggleActionItem,
  onUpdateStatus
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredGaps = gaps.filter(g => {
    if (filterCategory !== 'all' && g.category !== filterCategory) return false;
    if (filterStatus !== 'all' && g.status !== filterStatus) return false;
    return true;
  });

  const inProgressCount = gaps.filter(g => g.status === 'in-progress').length;
  const masteredCount = gaps.filter(g => g.status === 'mastered').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl glass-card border border-slate-800 bg-slate-900/60">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" />
            Upskilling Roadmap & Changes Required
          </h3>
          <p className="text-sm text-slate-400">
            Identify technical skill gaps and execute concrete changes needed to transition to the next seniority tier.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Active Gaps</span>
              <span className="font-bold text-amber-400">{inProgressCount} In Progress</span>
            </div>
            <div className="h-6 w-px bg-slate-700" />
            <div>
              <span className="text-slate-400 block text-[10px]">Mastered</span>
              <span className="font-bold text-emerald-400">{masteredCount} Leveled Up</span>
            </div>
          </div>

          <button
            onClick={onOpenModal}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Upskill Target
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          {(['all', 'in-progress', 'identified', 'mastered'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                filterStatus === st
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st === 'all' ? 'All Gaps' : st.replace('-', ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['all', 'Frontend', 'Backend', 'System Design', 'DevOps'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all border ${
                filterCategory === cat
                  ? 'bg-slate-800 text-white border-indigo-500/50'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      {filteredGaps.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/20">
          <Target className="w-10 h-10 text-indigo-400/60 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-slate-300">No skill gaps found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Identify the engineering skills you want to level up next to build your promotion or mastery roadmap.
          </p>
          <button
            onClick={onOpenModal}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            Define First Upskill Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredGaps.map((gap) => {
            const completedActions = gap.actionItems.filter(a => a.completed).length;
            const progressPercent = gap.actionItems.length > 0
              ? Math.round((completedActions / gap.actionItems.length) * 100)
              : 0;

            const isMastered = gap.status === 'mastered';

            return (
              <div
                key={gap.id}
                className={`rounded-2xl border p-5 space-y-4 transition-all flex flex-col justify-between ${
                  isMastered
                    ? 'bg-slate-900/40 border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {gap.category}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          gap.priority === 'high'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}>
                          {gap.priority.toUpperCase()} PRIORITY
                        </span>
                        {isMastered && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            MASTERED
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-white pt-1">{gap.skillName}</h4>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onEditGap(gap)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                        title="Edit Upskill Plan"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this upskill plan?')) {
                            onDeleteGap(gap.id);
                          }
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                        title="Delete Upskill Plan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {gap.reasonForGap && (
                    <p className="text-xs text-slate-400">
                      {gap.reasonForGap}
                    </p>
                  )}
                </div>

                {/* Visual Proficiency Meter */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Current: <strong className="text-white">{gap.currentProficiency}/10</strong>
                    </span>
                    <span className="text-indigo-400 font-semibold flex items-center gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      Target: <strong className="text-emerald-400">{gap.targetProficiency}/10</strong>
                    </span>
                  </div>

                  <div className="relative h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    {/* Current level indicator */}
                    <div
                      className="absolute top-0 bottom-0 left-0 bg-indigo-500 rounded-full"
                      style={{ width: `${(gap.currentProficiency / 10) * 100}%` }}
                    />
                    {/* Target gap delta */}
                    <div
                      className="absolute top-0 bottom-0 bg-emerald-500/30 border-l border-emerald-400"
                      style={{
                        left: `${(gap.currentProficiency / 10) * 100}%`,
                        width: `${((gap.targetProficiency - gap.currentProficiency) / 10) * 100}%`
                      }}
                    />
                  </div>
                </div>

                {/* Changes Required Box (Highlighted prominently) */}
                <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/25 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                    <Zap className="w-3.5 h-3.5 text-indigo-400" />
                    Changes Required to Upskill:
                  </div>
                  <ul className="space-y-1 pl-1">
                    {gap.changesRequired.map((change, i) => (
                      <li key={i} className="text-xs text-slate-200 flex items-start gap-2">
                        <span className="text-indigo-400 font-bold shrink-0">•</span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Items Checklist */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Action Milestones ({completedActions}/{gap.actionItems.length})</span>
                    <span className="font-mono text-indigo-400 font-semibold">{progressPercent}%</span>
                  </div>

                  <div className="space-y-1.5">
                    {gap.actionItems.map((action) => (
                      <div
                        key={action.id}
                        onClick={() => onToggleActionItem(gap.id, action.id)}
                        className={`flex items-center gap-2.5 p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                          action.completed
                            ? 'bg-slate-950/40 text-slate-400 line-through'
                            : 'bg-slate-900/90 text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        {action.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                        <span className="truncate">{action.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Status & Date */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Target: {gap.targetDate ? new Date(gap.targetDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Ongoing'}</span>
                  </div>

                  <select
                    value={gap.status}
                    onChange={(e) => onUpdateStatus(gap.id, e.target.value as any)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="identified">Identified</option>
                    <option value="in-progress">In Progress</option>
                    <option value="mastered">Mastered</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
