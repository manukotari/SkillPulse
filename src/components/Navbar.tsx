import React, { useRef } from 'react';
import { 
  BarChart3, 
  CheckSquare, 
  BookOpen, 
  Target, 
  Camera, 
  Download, 
  Upload, 
  RotateCcw,
  Sparkles,
  HelpCircle
} from 'lucide-react';

import { StorageService } from '../services/storage';

export type ActiveTab = 'dashboard' | 'tasks' | 'learning' | 'upskill' | 'evidence';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenCaptureModal: () => void;
  onOpenGuideModal: () => void;
  evidenceCount: number;
  taskCount: number;
  onDataImported: () => void;
}


export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCaptureModal,
  onOpenGuideModal,
  evidenceCount,
  taskCount,
  onDataImported
}) => {

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleExport = async () => {
    const json = await StorageService.exportAllData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skillpulse-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = await StorageService.importAllData(content);
        if (ok) {
          alert('Data successfully imported!');
          onDataImported();
        } else {
          alert('Invalid backup file format.');
        }
      }
    };
    reader.readAsText(file);
  };

  interface NavItem {
    id: ActiveTab;
    label: string;
    icon: any;
    badge?: number;
  }

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Analytics Dashboard', icon: BarChart3 },
    { id: 'tasks', label: 'Daily Tasks', icon: CheckSquare, badge: taskCount },
    { id: 'learning', label: 'Learning Journal', icon: BookOpen },
    { id: 'upskill', label: 'Upskill Roadmap', icon: Target },
    { id: 'evidence', label: 'Screen Proofs', icon: Camera, badge: evidenceCount },
  ];


  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo Brand */}
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative p-2 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight text-white m-0 leading-none">
                  Skill<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Pulse</span>
                </h1>
                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium m-0">
                Daily Tasks • Learning Curves • Upskill Engine
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive ? 'bg-indigo-900/80 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Screen Capture Popup Trigger + Backup options */}
          <div className="flex items-center gap-2">
            {/* New User Guide button */}
            <button
              onClick={onOpenGuideModal}
              className="px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="First time here? View Quick Start Guide"
            >
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">User Guide</span>
            </button>

            {/* Prominent Screen Capture Trigger */}
            <button
              onClick={onOpenCaptureModal}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              title="Open screen access popup to capture today's work proof"
            >
              <Camera className="w-4 h-4 text-cyan-300" />
              <span className="hidden sm:inline">Capture Screen</span>
            </button>


            {/* Export / Import Menu */}
            <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-xl p-1">
              <button
                onClick={handleExport}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Backup all data to JSON"
              >
                <Download className="w-4 h-4" />
              </button>

              <label className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer" title="Import JSON backup">
                <Upload className="w-4 h-4" />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportFile}
                />
              </label>

              <button
                onClick={() => {
                  if (confirm('Reset application to demo data?')) {
                    StorageService.resetToDefaults();
                  }
                }}
                className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                title="Reset to Demo Data"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Mobile Tab Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/60 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`p-2 rounded-lg text-xs font-medium flex flex-col items-center gap-1 ${
                  isActive ? 'text-indigo-400 font-bold' : 'text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px]">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
