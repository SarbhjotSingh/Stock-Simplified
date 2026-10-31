import React, { useState } from 'react';
import {
  X,
  Settings,
  Headphones,
  Sliders,
  Plus,
  Trash2,
  Edit2,
  Save,
  Volume2,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Layers,
  Sparkles,
  Shield,
  Eye,
} from 'lucide-react';
import { AudioChapter } from '../../types/market';
import { TourStepItem } from '../../types/admin';
import { validateAudioChapter, reorderTourSteps } from '../../utils/adminTourMath';
import { speechAgent } from '../../utils/speechAgent';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  podcasts: AudioChapter[];
  onUpdatePodcasts: (podcasts: AudioChapter[]) => void;
  tourSteps: TourStepItem[];
  onUpdateTourSteps: (steps: TourStepItem[]) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  podcasts,
  onUpdatePodcasts,
  tourSteps,
  onUpdateTourSteps,
}) => {
  const [activeTab, setActiveTab] = useState<'podcasts' | 'tour' | 'overview'>('podcasts');

  // Podcast form state
  const [editingPodcastId, setEditingPodcastId] = useState<string | null>(null);
  const [podcastTitle, setPodcastTitle] = useState('');
  const [podcastDuration, setPodcastDuration] = useState('');
  const [podcastDesc, setPodcastDesc] = useState('');
  const [podcastTranscript, setPodcastTranscript] = useState('');
  const [podcastKeyPoints, setPodcastKeyPoints] = useState('');
  const [podcastError, setPodcastError] = useState<string | null>(null);

  // Tour step editing state
  const [editingStepId, setEditingStepId] = useState<number | null>(null);
  const [stepTitle, setStepTitle] = useState('');
  const [stepScript, setStepScript] = useState('');
  const [stepTargetLabel, setStepTargetLabel] = useState('');
  const [stepReveals, setStepReveals] = useState<TourStepItem['reveals']>('bare');

  if (!isOpen) return null;

  // Podcast CRUD Handlers
  const handleOpenAddPodcast = () => {
    setEditingPodcastId('new');
    setPodcastTitle('');
    setPodcastDuration('5:00 min');
    setPodcastDesc('');
    setPodcastTranscript('');
    setPodcastKeyPoints('Key rule 1\nKey rule 2');
    setPodcastError(null);
  };

  const handleOpenEditPodcast = (ch: AudioChapter) => {
    setEditingPodcastId(ch.id);
    setPodcastTitle(ch.title);
    setPodcastDuration(ch.duration);
    setPodcastDesc(ch.description);
    setPodcastTranscript(ch.transcript);
    setPodcastKeyPoints(ch.keyPoints.join('\n'));
    setPodcastError(null);
  };

  const handleSavePodcast = () => {
    const keyPointsArr = podcastKeyPoints.split('\n').filter((k) => k.trim().length > 0);
    const validation = validateAudioChapter({
      title: podcastTitle,
      duration: podcastDuration,
      transcript: podcastTranscript,
    });

    if (!validation.valid) {
      setPodcastError(validation.error || 'Please fill required fields.');
      return;
    }

    if (editingPodcastId === 'new') {
      const newChapter: AudioChapter = {
        id: `chap-${Date.now()}`,
        title: podcastTitle,
        duration: podcastDuration,
        description: podcastDesc,
        transcript: podcastTranscript,
        keyPoints: keyPointsArr,
      };
      onUpdatePodcasts([...podcasts, newChapter]);
    } else {
      const updated = podcasts.map((p) =>
        p.id === editingPodcastId
          ? {
              ...p,
              title: podcastTitle,
              duration: podcastDuration,
              description: podcastDesc,
              transcript: podcastTranscript,
              keyPoints: keyPointsArr,
            }
          : p
      );
      onUpdatePodcasts(updated);
    }

    setEditingPodcastId(null);
  };

  const handleDeletePodcast = (id: string) => {
    onUpdatePodcasts(podcasts.filter((p) => p.id !== id));
  };

  const handlePreviewVoice = (text: string) => {
    speechAgent.speak(text);
  };

  // Tour Step Handlers
  const handleOpenEditStep = (step: TourStepItem) => {
    setEditingStepId(step.id);
    setStepTitle(step.title);
    setStepScript(step.voiceScript);
    setStepTargetLabel(step.targetLabel);
    setStepReveals(step.reveals);
  };

  const handleSaveStep = () => {
    if (editingStepId === null) return;
    const updated = tourSteps.map((s) =>
      s.id === editingStepId
        ? {
            ...s,
            title: stepTitle,
            voiceScript: stepScript,
            targetLabel: stepTargetLabel,
            reveals: stepReveals,
          }
        : s
    );
    onUpdateTourSteps(updated);
    setEditingStepId(null);
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    const reordered = reorderTourSteps(tourSteps, index, target);
    onUpdateTourSteps(reordered);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in text-slate-100">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-7 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-cyan-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-white">Stock Simplified Admin CMS</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  LEAD INSTRUCTOR ACCESS
                </span>
              </div>
              <p className="text-xs text-slate-400">Manage audio podcasts, voice tour sequences, and educational modules</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              Exit to Simulator
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close Admin Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 pt-3 pb-4 border-b border-slate-800/80">
          <button
            onClick={() => setActiveTab('podcasts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'podcasts'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Headphones className="w-4 h-4" />
            Podcast Management ({podcasts.length})
          </button>

          <button
            onClick={() => setActiveTab('tour')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'tour'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Guided Tour Sequence Editor ({tourSteps.length})
          </button>
        </div>

        {/* Tab 1: Podcast CRUD */}
        {activeTab === 'podcasts' && (
          <div className="flex-1 overflow-y-auto py-3 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Create, update, and manage audio masterclass episodes hosted on the Beginner Educational Hub.
              </span>
              <button
                type="button"
                onClick={handleOpenAddPodcast}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Episode</span>
              </button>
            </div>

            {/* Editing / Create Form Drawer */}
            {editingPodcastId && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-xs font-bold text-cyan-300">
                    {editingPodcastId === 'new' ? 'Create New Audio Chapter' : 'Edit Audio Chapter'}
                  </h4>
                  <button
                    onClick={() => setEditingPodcastId(null)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                </div>

                {podcastError && (
                  <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                    {podcastError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 uppercase text-[10px] mb-1">Chapter Title</label>
                    <input
                      type="text"
                      value={podcastTitle}
                      onChange={(e) => setPodcastTitle(e.target.value)}
                      placeholder="e.g. Mastering Fibonacci Confluences"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase text-[10px] mb-1">Duration Tag</label>
                    <input
                      type="text"
                      value={podcastDuration}
                      onChange={(e) => setPodcastDuration(e.target.value)}
                      placeholder="e.g. 5:15 min"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-slate-400 uppercase text-[10px] mb-1">Summary Description</label>
                  <input
                    type="text"
                    value={podcastDesc}
                    onChange={(e) => setPodcastDesc(e.target.value)}
                    placeholder="Short overview of the lesson..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="text-xs">
                  <label className="block text-slate-400 uppercase text-[10px] mb-1">
                    Spoken Script / Audio Transcript (Read by Voice Agent)
                  </label>
                  <textarea
                    rows={3}
                    value={podcastTranscript}
                    onChange={(e) => setPodcastTranscript(e.target.value)}
                    placeholder="Enter the full text for speech synthesis..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white font-mono text-xs"
                  />
                </div>

                <div className="text-xs">
                  <label className="block text-slate-400 uppercase text-[10px] mb-1">
                    Key Takeaways (One per line)
                  </label>
                  <textarea
                    rows={2}
                    value={podcastKeyPoints}
                    onChange={(e) => setPodcastKeyPoints(e.target.value)}
                    placeholder="Point 1&#10;Point 2"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-xs"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => handlePreviewVoice(podcastTranscript)}
                    className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Test Voice Narration</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSavePodcast}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Episode</span>
                  </button>
                </div>
              </div>
            )}

            {/* Podcast List */}
            <div className="space-y-2.5">
              {podcasts.map((ch, idx) => (
                <div
                  key={ch.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase">
                        Chapter {idx + 1}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">({ch.duration})</span>
                    </div>
                    <h5 className="text-xs font-bold text-white truncate">{ch.title}</h5>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{ch.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handlePreviewVoice(ch.transcript)}
                      title="Preview Audio Voice"
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEditPodcast(ch)}
                      title="Edit Episode"
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePodcast(ch.id)}
                      title="Delete Episode"
                      className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Tour Sequence Editor */}
        {activeTab === 'tour' && (
          <div className="flex-1 overflow-y-auto py-3 space-y-4">
            <span className="text-xs text-slate-400 block">
              Reorder sequence steps or customize the spoken scripts and UI elements revealed to beginners.
            </span>

            {editingStepId !== null && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-xs font-bold text-emerald-300">
                    Edit Sequence Step {editingStepId}
                  </h4>
                  <button
                    onClick={() => setEditingStepId(null)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 uppercase text-[10px] mb-1">Step Headline</label>
                    <input
                      type="text"
                      value={stepTitle}
                      onChange={(e) => setStepTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase text-[10px] mb-1">Target UI Reveal</label>
                    <select
                      value={stepReveals}
                      onChange={(e) => setStepReveals(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                    >
                      <option value="bare">bare (Bare Chart Only)</option>
                      <option value="indicators">indicators (Technical Indicators)</option>
                      <option value="drawing">drawing (Left Toolbar & Fib)</option>
                      <option value="orders">orders (Order Execution Panel)</option>
                      <option value="calendar">calendar (Sessions & Calendar)</option>
                      <option value="complete">complete (Full Workspace)</option>
                    </select>
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-slate-400 uppercase text-[10px] mb-1">
                    Voice Agent Script (Spoken via Web Speech API)
                  </label>
                  <textarea
                    rows={3}
                    value={stepScript}
                    onChange={(e) => setStepScript(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white text-xs font-mono"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => handlePreviewVoice(stepScript)}
                    className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Audition Voice Step</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveStep}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Step Updates</span>
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2.5">
              {tourSteps.map((step, idx) => (
                <div
                  key={step.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                      {step.id}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-bold text-white truncate">{step.title}</h5>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-800 text-slate-300">
                          reveals: {step.reveals}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 italic mt-0.5">
                        "{step.voiceScript}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveStep(idx, 'up')}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
                      title="Move Step Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === tourSteps.length - 1}
                      onClick={() => handleMoveStep(idx, 'down')}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
                      title="Move Step Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEditStep(step)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white ml-1"
                      title="Edit Step"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
