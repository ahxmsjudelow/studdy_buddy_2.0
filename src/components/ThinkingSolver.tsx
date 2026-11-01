import React, { useState } from 'react';
import { Subject } from '../data/subjects';
import { api, playWavBase64, stopAudio } from '../utils/api';
import { MarkdownText } from './MarkdownText';
import {
  Brain,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Loader2,
  Send,
  HelpCircle,
  FileCheck2,
} from 'lucide-react';

interface ThinkingSolverProps {
  initialSubject?: Subject;
  initialQuestion?: string;
  allSubjects: Subject[];
  darkMode?: boolean;
}

export const ThinkingSolver: React.FC<ThinkingSolverProps> = ({
  initialSubject,
  initialQuestion = '',
  allSubjects,
  darkMode,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject>(
    initialSubject || allSubjects.find((s) => s.code === '0580') || allSubjects[0]
  );
  const [questionText, setQuestionText] = useState<string>(
    initialQuestion || selectedSubject?.sampleQuestions?.[0]?.question || ''
  );
  const [marks, setMarks] = useState<number>(selectedSubject?.sampleQuestions?.[0]?.marks || 4);
  const [yearPaper, setYearPaper] = useState<string>(selectedSubject?.sampleQuestions?.[0]?.year || '2024 P4');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [solution, setSolution] = useState<string | null>(null);
  const [modelUsed, setModelUsed] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Audio / TTS state
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioLoading, setAudioLoading] = useState<boolean>(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const handleSolve = async () => {
    if (!questionText.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);
    setSolution(null);
    stopAudio();
    setIsPlayingAudio(false);
    setAudioBase64(null);

    try {
      const data = await api<{ solution: string; modelUsed?: string }>('/api/gemini/thinking-solve', {
        body: {
          problem: questionText,
          subject: selectedSubject.name + (selectedSubject.code ? ` (${selectedSubject.code})` : ''),
          marks,
          year: yearPaper,
        },
      });

      setSolution(data.solution);
      setModelUsed(data.modelUsed || 'Gemini 4 Argon');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error communicating with Gemini');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayTTS = async () => {
    if (!solution) return;
    if (isPlayingAudio) {
      stopAudio();
      setIsPlayingAudio(false);
      return;
    }

    if (audioBase64) {
      try {
        setIsPlayingAudio(true);
        await playWavBase64(audioBase64, () => setIsPlayingAudio(false));
      } catch { setIsPlayingAudio(false); }
      return;
    }

    setAudioLoading(true);
    try {
      // Create concise spoken summary from solution for TTS
      const summaryText = `Here is the Cambridge problem breakdown for ${selectedSubject.name}. ${solution.replace(/[*#_`>|-]/g, ' ').replace(/\s+/g, ' ').slice(0, 700)}`;
      const data = await api<{ audioBase64?: string }>('/api/gemini/tts', { body: { text: summaryText } });
      if (data.audioBase64) {
        setAudioBase64(data.audioBase64);
        setIsPlayingAudio(true);
        await playWavBase64(data.audioBase64, () => setIsPlayingAudio(false));
      }
    } catch (err: any) {
      console.error('TTS error:', err);
      setIsPlayingAudio(false);
      setErrorMsg(`Read-aloud is unavailable right now (${err.message}).`);
    } finally {
      setAudioLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="pb-6 border-b goodness-border">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/40 text-amber-700 dark:text-amber-400 text-xs font-semibold mb-2">
          <Brain className="w-3.5 h-3.5" />
          <span>High Thinking Mode (Gemini 4 Argon • ThinkingLevel.HIGH)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Deep Cambridge Problem Solver
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-serif italic mt-1">
          Maximized reasoning depth for complex math proofs, physics kinematics, chemistry stoichiometry, and economics analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Configuration Column */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Exam Problem Setup</span>
              <span className="text-[11px] font-mono text-teal-600 dark:text-teal-400 font-semibold">
                Mark Scheme Compliant
              </span>
            </h3>

            {/* Subject Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
                Syllabus & Subject:
              </label>
              <select
                value={selectedSubject.id}
                onChange={(e) => {
                  const s = allSubjects.find((x) => x.id === e.target.value);
                  if (s) {
                    setSelectedSubject(s);
                    if (s.sampleQuestions?.[0]) {
                      setQuestionText(s.sampleQuestions[0].question);
                      setMarks(s.sampleQuestions[0].marks);
                      setYearPaper(s.sampleQuestions[0].year || '2024 P2');
                    }
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                {allSubjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.code ? `(${s.code})` : `[${s.stage}]`}
                  </option>
                ))}
              </select>
            </div>

            {/* Marks & Year */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
                  Allocated Marks:
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={marks}
                  onChange={(e) => setMarks(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
                  Past Paper Series:
                </label>
                <input
                  type="text"
                  value={yearPaper}
                  onChange={(e) => setYearPaper(e.target.value)}
                  placeholder="e.g. 2024 May/June P4"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>

            {/* Question Text Area */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Question Prompt / Mathematical Equation:
                </label>
                {selectedSubject.sampleQuestions?.length > 0 && (
                  <button
                    onClick={() => {
                      const nextQ = selectedSubject.sampleQuestions[
                        Math.floor(Math.random() * selectedSubject.sampleQuestions.length)
                      ];
                      setQuestionText(nextQ.question);
                      setMarks(nextQ.marks);
                      if (nextQ.year) setYearPaper(nextQ.year);
                    }}
                    className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold hover:underline"
                  >
                    Load Sample Question
                  </button>
                )}
              </div>
              <textarea
                rows={5}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Paste past paper question or problem here..."
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-mono leading-relaxed"
              />
            </div>

            {/* Key Subject Formulas Quick-View */}
            {selectedSubject.keyFormulas && selectedSubject.keyFormulas.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Syllabus Formula Sheet:
                </span>
                <ul className="text-xs font-mono text-slate-700 dark:text-slate-300 space-y-1">
                  {selectedSubject.keyFormulas.map((f, i) => (
                    <li key={i} className="truncate">• {f}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Solve Action Button */}
            <button
              onClick={handleSolve}
              disabled={isLoading || !questionText.trim()}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md disabled:opacity-50 transition-opacity"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Thinking Deeply (Gemini 4 Argon)...</span>
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  <span>Execute High Thinking Solution</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Solution Output Column */}
        <div className="lg:col-span-7">
          <div className="h-full min-h-[460px] p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div>
              {/* Output Top Bar */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b goodness-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Cambridge Mark Scheme Derivation
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {modelUsed ? `Solved with ${modelUsed}` : 'Awaiting problem input'}
                    </span>
                  </div>
                </div>

                {solution && (
                  <button
                    onClick={handlePlayTTS}
                    disabled={audioLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-semibold hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
                  >
                    {audioLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : isPlayingAudio ? (
                      <VolumeX className="w-3.5 h-3.5 text-teal-500" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-teal-500" />
                    )}
                    <span>{isPlayingAudio ? 'Stop Audio' : 'Listen with TTS'}</span>
                  </button>
                )}
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-start gap-2.5 mb-4">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Solution generation error</strong>
                    <span>{errorMsg}</span>
                  </div>
                </div>
              )}

              {/* Solution Body */}
              {isLoading ? (
                <div className="py-20 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400 animate-pulse">
                    <Brain className="w-8 h-8" />
                  </div>
                  <div className="max-w-md mx-auto space-y-1.5">
                    <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Engaging High Thinking Engine...
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-serif italic">
                      Evaluating mark allocation, isolating common student traps, and formulating the step-by-step Cambridge proof.
                    </p>
                  </div>
                </div>
              ) : solution ? (
                <MarkdownText text={solution} className="max-w-none text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-sans leading-relaxed selection:bg-teal-500/20" />
              ) : (
                <div className="py-16 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <h5 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Ready to solve any Cambridge problem
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    Select your subject, configure the mark allocation, and tap &ldquo;Execute High Thinking Solution&rdquo;.
                  </p>
                </div>
              )}
            </div>

            {solution && (
              <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Examiner Verified Format</span>
                </span>
                <span className="font-mono text-[11px]">
                  Target: {marks} Marks
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
