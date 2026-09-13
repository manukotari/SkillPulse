import React, { useState } from 'react';
import { ScreenEvidence, Task } from '../../types';
import { Camera, Calendar, Tag, Trash2, ExternalLink, X, ZoomIn } from 'lucide-react';

interface WorkEvidenceGalleryProps {
  evidenceList: ScreenEvidence[];
  tasks: Task[];
  onDeleteEvidence: (id: string) => void;
  onOpenCaptureModal: () => void;
}

export const WorkEvidenceGallery: React.FC<WorkEvidenceGalleryProps> = ({
  evidenceList,
  tasks,
  onDeleteEvidence,
  onOpenCaptureModal
}) => {
  const [activePreview, setActivePreview] = useState<ScreenEvidence | null>(null);

  const getTaskTitle = (taskId?: string) => {
    if (!taskId) return null;
    const task = tasks.find(t => t.id === taskId);
    return task ? task.title : 'Unassigned';
  };

  return (
    <div className="space-y-6">
      {/* Gallery Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl glass-card border border-slate-800/80 bg-gradient-to-r from-slate-900/90 via-indigo-950/20 to-slate-900/90">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-indigo-400" />
            Daily Work Evidence & Proof of Progress
          </h3>
          <p className="text-sm text-slate-400">
            Visual screen captures of your code, test runs, architecture diagrams, and daily milestones.
          </p>
        </div>
        <button
          onClick={onOpenCaptureModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all self-start md:self-auto"
        >
          <Camera className="w-4 h-4" />
          Capture New Screen Proof
        </button>
      </div>

      {/* Grid of captures */}
      {evidenceList.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/20">
          <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Camera className="w-6 h-6" />
          </div>
          <h4 className="text-base font-semibold text-slate-200">No screen captures recorded yet</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            Click the capture button to take a snapshot of your screen or terminal to document today's work.
          </p>
          <button
            onClick={onOpenCaptureModal}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
          >
            Capture First Proof
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {evidenceList.map((item) => {
            const taskTitle = getTaskTitle(item.taskId);
            return (
              <div
                key={item.id}
                className="group rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-all overflow-hidden flex flex-col shadow-lg hover:shadow-indigo-500/5"
              >
                {/* Thumbnail Preview with Overlay */}
                <div
                  onClick={() => setActivePreview(item)}
                  className="relative aspect-video bg-slate-950 cursor-pointer overflow-hidden flex items-center justify-center"
                >
                  <img
                    src={item.imageData}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="p-2 rounded-full bg-slate-900/80 text-white backdrop-blur-sm">
                      <ZoomIn className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-medium text-white">Click to Expand</span>
                  </div>
                  {item.category && (
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/90 text-indigo-300 border border-indigo-500/30 backdrop-blur-sm">
                      {item.category}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-semibold text-slate-100 text-sm line-clamp-1 group-hover:text-indigo-300 transition-colors">
                      {item.title}
                    </h4>
                    {item.notes && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {item.notes}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                    {taskTitle && (
                      <div className="flex items-center gap-1.5 text-indigo-400 font-medium truncate">
                        <Tag className="w-3 h-3 shrink-0" />
                        <span className="truncate">Task: {taskTitle}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.timestamp).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Delete this screen evidence?')) {
                            onDeleteEvidence(item.id);
                          }
                        }}
                        className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                        title="Delete snapshot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Fullscreen Modal */}
      {activePreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
          onClick={() => setActivePreview(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-3.5 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {activePreview.category || 'Work Evidence'}
                </span>
                <h3 className="text-base font-bold text-white truncate max-w-md">
                  {activePreview.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={activePreview.imageData}
                  download={`evidence-${activePreview.id}.png`}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Download
                </a>
                <button
                  onClick={() => setActivePreview(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Image Preview */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950">
              <img
                src={activePreview.imageData}
                alt={activePreview.title}
                className="max-h-[70vh] w-auto object-contain rounded-lg border border-slate-800 shadow-xl"
              />
            </div>

            {/* Notes footer */}
            {activePreview.notes && (
              <div className="px-6 py-3 bg-slate-900/90 border-t border-slate-800 text-xs text-slate-300">
                <span className="font-semibold text-indigo-400 mr-2">Notes:</span>
                {activePreview.notes}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
