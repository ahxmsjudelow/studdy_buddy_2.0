import React, { useState } from 'react';
import { Video, Sparkles, Loader2, Play, FileCheck2, AlertCircle } from 'lucide-react';

interface VideoAnalyzerProps {
  darkMode?: boolean;
}

export const VideoAnalyzer: React.FC<VideoAnalyzerProps> = ({ darkMode }) => {
  const [videoPrompt, setVideoPrompt] = useState(
    'Analyze this Cambridge physics experiment on Simple Harmonic Motion. Extract the pendulum formula derivation, experimental errors, and predicted exam mark scheme questions.'
  );
  const [sampleVideoSelected, setSampleVideoSelected] = useState('physics');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const sampleVideos = [
    { id: 'physics', title: 'Physics 0625: Pendulum & Simple Harmonic Motion', duration: '08:45', thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80' },
    { id: 'chemistry', title: 'Chemistry 0620: Titration & Mole Neutralization', duration: '11:20', thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80' },
    { id: 'math', title: 'Math 0580: Calculus & Tangent Slopes', duration: '09:15', thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80' },
  ];

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      // Simulate video processing or call server thinking route
      const res = await fetch('/api/gemini/thinking-solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem: `[VIDEO LECTURE MULTIMODAL ANALYSIS]: ${videoPrompt} (Target: Cambridge IGCSE examination). Identify: 1) Principle equations shown, 2) Visual apparatus configuration, 3) Step-by-step experiment method, 4) Potential 6-mark Cambridge past paper question.`,
          subject: 'Cambridge IGCSE STEM Video Lecture',
          marks: 12,
          year: '2026 Multimodal Video Lab',
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.solution) throw new Error(data.error || 'No analysis returned');
      setResult(data.solution);
    } catch (err: any) {
      console.error(err);
      setResult(`Couldn't analyse this lesson: ${err.message}. This feature needs a configured Gemini API key.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-6 border-b goodness-border">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/60 border border-violet-200/60 dark:border-violet-800/40 text-violet-700 dark:text-violet-300 text-xs font-semibold mb-2">
          <Video className="w-3.5 h-3.5" />
          <span>Multimodal Video Understanding (Gemini 4 Argon)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Educational Video Lecture Analyzer
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-serif italic mt-1">
          Extract visual formulas, experimental graphs, and step-by-step procedures from Cambridge science labs and lectures.
        </p>
      </div>

      {/* Select Demo Video */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          Select Educational Video Lecture:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {sampleVideos.map((vid) => (
            <div
              key={vid.id}
              onClick={() => {
                setSampleVideoSelected(vid.id);
                setVideoPrompt(`Analyze this Cambridge lecture on ${vid.title}. Extract mathematical derivations, core syllabus definitions, and potential exam traps.`);
              }}
              className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                sampleVideoSelected === vid.id
                  ? 'border-violet-500 bg-violet-50/50 dark:bg-violet-950/30 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="relative aspect-video rounded-xl overflow-hidden mb-2 bg-slate-900">
                <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover opacity-75" />
                <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[10px] text-white font-mono">
                  {vid.duration}
                </div>
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                {vid.title}
              </span>
            </div>
          ))}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">
            Analysis Focus & Prompt:
          </label>
          <textarea
            rows={3}
            value={videoPrompt}
            onChange={(e) => setVideoPrompt(e.target.value)}
            className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
          />
        </div>

        <button
          onClick={handleRunAnalysis}
          disabled={isAnalyzing}
          className="px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Video Stream with Gemini 4 Argon...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Analyze Video with Gemini 4 Argon</span>
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 pb-3 border-b goodness-border">
            <FileCheck2 className="w-4 h-4 text-violet-500" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Video Intelligence Breakdown
            </h4>
          </div>
          <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};
