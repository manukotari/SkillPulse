import React, { useState } from 'react';
import { LearningEntry, ScreenEvidence } from '../../types';
import { 
  BookOpen, 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  Clock, 
  Tag, 
  Edit3, 
  Trash2, 
  Camera, 
  TrendingUp 
} from 'lucide-react';

interface LearningJournalProps {
  entries: LearningEntry[];
  evidenceList: ScreenEvidence[];
  onOpenModal: () => void;
  onEditEntry: (entry: LearningEntry) => void;
  onDeleteEntry: (id: string) => void;
  onOpenCaptureModal: () => void;
}

export const LearningJournal: React.FC<LearningJournalProps> = ({
  entries,
  evidenceList,
  onOpenModal,
  onEditEntry,
  onDeleteEntry,
  onOpenCaptureModal
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredEntries = entries.filter(e => {
    if (filterCategory !== 'all' && e.category !== filterCategory) return false;
    return true;
  });

  const avgMastery = entries.length > 0
    ? (entries.reduce((a, b) => a + b.masteryScore, 0) / entries.length).toFixed(1)
    : '0';

  const totalHours = entries.reduce((a, b) => a + b.hoursSpent, 0).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl glass-card border border-slate-800 bg-slate-900/60">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            Daily Learning Curve & Reflection Journal
          </h3>
          <p className="text-sm text-slate-400">
            Track daily insights, breakthroughs, obstacles overcome, and how your comprehension curves grow.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Avg Mastery</span>
              <span className="font-bold text-indigo-400">{avgMastery} / 10</span>
            </div>
            <div className="h-6 w-px bg-slate-700" />
            <div>
              <span className="text-slate-400 block text-[10px]">Total Hours</span>
              <span className="font-bold text-emerald-400">{totalHours}h</span>
            </div>
          </div>

          <button
            onClick={onOpenModal}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Log Today's Learning
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {['all', 'Frontend', 'Backend', 'System Design', 'DevOps', 'Algorithms', 'Architecture'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
              filterCategory === cat
                ? 'bg-slate-800 text-white border-indigo-500/50'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            {cat === 'all' ? 'All Knowledge Domains' : cat}
          </button>
        ))}
      </div>

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/20">
          <TrendingUp className="w-10 h-10 text-indigo-400/60 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-slate-300">No reflections logged for this filter</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Documenting what clicked today helps cement long-term neural retention.
          </p>
          <button
            onClick={onOpenModal}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            Log Learning Entry
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => {
            const entryEvidence = evidenceList.filter(e => entry.evidenceIds.includes(e.id));

            return (
              <div
                key={entry.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 p-5 space-y-4 transition-all shadow-lg hover:shadow-indigo-500/5"
              >
                {/* Top Row: Date, Domain, Topic, Score */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {entry.category}
                    </span>
                    <h4 className="text-base font-bold text-white">{entry.topic}</h4>
                    <span className="text-xs text-slate-400 font-mono">
                      • {new Date(entry.date + 'T00:00:00').toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    {/* Mastery pill */}
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold">
                      <span className="text-slate-400">Mastery:</span>
                      <span className={entry.masteryScore >= 8 ? 'text-emerald-400' : 'text-amber-400'}>
                        {entry.masteryScore}/10
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {entry.hoursSpent}h
                    </div>

                    <button
                      onClick={() => onEditEntry(entry)}
                      className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
                      title="Edit Entry"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this learning reflection?')) {
                          onDeleteEntry(entry.id);
                        }
                      }}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Summary */}
                {entry.summary && (
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {entry.summary}
                  </p>
                )}

                {/* Highlights Grid: Aha moment + Challenge/Solution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Aha Moment */}
                  {entry.ahaMoment && (
                    <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-1">
                      <div className="font-semibold text-amber-400 flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4" />
                        Aha! Breakthrough
                      </div>
                      <p className="text-slate-300 pl-5">{entry.ahaMoment}</p>
                    </div>
                  )}

                  {/* Obstacle & Fix */}
                  {(entry.challengeFaced || entry.howSolved) && (
                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
                      {entry.challengeFaced && (
                        <div>
                          <span className="font-semibold text-rose-400 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> Block:
                          </span>
                          <span className="text-slate-300 ml-1">{entry.challengeFaced}</span>
                        </div>
                      )}
                      {entry.howSolved && (
                        <div>
                          <span className="font-semibold text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Solution:
                          </span>
                          <span className="text-slate-300 ml-1">{entry.howSolved}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Tags & Screen Evidence */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/60 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/60 text-[11px] font-mono flex items-center gap-1"
                      >
                        <Tag className="w-2.5 h-2.5 text-indigo-400" />
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Evidence counter or snap trigger */}
                  <div className="flex items-center gap-2">
                    {entryEvidence.length > 0 ? (
                      <span className="text-indigo-400 font-medium flex items-center gap-1 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 text-xs">
                        <Camera className="w-3.5 h-3.5" />
                        {entryEvidence.length} Screen Proof Attached
                      </span>
                    ) : (
                      <button
                        onClick={onOpenCaptureModal}
                        className="text-slate-400 hover:text-indigo-300 text-xs flex items-center gap-1 hover:underline"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        Attach Screen Proof
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
