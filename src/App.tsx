import { useState, useEffect } from 'react';
import { Task, LearningEntry, UpskillGap, ScreenEvidence } from './types';
import { StorageService } from './services/storage';
import { Navbar, ActiveTab } from './components/Navbar';
import { DashboardView } from './components/Dashboard/DashboardView';
import { DailyTaskList } from './components/Tasks/DailyTaskList';
import { TaskModal } from './components/Tasks/TaskModal';
import { LearningJournal } from './components/Learning/LearningJournal';
import { LearningModal } from './components/Learning/LearningModal';
import { UpskillMatrix } from './components/Upskill/UpskillMatrix';
import { UpskillModal } from './components/Upskill/UpskillModal';
import { WorkEvidenceGallery } from './components/ScreenCapture/WorkEvidenceGallery';
import { ScreenCaptureModal } from './components/ScreenCapture/ScreenCaptureModal';
import { GettingStartedModal } from './components/Onboarding/GettingStartedModal';
import { Camera } from 'lucide-react';


export function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [learningEntries, setLearningEntries] = useState<LearningEntry[]>([]);
  const [upskillGaps, setUpskillGaps] = useState<UpskillGap[]>([]);
  const [evidenceList, setEvidenceList] = useState<ScreenEvidence[]>([]);
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Modals state
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);
  const [captureTaskId, setCaptureTaskId] = useState<string | undefined>(undefined);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [isLearningModalOpen, setIsLearningModalOpen] = useState(false);
  const [editingLearning, setEditingLearning] = useState<LearningEntry | null>(null);

  const [isUpskillModalOpen, setIsUpskillModalOpen] = useState(false);
  const [editingGap, setEditingGap] = useState<UpskillGap | null>(null);

  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);


  // Load initial data
  const loadData = async () => {
    const loadedTasks = StorageService.getTasks();
    const loadedLearnings = StorageService.getLearningEntries();
    const loadedGaps = StorageService.getUpskillGaps();
    const loadedEvidence = await StorageService.getEvidenceList();

    setTasks(loadedTasks);
    setLearningEntries(loadedLearnings);
    setUpskillGaps(loadedGaps);
    setEvidenceList(loadedEvidence);
  };

  useEffect(() => {
    loadData();
  }, []);

  // TASK HANDLERS
  const handleSaveTask = (task: Task) => {
    let updated: Task[];
    const exists = tasks.some(t => t.id === task.id);
    if (exists) {
      updated = tasks.map(t => t.id === task.id ? task : t);
    } else {
      updated = [task, ...tasks];
    }
    setTasks(updated);
    StorageService.saveTasks(updated);
  };

  const handleToggleTaskStatus = (taskId: string) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'completed' 
          ? 'in-progress' 
          : t.status === 'in-progress' 
          ? 'completed' 
          : 'completed';
        return { ...t, status: nextStatus as any };
      }
      return t;
    });
    setTasks(updated);
    StorageService.saveTasks(updated);
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = tasks.filter(t => t.id !== taskId);
    setTasks(updated);
    StorageService.saveTasks(updated);
  };

  const handleUpdateTaskTime = (taskId: string, minutes: number) => {
    const updated = tasks.map(t => t.id === taskId ? { ...t, actualMinutes: minutes } : t);
    setTasks(updated);
    StorageService.saveTasks(updated);
  };

  // LEARNING REFLECTION HANDLERS
  const handleSaveLearning = (entry: LearningEntry) => {
    let updated: LearningEntry[];
    const exists = learningEntries.some(e => e.id === entry.id);
    if (exists) {
      updated = learningEntries.map(e => e.id === entry.id ? entry : e);
    } else {
      updated = [entry, ...learningEntries];
    }
    setLearningEntries(updated);
    StorageService.saveLearningEntries(updated);
  };

  const handleDeleteLearning = (id: string) => {
    const updated = learningEntries.filter(e => e.id !== id);
    setLearningEntries(updated);
    StorageService.saveLearningEntries(updated);
  };

  // UPSKILL GAP HANDLERS
  const handleSaveGap = (gap: UpskillGap) => {
    let updated: UpskillGap[];
    const exists = upskillGaps.some(g => g.id === gap.id);
    if (exists) {
      updated = upskillGaps.map(g => g.id === gap.id ? gap : g);
    } else {
      updated = [gap, ...upskillGaps];
    }
    setUpskillGaps(updated);
    StorageService.saveUpskillGaps(updated);
  };

  const handleDeleteGap = (id: string) => {
    const updated = upskillGaps.filter(g => g.id !== id);
    setUpskillGaps(updated);
    StorageService.saveUpskillGaps(updated);
  };

  const handleToggleGapActionItem = (gapId: string, actionId: string) => {
    const updated = upskillGaps.map(gap => {
      if (gap.id === gapId) {
        const nextItems = gap.actionItems.map(item => 
          item.id === actionId ? { ...item, completed: !item.completed } : item
        );
        const allDone = nextItems.length > 0 && nextItems.every(i => i.completed);
        return {
          ...gap,
          actionItems: nextItems,
          status: allDone ? ('mastered' as const) : gap.status
        };
      }
      return gap;
    });
    setUpskillGaps(updated);
    StorageService.saveUpskillGaps(updated);
  };

  const handleUpdateGapStatus = (gapId: string, status: 'identified' | 'in-progress' | 'mastered') => {
    const updated = upskillGaps.map(gap => 
      gap.id === gapId ? { ...gap, status } : gap
    );
    setUpskillGaps(updated);
    StorageService.saveUpskillGaps(updated);
  };

  // SCREEN CAPTURE EVIDENCE HANDLERS
  const handleSaveEvidence = async (evidence: ScreenEvidence, assignedTaskId?: string) => {
    await StorageService.saveEvidence(evidence);
    const updatedEvidence = [evidence, ...evidenceList.filter(e => e.id !== evidence.id)];
    setEvidenceList(updatedEvidence);

    // If attached to a task, update task's evidenceIds
    if (assignedTaskId) {
      const updatedTasks = tasks.map(t => {
        if (t.id === assignedTaskId && !t.evidenceIds.includes(evidence.id)) {
          return { ...t, evidenceIds: [...t.evidenceIds, evidence.id] };
        }
        return t;
      });
      setTasks(updatedTasks);
      StorageService.saveTasks(updatedTasks);
    }
  };

  const handleDeleteEvidence = async (id: string) => {
    await StorageService.deleteEvidence(id);
    setEvidenceList(evidenceList.filter(e => e.id !== id));
    // Remove from tasks as well
    const updatedTasks = tasks.map(t => ({
      ...t,
      evidenceIds: t.evidenceIds.filter(eid => eid !== id)
    }));
    setTasks(updatedTasks);
    StorageService.saveTasks(updatedTasks);
  };

  const openCaptureForTask = (taskId?: string) => {
    setCaptureTaskId(taskId);
    setIsCaptureModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCaptureModal={() => openCaptureForTask(undefined)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        evidenceCount={evidenceList.length}
        taskCount={tasks.filter(t => t.date === currentDate && t.status !== 'completed').length}
        onDataImported={loadData}
      />


      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            tasks={tasks}
            learningEntries={learningEntries}
            upskillGaps={upskillGaps}
            evidenceList={evidenceList}
            currentDate={currentDate}
            onSelectDate={(date) => {
              setCurrentDate(date);
              setActiveTab('tasks');
            }}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenCaptureModal={openCaptureForTask}
            onToggleTaskStatus={handleToggleTaskStatus}
          />
        )}

        {activeTab === 'tasks' && (
          <DailyTaskList
            tasks={tasks}
            evidenceList={evidenceList}
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            onToggleStatus={handleToggleTaskStatus}
            onDeleteTask={handleDeleteTask}
            onEditTask={(t) => {
              setEditingTask(t);
              setIsTaskModalOpen(true);
            }}
            onOpenTaskModal={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
            onOpenCaptureModal={openCaptureForTask}
            onUpdateTime={handleUpdateTaskTime}
          />
        )}

        {activeTab === 'learning' && (
          <LearningJournal
            entries={learningEntries}
            evidenceList={evidenceList}
            onOpenModal={() => {
              setEditingLearning(null);
              setIsLearningModalOpen(true);
            }}
            onEditEntry={(entry) => {
              setEditingLearning(entry);
              setIsLearningModalOpen(true);
            }}
            onDeleteEntry={handleDeleteLearning}
            onOpenCaptureModal={() => openCaptureForTask(undefined)}
          />
        )}

        {activeTab === 'upskill' && (
          <UpskillMatrix
            gaps={upskillGaps}
            onOpenModal={() => {
              setEditingGap(null);
              setIsUpskillModalOpen(true);
            }}
            onEditGap={(gap) => {
              setEditingGap(gap);
              setIsUpskillModalOpen(true);
            }}
            onDeleteGap={handleDeleteGap}
            onToggleActionItem={handleToggleGapActionItem}
            onUpdateStatus={handleUpdateGapStatus}
          />
        )}

        {activeTab === 'evidence' && (
          <WorkEvidenceGallery
            evidenceList={evidenceList}
            tasks={tasks}
            onDeleteEvidence={handleDeleteEvidence}
            onOpenCaptureModal={() => openCaptureForTask(undefined)}
          />
        )}
      </main>

      {/* Floating Action Button for Quick Screen Capture */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => openCaptureForTask(undefined)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-2xl shadow-indigo-500/40 border border-white/20 transition-all transform hover:scale-105 active:scale-95"
          title="Instant Screen Access Snapshot"
        >
          <Camera className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">Snap Daily Work</span>
        </button>
      </div>

      {/* MODALS */}
      <ScreenCaptureModal
        isOpen={isCaptureModalOpen}
        onClose={() => {
          setIsCaptureModalOpen(false);
          setCaptureTaskId(undefined);
        }}
        tasks={tasks}
        onEvidenceSaved={handleSaveEvidence}
        preSelectedTaskId={captureTaskId}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSaveTask={handleSaveTask}
        initialTask={editingTask}
        currentDate={currentDate}
      />

      <LearningModal
        isOpen={isLearningModalOpen}
        onClose={() => {
          setIsLearningModalOpen(false);
          setEditingLearning(null);
        }}
        onSaveEntry={handleSaveLearning}
        initialEntry={editingLearning}
        currentDate={currentDate}
      />

      <UpskillModal
        isOpen={isUpskillModalOpen}
        onClose={() => {
          setIsUpskillModalOpen(false);
          setEditingGap(null);
        }}
        onSaveGap={handleSaveGap}
        initialGap={editingGap}
      />

      <GettingStartedModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsGuideModalOpen(false);
        }}
        onOpenCapture={() => openCaptureForTask(undefined)}
      />
    </div>

  );
}

export default App;
