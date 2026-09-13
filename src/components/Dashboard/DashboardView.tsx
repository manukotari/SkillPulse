import React from 'react';
import { Task, LearningEntry, UpskillGap, ScreenEvidence } from '../../types';
import { OverviewMetrics } from './OverviewMetrics';
import { LearningCurveChart } from './LearningCurveChart';
import { SkillGapRadar } from './SkillGapRadar';
import { TaskDistributionChart } from './TaskDistributionChart';
import { ConsistencyHeatmap } from './ConsistencyHeatmap';
import { 
  Camera, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Zap 
} from 'lucide-react';


interface DashboardViewProps {
  tasks: Task[];
  learningEntries: LearningEntry[];
  upskillGaps: UpskillGap[];
  evidenceList: ScreenEvidence[];
  currentDate: string;
  onSelectDate: (date: string) => void;
  onNavigateTab: (tab: 'dashboard' | 'tasks' | 'learning' | 'upskill' | 'evidence') => void;
  onOpenCaptureModal: (taskId?: string) => void;
  onToggleTaskStatus: (taskId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  learningEntries,
  upskillGaps,
  evidenceList,
  currentDate,
  onSelectDate,
  onNavigateTab,
  onOpenCaptureModal,
  onToggleTaskStatus
}) => {
  const todayTasks = tasks.filter(t => t.date === currentDate);
  const activeGaps = upskillGaps.filter(g => g.status === 'in-progress');


  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. KPI Cards Bar */}
      <OverviewMetrics
        tasks={tasks}
        learningEntries={learningEntries}
        upskillGaps={upskillGaps}
        evidenceList={evidenceList}
        currentDate={currentDate}
      />

      {/* 2. Main Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LearningCurveChart entries={learningEntries} />
        <SkillGapRadar gaps={upskillGaps} />
      </div>

      {/* 3. Task Distribution & Today's Focus Action Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Focus by Domain */}
        <div className="lg:col-span-1">
          <TaskDistributionChart tasks={tasks} />
        </div>

        {/* Today's Action Center & Quick Focus */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="text-base font-bold text-white">
                Today's Core Focus & Execution Center
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('tasks')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors"
            >
              View All Tasks <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Today's Tasks preview */}
          <div className="space-y-2">
            {todayTasks.length === 0 ? (
              <div className="p-6 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
                No tasks logged for today yet.
              </div>
            ) : (
              todayTasks.slice(0, 3).map((task) => {
                const isDone = task.status === 'completed';
                return (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all ${
                      isDone
                        ? 'bg-slate-900/30 border-slate-800/60 opacity-70'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => onToggleTaskStatus(task.id)}
                        className="text-slate-400 hover:text-emerald-400 shrink-0"
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500" />
                        )}
                      </button>
                      <div className="truncate">
                        <span className={`text-xs font-semibold block truncate ${isDone ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                          {task.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {task.category} • {task.actualMinutes}m / {task.estimatedMinutes}m
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenCaptureModal(task.id)}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600/30 border border-slate-700 text-slate-300 text-[11px] flex items-center gap-1 shrink-0 transition-colors"
                      title="Capture screen proof for this task"
                    >
                      <Camera className="w-3 h-3 text-indigo-400" />
                      <span className="hidden sm:inline">Snap</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Upskilling Highlights Banner */}
          {activeGaps.length > 0 && (
            <div className="p-3.5 rounded-xl bg-indigo-950/25 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Priority Upskill Requirement
                </span>
                <p className="text-xs font-semibold text-slate-200">
                  {activeGaps[0].skillName}
                </p>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  Required: {activeGaps[0].changesRequired[0]}
                </p>
              </div>

              <button
                onClick={() => onNavigateTab('upskill')}
                className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-semibold shrink-0 transition-all"
              >
                View Roadmap
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. Habit & Consistency Heatmap */}
      <ConsistencyHeatmap
        tasks={tasks}
        learningEntries={learningEntries}
        onSelectDate={onSelectDate}
        selectedDate={currentDate}
      />

      {/* 5. Work Evidence Strip (Screen Captures Showcase) */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-400" />
              Latest Daily Work Evidence & Screen Proofs
            </h3>
            <p className="text-xs text-slate-400">
              Visual proof captures confirming problem solving and code changes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenCaptureModal()}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
            >
              <Camera className="w-3.5 h-3.5" />
              Capture Screen
            </button>
            <button
              onClick={() => onNavigateTab('evidence')}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              Gallery ({evidenceList.length}) <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {evidenceList.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No screen captures saved yet. Click "Capture Screen" to snap your active work.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {evidenceList.slice(0, 4).map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigateTab('evidence')}
                className="group relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden cursor-pointer aspect-video flex flex-col justify-end"
              >
                <img
                  src={item.imageData}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="relative p-2.5 z-10">
                  <span className="text-[10px] font-bold text-indigo-300 block truncate">
                    {item.title}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">
                    {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
