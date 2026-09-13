import React from 'react';
import { Task, LearningEntry } from '../../types';
import { Calendar, Flame } from 'lucide-react';

interface ConsistencyHeatmapProps {
  tasks: Task[];
  learningEntries: LearningEntry[];
  onSelectDate: (date: string) => void;
  selectedDate: string;
}

export const ConsistencyHeatmap: React.FC<ConsistencyHeatmapProps> = ({
  tasks,
  learningEntries,
  onSelectDate,
  selectedDate
}) => {
  // Generate the last 28 days (4 weeks x 7 days)
  const days = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const completedTasks = tasks.filter(t => t.date === dateStr && t.status === 'completed').length;
    const learnings = learningEntries.filter(l => l.date === dateStr).length;
    const totalActivity = completedTasks + learnings;

    days.push({
      date: dateStr,
      displayDate: d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
      completedTasks,
      learnings,
      totalActivity,
      isSelected: dateStr === selectedDate
    });
  }

  const getActivityColor = (count: number, isSelected: boolean) => {
    if (isSelected) return 'ring-2 ring-indigo-400 bg-indigo-500 scale-110';
    if (count === 0) return 'bg-slate-800/60 hover:bg-slate-700';
    if (count === 1) return 'bg-emerald-900/70 hover:bg-emerald-800 text-emerald-300';
    if (count === 2) return 'bg-emerald-700 hover:bg-emerald-600 text-emerald-100';
    return 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-sm shadow-emerald-500/20';
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800/80 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          <h3 className="text-base font-bold text-white">
            Daily Execution & Learning Habit Heatmap
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Less</span>
          <span className="w-3 h-3 rounded bg-slate-800/80" />
          <span className="w-3 h-3 rounded bg-emerald-900/70" />
          <span className="w-3 h-3 rounded bg-emerald-700" />
          <span className="w-3 h-3 rounded bg-emerald-500" />
          <span>More Active</span>
        </div>
      </div>

      <div className="grid grid-cols-7 sm:grid-cols-14 md:grid-cols-28 gap-2 pt-2">
        {days.map((day) => (
          <button
            key={day.date}
            onClick={() => onSelectDate(day.date)}
            className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-all group relative cursor-pointer ${getActivityColor(
              day.totalActivity,
              day.isSelected
            )}`}
            title={`${day.displayDate}: ${day.completedTasks} tasks done, ${day.learnings} learnings`}
          >
            <span className="text-[10px] font-mono opacity-80">
              {new Date(day.date + 'T00:00:00').getDate()}
            </span>

            {/* Micro tooltip on hover */}
            <div className="absolute bottom-full mb-2 hidden group-hover:block z-30 pointer-events-none bg-slate-900 text-white text-[10px] rounded-lg px-2.5 py-1.5 border border-slate-700 shadow-xl whitespace-nowrap">
              <p className="font-bold text-indigo-400">{day.displayDate}</p>
              <p className="text-slate-300">{day.completedTasks} tasks completed</p>
              <p className="text-slate-300">{day.learnings} learning reflections</p>
            </div>
          </button>
        ))}
      </div>

      <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          Click any square to inspect and filter tasks & learnings for that specific day
        </span>
        <span className="font-mono text-slate-400">Past 28 Days</span>
      </div>
    </div>
  );
};
