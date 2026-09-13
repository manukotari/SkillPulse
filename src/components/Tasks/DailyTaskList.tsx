import React, { useState } from 'react';
import { Task, TaskCategory, ScreenEvidence } from '../../types';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  Camera, 
  Trash2, 
  Edit3, 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Sparkles
} from 'lucide-react';

interface DailyTaskListProps {
  tasks: Task[];
  evidenceList: ScreenEvidence[];
  currentDate: string;
  onDateChange: (date: string) => void;
  onToggleStatus: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onOpenTaskModal: () => void;
  onOpenCaptureModal: (taskId?: string) => void;
  onUpdateTime: (taskId: string, minutes: number) => void;
}

export const DailyTaskList: React.FC<DailyTaskListProps> = ({
  tasks,
  evidenceList,
  currentDate,
  onDateChange,
  onToggleStatus,
  onDeleteTask,
  onEditTask,
  onOpenTaskModal,
  onOpenCaptureModal,
  onUpdateTime
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Navigate date
  const shiftDate = (days: number) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + days);
    onDateChange(d.toISOString().split('T')[0]);
  };

  const isToday = currentDate === new Date().toISOString().split('T')[0];

  // Filter tasks for the selected date
  const dayTasks = tasks.filter(t => t.date === currentDate);

  const filteredTasks = dayTasks.filter(t => {
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  const completedCount = dayTasks.filter(t => t.status === 'completed').length;
  const totalMinutesSpent = dayTasks.reduce((acc, t) => acc + t.actualMinutes, 0);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">HIGH</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">MED</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">LOW</span>;
    }
  };

  const getCategoryColor = (category: TaskCategory) => {
    switch (category) {
      case 'Frontend': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'Backend': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'System Design': return 'text-violet-400 bg-violet-500/10 border-violet-500/20';
      case 'DevOps': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Algorithms': return 'text-pink-400 bg-pink-500/10 border-pink-500/20';
      case 'Architecture': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Date Bar & Quick Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl glass-card border border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-800/80 rounded-xl p-1 border border-slate-700">
            <button
              onClick={() => shiftDate(-1)}
              className="p-1.5 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1 font-semibold text-sm text-slate-100">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>
                {new Date(currentDate + 'T00:00:00').toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              {isToday && (
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wide rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  Today
                </span>
              )}
            </div>
            <button
              onClick={() => shiftDate(1)}
              className="p-1.5 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {!isToday && (
            <button
              onClick={() => onDateChange(new Date().toISOString().split('T')[0])}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              Jump to Today
            </button>
          )}
        </div>

        {/* Daily Stats Summary */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-slate-400">Completed</div>
            <div className="text-sm font-bold text-emerald-400">
              {completedCount} of {dayTasks.length} Tasks
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-right">
            <div className="text-xs text-slate-400">Time Invested</div>
            <div className="text-sm font-bold text-indigo-400">
              {Math.floor(totalMinutesSpent / 60)}h {totalMinutesSpent % 60}m
            </div>
          </div>
          <button
            onClick={onOpenTaskModal}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all ml-2"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Status filters */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          {(['all', 'todo', 'in-progress', 'completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st === 'all' ? 'All Status' : st.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {['all', 'Frontend', 'Backend', 'System Design', 'DevOps', 'Algorithms'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all border ${
                categoryFilter === cat
                  ? 'bg-slate-800 text-white border-indigo-500/50'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat === 'all' ? 'All Domains' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/20">
          <Sparkles className="w-10 h-10 text-indigo-400/60 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-slate-300">No tasks for this day & filter</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Plan your daily milestones and log screenshots of your achievements.
          </p>
          <button
            onClick={onOpenTaskModal}
            className="px-4 py-2 rounded-xl bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs font-semibold inline-flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Daily Task
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const taskEvidence = evidenceList.filter(e => e.taskId === task.id || task.evidenceIds.includes(e.id));
            const isDone = task.status === 'completed';

            return (
              <div
                key={task.id}
                className={`group rounded-2xl border p-4.5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isDone
                    ? 'bg-slate-900/40 border-slate-800/60 opacity-80'
                    : task.status === 'in-progress'
                    ? 'bg-slate-900/80 border-indigo-500/40 shadow-lg shadow-indigo-500/5'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Left section: Checkbox & Info */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <button
                    onClick={() => onToggleStatus(task.id)}
                    className="mt-0.5 shrink-0 text-slate-400 hover:text-emerald-400 transition-colors"
                    title={isDone ? 'Mark as In-Progress' : 'Mark as Completed'}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                    ) : task.status === 'in-progress' ? (
                      <div className="w-5 h-5 rounded-full border-2 border-indigo-400 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                      </div>
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 hover:text-slate-300" />
                    )}
                  </button>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${getCategoryColor(task.category)}`}>
                        {task.category}
                      </span>
                      {getPriorityBadge(task.priority)}
                      <h4 className={`text-sm font-semibold truncate ${isDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                        {task.title}
                      </h4>
                    </div>

                    {task.description && (
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    {/* Meta stats & Evidence badges */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {task.actualMinutes}m / {task.estimatedMinutes}m
                      </span>

                      {/* Quick +15m button */}
                      <button
                        onClick={() => onUpdateTime(task.id, task.actualMinutes + 15)}
                        className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono transition-colors"
                        title="Add 15 minutes to time spent"
                      >
                        +15m
                      </button>

                      {/* Screen Evidence link count */}
                      {taskEvidence.length > 0 && (
                        <span className="flex items-center gap-1 text-indigo-400 font-medium bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                          <Camera className="w-3 h-3" />
                          {taskEvidence.length} Proof{taskEvidence.length > 1 ? 's' : ''} Attached
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right section: Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {/* Capture Evidence button directly for this task */}
                  <button
                    onClick={() => onOpenCaptureModal(task.id)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600/30 hover:border-indigo-500/50 border border-slate-700 text-slate-300 hover:text-indigo-300 text-xs font-medium flex items-center gap-1.5 transition-all"
                    title="Open screen access popup to capture proof for this task"
                  >
                    <Camera className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="hidden sm:inline">Snap Proof</span>
                  </button>

                  <button
                    onClick={() => onEditTask(task)}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                    title="Edit Task"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Delete this task?')) {
                        onDeleteTask(task.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
