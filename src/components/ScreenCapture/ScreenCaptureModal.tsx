import React, { useState, useRef, useEffect } from 'react';
import { Camera, Monitor, X, Check, Undo2, Tag, FileText, AlertCircle, Upload, Clipboard } from 'lucide-react';
import { Task, ScreenEvidence, TaskCategory } from '../../types';

interface ScreenCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onEvidenceSaved: (evidence: ScreenEvidence, assignedTaskId?: string) => void;
  preSelectedTaskId?: string;
}

export const ScreenCaptureModal: React.FC<ScreenCaptureModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onEvidenceSaved,
  preSelectedTaskId
}) => {
  const [streamActive, setStreamActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string>(preSelectedTaskId || '');
  const [category, setCategory] = useState<TaskCategory>('Frontend');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeColor, setActiveColor] = useState<string>('#10b981'); // Emerald default
  const [tool, setTool] = useState<'pen' | 'highlighter'>('pen');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);
  const drawingHistoryRef = useRef<ImageData[]>([]);

  useEffect(() => {
    if (preSelectedTaskId) {
      setSelectedTaskId(preSelectedTaskId);
      const matched = tasks.find(t => t.id === preSelectedTaskId);
      if (matched) {
        setCategory(matched.category);
        setTitle(`Evidence: ${matched.title}`);
      }
    } else {
      setTitle(`Daily Work Snapshot - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    }
  }, [preSelectedTaskId, tasks, isOpen]);

  // Handle Ctrl+V paste anywhere in modal
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                loadImageToCanvas(event.target.result as string);
              }
            };
            reader.readAsDataURL(blob);
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isOpen]);

  if (!isOpen) return null;

  // 1. Request Screen Access via browser API
  const handleCaptureScreen = async () => {
    setErrorMessage(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new Error('Screen capture API is not supported in this browser environment. You can use image upload or Ctrl+V paste!');
      }

      setStreamActive(true);
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'monitor',
        } as MediaTrackConstraints,
        audio: false
      });

      // Video element to grab frame
      const video = document.createElement('video');
      video.srcObject = stream;
      video.playsInline = true;

      await new Promise<void>((resolve) => {
        video.onloadedmetadata = async () => {
          try {
            await video.play();
            resolve();
          } catch (err) {
            console.error(err);
            resolve();
          }
        };
      });

      // Give 200ms to stabilize frame
      await new Promise(r => setTimeout(r, 200));

      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = video.videoWidth || 1280;
      offscreenCanvas.height = video.videoHeight || 720;
      const ctx = offscreenCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
        const dataUrl = offscreenCanvas.toDataURL('image/png');
        loadImageToCanvas(dataUrl);
      }

      // Stop all tracks to release screen recording indicator
      stream.getTracks().forEach(track => track.stop());
      setStreamActive(false);
    } catch (err: unknown) {
      setStreamActive(false);
      const message = err instanceof Error ? err.message : 'Permission denied or capture canceled.';
      console.warn('Screen capture note:', message);
      setErrorMessage(message);
    }
  };

  // Load image onto editable canvas
  const loadImageToCanvas = (dataUrl: string) => {
    setCapturedImage(dataUrl);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageObjRef.current = img;
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        // Standardize canvas dimensions
        canvas.width = Math.min(img.width, 1200);
        canvas.height = (canvas.width / img.width) * img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          drawingHistoryRef.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
        }
      }
    };
    img.src = dataUrl;
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = activeColor;
    ctx.lineWidth = tool === 'pen' ? 3 : 18;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = tool === 'pen' ? 0.9 : 0.4;
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing || !canvasRef.current) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      drawingHistoryRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }
  };

  const handleUndo = () => {
    if (drawingHistoryRef.current.length > 1 && canvasRef.current) {
      drawingHistoryRef.current.pop(); // remove current state
      const prevState = drawingHistoryRef.current[drawingHistoryRef.current.length - 1];
      const ctx = canvasRef.current.getContext('2d');
      if (ctx && prevState) {
        ctx.putImageData(prevState, 0, 0);
      }
    } else if (imageObjRef.current && canvasRef.current) {
      // Re-draw clean image
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.globalAlpha = 1.0;
        ctx.drawImage(imageObjRef.current, 0, 0, canvas.width, canvas.height);
        drawingHistoryRef.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
      }
    }
  };

  // Mock sample generator for testing when screen share permission is skipped
  const generateMockSnapshot = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw simulated editor / terminal work screen
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 900, 500);

      // Title bar
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 900, 40);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(20, 20, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath(); ctx.arc(40, 20, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#10b981';
      ctx.beginPath(); ctx.arc(60, 20, 6, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px monospace';
      ctx.fillText('SkillPulse - Work Evidence Workspace [Snapshot]', 90, 25);

      // Code blocks
      ctx.fillStyle = '#38bdf8';
      ctx.font = '16px monospace';
      ctx.fillText('// Daily Work Implementation: ' + (title || 'Upskilling Session'), 40, 90);

      ctx.fillStyle = '#818cf8';
      ctx.font = '14px monospace';
      ctx.fillText('const dailyUpskill = async () => {', 40, 130);
      ctx.fillText('  const learningCurve = await analyzeRetention();', 60, 160);
      ctx.fillText('  const gapsIdentified = detectSkillGaps();', 60, 190);
      ctx.fillText('  return { progress: "100%", status: "Level Up" };', 60, 220);
      ctx.fillText('};', 40, 250);

      // Status pill
      ctx.fillStyle = '#10b98122';
      ctx.fillRect(40, 300, 320, 50);
      ctx.strokeStyle = '#10b981';
      ctx.strokeRect(40, 300, 320, 50);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('✓ Screen Capture Verified: Ready to Log', 60, 332);

      loadImageToCanvas(canvas.toDataURL('image/png'));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          loadImageToCanvas(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!canvasRef.current && !capturedImage) return;

    let finalDataUrl = capturedImage || '';
    if (canvasRef.current) {
      finalDataUrl = canvasRef.current.toDataURL('image/png');
    }

    const newEvidence: ScreenEvidence = {
      id: `evid-${Date.now()}`,
      timestamp: new Date().toISOString(),
      title: title.trim() || 'Daily Work Snapshot',
      notes: notes.trim(),
      imageData: finalDataUrl,
      taskId: selectedTaskId || undefined,
      category
    };

    onEvidenceSaved(newEvidence, selectedTaskId || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col glass-panel rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Capture Daily Work Proof
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Screen Snapshot
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Capture your active window or desktop to document daily milestones and learning proofs.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Capture Trigger Area */}
          {!capturedImage ? (
            <div className="border-2 border-dashed border-slate-700/80 rounded-2xl p-8 text-center bg-slate-900/30 hover:border-indigo-500/50 transition-all flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/30 shadow-lg shadow-indigo-500/10">
                <Monitor className="w-8 h-8 animate-pulse" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Select Your Screen or Window to Capture
              </h3>
              <p className="text-sm text-slate-400 max-w-md mb-6">
                Click the button below to prompt screen access. Choose your entire screen, an application window (e.g., VS Code, terminal), or browser tab.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleCaptureScreen}
                  disabled={streamActive}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                >
                  <Camera className="w-5 h-5" />
                  {streamActive ? 'Waiting for Screen Selection...' : 'Capture Screen Now'}
                </button>

                {/* Secondary options */}
                <label className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium text-sm flex items-center gap-2 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-slate-400" />
                  Upload Image
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>

                <button
                  type="button"
                  onClick={generateMockSnapshot}
                  className="px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 font-medium text-sm flex items-center gap-2 transition-colors"
                  title="Generate a sample test canvas without granting screen permission"
                >
                  <Clipboard className="w-4 h-4 text-emerald-400" />
                  Sample Workspace Snapshot
                </button>
              </div>

              {errorMessage && (
                <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 max-w-md text-left">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage} (You can also press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">Ctrl+V</kbd> to paste any screenshot directly).</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Annotation Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">Markup:</span>
                  <button
                    type="button"
                    onClick={() => setTool('pen')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                      tool === 'pen' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ✏️ Pen
                  </button>
                  <button
                    type="button"
                    onClick={() => setTool('highlighter')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                      tool === 'highlighter' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🖍️ Highlight
                  </button>
                </div>

                {/* Color Pickers */}
                <div className="flex items-center gap-2">
                  {[
                    { color: '#10b981', label: 'Emerald' },
                    { color: '#38bdf8', label: 'Cyan' },
                    { color: '#fbbf24', label: 'Amber' },
                    { color: '#f43f5e', label: 'Rose' },
                    { color: '#a855f7', label: 'Purple' }
                  ].map((c) => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => setActiveColor(c.color)}
                      style={{ backgroundColor: c.color }}
                      className={`w-5 h-5 rounded-full transition-transform ${
                        activeColor === c.color ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'opacity-70 hover:opacity-100'
                      }`}
                      title={c.label}
                    />
                  ))}

                  <div className="h-4 w-px bg-slate-700 mx-1" />

                  <button
                    type="button"
                    onClick={handleUndo}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors"
                    title="Undo stroke / Reset"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    Reset
                  </button>

                  <button
                    type="button"
                    onClick={() => setCapturedImage(null)}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs transition-colors"
                  >
                    Retake
                  </button>
                </div>
              </div>

              {/* Canvas Preview Container */}
              <div className="relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden flex justify-center max-h-[380px] shadow-inner">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="max-w-full max-h-[380px] object-contain cursor-crosshair rounded-lg"
                />
              </div>

              {/* Form Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    Snapshot Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Profiler results, Database Query plan..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-indigo-400" />
                    Assign to Daily Task (Optional)
                  </label>
                  <select
                    value={selectedTaskId}
                    onChange={(e) => {
                      setSelectedTaskId(e.target.value);
                      const matched = tasks.find(t => t.id === e.target.value);
                      if (matched) setCategory(matched.category);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  >
                    <option value="">-- General Daily Work Evidence --</option>
                    {tasks.map((t) => (
                      <option key={t.id} value={t.id}>
                        [{t.category}] {t.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Notes & Proof Observations
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What does this screen snapshot demonstrate? (e.g. Verified zero memory leaks, passed all test assertions)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/80">
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Proofs saved locally in your browser's private database
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!capturedImage}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Check className="w-4 h-4" />
              Save Work Evidence
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
