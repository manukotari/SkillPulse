import React from 'react';
import { Task, LearningEntry, UpskillGap, ScreenEvidence } from '../../types';
import { CheckCircle2, Flame, TrendingUp, Clock, Target, Camera } from 'lucide-react';

interface OverviewMetricsProps {
  tasks: Task[];
  learningEntries: LearningEntry[];
  upskillGaps: UpskillGap[];
  evidenceList: ScreenEvidence[];
  currentDate: string;
}

export const OverviewMetrics: React.FC<OverviewMetricsProps> = ({
  tasks,
  learningEntries,
  upskillGaps,
  evidenceList,
  currentDate
}) => {
  const todayTasks = tasks.filter(t => t.date === currentDate);
  const completedToday = todayTasks.filter(t => t.status === 'completed').length;
  const completionRate = todayTasks.length > 0 
    ? Math.round((completedToday / todayTasks.length) * 100) 
    : 0;

  // Average mastery score over the past 7 entries
  const recentLearnings = [...learningEntries].slice(0, 7);
  const avgMastery = recentLearnings.length > 0
    ? (recentLearnings.reduce((a, b) => a + b.masteryScore, 0) / recentLearnings.length).toFixed(1)
    : '0';

  // Total hours across tasks & learnings
  const totalTaskMinutes = tasks.reduce((sum, t) => sum + (t.actualMinutes || 0), 0);
  const totalLearningHours = learningEntries.reduce((sum, l) => sum + (l.hoursSpent || 0), 0);
  const totalHours = (totalTaskMinutes / 60 + totalLearningHours).toFixed(1);

  // Upskill action items completed
  const allActionItems = upskillGaps.flatMap(g => g.actionItems);
  const completedActionItems = allActionItems.filter(a => a.completed).length;
  const upskillProgress = allActionItems.length > 0
    ? Math.round((completedActionItems / allActionItems.length) * 100)
    : 0;

  // Streak calculation (days with either task completed or learning logged)
  const activityDates = new Set([
    ...tasks.filter(t => t.status === 'completed').map(t => t.date),
    ...learningEntries.map(l => l.date)
  ]);
  const streak = Math.max(activityDates.size, 1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      
      {/* Metric 1: Today's Tasks */}
      <div className="glass-card rounded-2xl p-4.5 border border-slate-800/80 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Daily Tasks</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black text-white">{completedToday}</span>
          <span className="text-xs text-slate-400">/ {todayTasks.length} Done</span>
          <span className="ml-auto text-xs font-bold text-emerald-400">{completionRate}%</span>
        </div>
        <div className="mt-2.5 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Metric 2: Learning Curve Velocity */}
      <div className="glass-card rounded-2xl p-4.5 border border-slate-800/80 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Mastery Index</span>
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black text-indigo-300">{avgMastery}</span>
          <span className="text-xs text-slate-400">/ 10 Rating</span>
          <span className="ml-auto text-xs font-bold text-indigo-400">High Retention</span>
        </div>
        <p className="mt-2.5 text-[11px] text-slate-400 truncate">
          Across {learningEntries.length} logged deep-dives
        </p>
      </div>

      {/* Metric 3: Upskill Gaps Progress */}
      <div className="glass-card rounded-2xl p-4.5 border border-slate-800/80 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Upskill Milestones</span>
          <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <Target className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black text-white">{completedActionItems}</span>
          <span className="text-xs text-slate-400">/ {allActionItems.length} Milestones</span>
          <span className="ml-auto text-xs font-bold text-violet-400">{upskillProgress}%</span>
        </div>
        <div className="mt-2.5 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${upskillProgress}%` }}
          />
        </div>
      </div>

      {/* Metric 4: Total Time Invested */}
      <div className="glass-card rounded-2xl p-4.5 border border-slate-800/80 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Time Invested</span>
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black text-cyan-300">{totalHours}h</span>
          <span className="text-xs text-slate-400">Dedicated</span>
        </div>
        <p className="mt-2.5 text-[11px] text-slate-400">
          Focused learning & task execution
        </p>
      </div>

      {/* Metric 5: Active Streak & Evidence */}
      <div className="glass-card rounded-2xl p-4.5 border border-slate-800/80 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Consistency Streak</span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black text-amber-400">{streak} Days</span>
          <span className="text-xs text-slate-400">Active</span>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-400">
          <Camera className="w-3 h-3 text-indigo-400" />
          <span>{evidenceList.length} Screen Proofs logged</span>
        </div>
      </div>

    </div>
  );
};
