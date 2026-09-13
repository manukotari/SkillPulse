import React, { useState } from 'react';
import { 
  X, 
  CheckSquare, 
  Camera, 
  BookOpen, 
  Target, 
  BarChart3, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface GettingStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: 'dashboard' | 'tasks' | 'learning' | 'upskill' | 'evidence') => void;
  onOpenCapture: () => void;
}

export const GettingStartedModal: React.FC<GettingStartedModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenCapture
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Welcome to SkillPulse!',
      subtitle: 'Your personal engineering command center for daily execution & skill mastery.',
      badge: 'Getting Started',
      icon: Sparkles,
      iconColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      description: 'SkillPulse connects your day-to-day coding tasks with your long-term career upskilling roadmap. Track what you do, what you learn, what clicked, and capture visual proof of your progress.',
      highlights: [
        'Organize daily work by engineering domains (Frontend, Backend, System Design, DevOps, etc.)',
        'Record "Aha!" breakthroughs, solutions to tough blockers, and daily comprehension scores',
        'Map out concrete changes needed to upskill to your next seniority level',
        'Snap real-time screen captures of your code, test runs, and profiler metrics'
      ],
      actionText: 'Next: Managing Daily Tasks',
      actionTab: null
    },
    {
      title: '1. Plan & Log Daily Tasks',
      subtitle: 'Start your morning with clear engineering objectives.',
      badge: 'Step 1',
      icon: CheckSquare,
      iconColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      description: 'Head over to the Daily Tasks tab to plan what you intend to build or debug today.',
      highlights: [
        'Assign Priority (High, Medium, Low) and Domain (Frontend, Backend, DevOps, etc.)',
        'Set Estimated vs Actual time spent — use the quick "+15m" button to log time on the fly',
        'Click the checkmark to mark tasks In-Progress or Completed',
        'Click "Snap Proof" on any task card to link captured code screenshots directly to it'
      ],
      actionText: 'Go to Daily Tasks',
      actionTab: 'tasks' as const
    },
    {
      title: '2. Capture Daily Screen Proofs',
      subtitle: 'Document your work with the screen capture popup.',
      badge: 'Step 2',
      icon: Camera,
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      description: 'Whenever you fix a tricky bug, run a profiler, or pass test suites, capture visual evidence.',
      highlights: [
        'Click "Capture Screen" in the top navbar or the floating button at bottom-right',
        'Select your IDE window, terminal, or browser tab when the screen dialog opens',
        'Use the built-in Pen ✏️ or Highlighter 🖍️ tools to mark key code or terminal logs',
        'Save proof locally to your browser IndexedDB — with zero size limits'
      ],
      actionText: 'Try Screen Capture',
      actionTrigger: 'capture'
    },
    {
      title: '3. Log Learning Curves & Reflections',
      subtitle: 'Turn daily debugging into permanent mental models.',
      badge: 'Step 3',
      icon: BookOpen,
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      description: 'At the end of your workday, take 2 minutes to write down what clicked in the Learning Journal.',
      highlights: [
        'Topic & Mental Model: Summarize the core concept you mastered today',
        'The "Aha!" Moment: Write down the breakthrough realization',
        'Obstacle & Solution: Document the bug encountered and how you conquered it',
        'Mastery Score Slider (1–10): Watch your retention curve rise on the dynamic analytics chart'
      ],
      actionText: 'Explore Learning Journal',
      actionTab: 'learning' as const
    },
    {
      title: '4. Execute Changes Required to Upskill',
      subtitle: 'Bridge the gap to your target seniority role.',
      badge: 'Step 4',
      icon: Target,
      iconColor: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
      description: 'Identify technical skill gaps and follow concrete, actionable engineering changes.',
      highlights: [
        'Compare Current Proficiency (1–10) vs Target Benchmark Level (1–10)',
        'Check the "Changes Required to Upskill" box for specific architectural shifts',
        'Complete milestone checklist items to advance your status from Identified to Mastered',
        'Inspect the Skill Gap Radar on your Analytics Dashboard to see your competency geometry'
      ],
      actionText: 'View Upskill Roadmap',
      actionTab: 'upskill' as const
    }
  ];

  const step = steps[currentStep];
  const Icon = step.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAction = () => {
    if ((step as any).actionTrigger === 'capture') {
      onClose();
      onOpenCapture();
    } else if (step.actionTab) {
      onClose();
      onNavigateTab(step.actionTab);
    } else {
      handleNext();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl glass-panel rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/70">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border ${step.iconColor}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white leading-tight">
                  {step.title}
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-800 border border-slate-700 text-indigo-300">
                  {step.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400">{step.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Body */}
        <div className="p-6 space-y-5">
          <p className="text-sm text-slate-300 leading-relaxed">
            {step.description}
          </p>

          <div className="rounded-xl bg-slate-900/80 border border-slate-800/90 p-4 space-y-2.5">
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">
              Key Workflow Checklist:
            </span>
            <div className="space-y-2">
              {step.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step Progress Indicators */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentStep === idx 
                    ? 'w-8 bg-indigo-500' 
                    : 'w-2 bg-slate-800 hover:bg-slate-700'
                }`}
                title={`Jump to step ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/80">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleAction}
              className="px-4 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-semibold transition-all"
            >
              {step.actionText}
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition-all"
            >
              {currentStep === steps.length - 1 ? 'Finish Tour' : 'Next Step'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
