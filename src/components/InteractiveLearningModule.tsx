import React, { useState } from 'react';
import { Subject } from '../data/subjects';
import { VIDEO_MASTERCLASSES, VideoMasterclass } from '../data/videoData';
import {
  BookOpen,
  HelpCircle,
  Video,
  FileText,
  CheckCircle2,
  Brain,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ExternalLink,
  ChevronRight,
  Eye,
  EyeOff,
  Sparkles,
  Loader2,
  Award,
  Filter,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface InteractiveLearningModuleProps {
  subject: Subject;
  onSolveWithThinking: (questionText: string, marks: number) => void;
  onListenTTS: (text: string) => void;
  darkMode?: boolean;
}

export const InteractiveLearningModule: React.FC<InteractiveLearningModuleProps> = ({
  subject,
  onSolveWithThinking,
  onListenTTS,
  darkMode,
}) => {
  const [activeSection, setActiveSection] = useState<'summary' | 'practice' | 'video'>('summary');
  const [activeTopicIndex, setActiveTopicIndex] = useState<number>(0);
  const [revealedMarksScheme, setRevealedMarksScheme] = useState<Record<number, boolean>>({});
  const [studentAnswers, setStudentAnswers] = useState<Record<number, string>>({});
  const [selfScores, setSelfScores] = useState<Record<number, number>>({});
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Standard' | 'Challenging' | 'Expert'>('All');

  // Video state
  const [selectedVideoId, setSelectedVideoId] = useState<string>(() => {
    const match = VIDEO_MASTERCLASSES.find((v) => v.subjectId === subject.id || v.code === subject.code);
    return match ? match.id : VIDEO_MASTERCLASSES[0].id;
  });
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoAnalyzing, setVideoAnalyzing] = useState(false);
  const [videoAnalysisResult, setVideoAnalysisResult] = useState<string | null>(null);

  const currentTopic = subject.topics[activeTopicIndex] || subject.topics[0] || 'Core Principles';

  // Questions filtering
  const allQuestions = subject.sampleQuestions || [];
  const filteredQuestions = difficultyFilter === 'All'
    ? allQuestions
    : allQuestions.filter((q) => q.difficulty === difficultyFilter);

  // Active video masterclass
  const activeVideo = VIDEO_MASTERCLASSES.find((v) => v.id === selectedVideoId) || VIDEO_MASTERCLASSES[0];

  const currentSummary = {
    summary: `Comprehensive syllabus breakdown of ${currentTopic} in Cambridge ${subject.name} ${subject.code ? `(${subject.code})` : ''}. Master standard Cambridge command words ('State', 'Explain', 'Calculate', 'Evaluate'). When writing solutions, always present full intermediate workings and state the governing equation before numerical substitution.`,
    keyPoints: [
      `Key definition and fundamental scope of ${currentTopic}.`,
      'Critical mark scheme keywords required to secure maximum marks on Paper 2 and Paper 4.',
      'Unit conversions and algebraic manipulation guidelines specified in Cambridge syllabus.',
      'Real-world applications and experimental procedures linked to this topic.',
    ],
    examinerTip: `Cambridge examiners award method marks (M marks) even if your final answer has an arithmetic slip. Always state the governing formula first!`,
  };

  const toggleMarkScheme = (qIdx: number) => {
    setRevealedMarksScheme((prev) => ({
      ...prev,
      [qIdx]: !prev[qIdx],
    }));
  };

  const handleScoreSelf = (qIdx: number, score: number) => {
    setSelfScores((prev) => ({ ...prev, [qIdx]: score }));
    if (score >= 3) {
      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.8 },
        colors: ['#00A896', '#3B82F6', '#10B981'],
      });
    }
  };

  const handleAnalyzeVideo = async () => {
    setVideoAnalyzing(true);
    setVideoAnalysisResult(null);

    try {
      const res = await fetch('/api/gemini/thinking-solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem: `[EDUCATIONAL MASTERCLASS ANALYSIS]: "${activeVideo.title}".
Topic: ${activeVideo.topic}.
Analyze this Cambridge video lesson. Extract:
1. Executive Concept Summary & Theoretical Principles
2. Step-by-Step Formula Derivations & Diagrams
3. Exact Cambridge Mark Scheme points
4. Top 3 Examiner Traps & Misconceptions to avoid in the exam hall.`,
          subject: subject.name + (subject.code ? ` (${subject.code})` : ''),
          marks: 10,
          year: '2026 Masterclass Series',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.solution) throw new Error(data.error || 'No analysis returned');
      setVideoAnalysisResult(data.solution);
    } catch (err) {
      console.error(err);
      setVideoAnalysisResult('Unable to generate the lesson analysis right now. This feature needs a configured Gemini API key.');
    } finally {
      setVideoAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Module Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/40">
              Interactive Learning Module
            </span>
            {subject.code && (
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Cambridge IGCSE {subject.code}
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {subject.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-serif italic mt-0.5">
            Module Topic: <strong className="text-teal-600 dark:text-teal-400">{currentTopic}</strong>
          </p>
        </div>

        {/* Topic Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-md">
          {subject.topics.map((t, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveTopicIndex(idx);
                setVideoAnalysisResult(null);
              }}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTopicIndex === idx
                  ? 'bg-teal-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 3 Section Nav Tabs */}
      <div className="flex items-center p-1.5 bg-slate-100/80 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 max-w-md">
        <button
          onClick={() => setActiveSection('summary')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeSection === 'summary'
              ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Concise Summary</span>
        </button>

        <button
          onClick={() => setActiveSection('practice')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeSection === 'practice'
              ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Practice ({allQuestions.length} Questions)</span>
        </button>

        <button
          onClick={() => setActiveSection('video')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeSection === 'video'
              ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Video Masterclasses</span>
        </button>
      </div>

      {/* SECTION 1: CONCISE SUMMARY */}
      {activeSection === 'summary' && (
        <div className="space-y-5 animate-fade-in">
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b goodness-border">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  High-Yield Syllabus Notes: {currentTopic}
                </h3>
                <span className="text-xs text-slate-400">
                  Cambridge Assessment International Education Standards
                </span>
              </div>

              <button
                onClick={() => onListenTTS(`${currentTopic}. ${currentSummary.summary}`)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/40 text-teal-700 dark:text-teal-300 text-xs font-semibold hover:bg-teal-100 transition-colors"
              >
                <Volume2 className="w-4 h-4 text-teal-500" />
                <span>Listen with TTS</span>
              </button>
            </div>

            <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-normal">
              {currentSummary.summary}
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Key Learning Outcomes & Syllabus Criteria:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentSummary.keyPoints.map((point, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-snug">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {subject.keyFormulas && subject.keyFormulas.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-800">
                <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider block mb-2 font-mono">
                  Syllabus Formula Sheet & Key Equations:
                </span>
                <div className="flex flex-wrap gap-2">
                  {subject.keyFormulas.map((formula, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg bg-white/10 text-xs font-mono text-teal-200 border border-white/10"
                    >
                      {formula}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-amber-900 dark:text-amber-200">
              <span className="text-xs font-bold flex items-center gap-1.5 mb-1 text-amber-800 dark:text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Cambridge Senior Examiner Tip</span>
              </span>
              <p className="text-xs sm:text-sm leading-relaxed">
                {currentSummary.examinerTip}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: PRACTICE QUESTIONS */}
      {activeSection === 'practice' && (
        <div className="space-y-5 animate-fade-in">
          {/* Difficulty Filter Bar */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-slate-400 font-semibold">
              Filter by Difficulty:
            </span>
            <div className="flex gap-1.5">
              {(['All', 'Standard', 'Challenging', 'Expert'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    difficultyFilter === diff
                      ? 'bg-teal-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredQuestions.map((q, qIdx) => {
              const isRevealed = revealedMarksScheme[qIdx];
              const score = selfScores[qIdx];

              return (
                <div
                  key={qIdx}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between gap-2 pb-3 border-b goodness-border">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 font-bold text-xs flex items-center justify-center">
                        Q{qIdx + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {q.year ? `Past Paper (${q.year})` : 'Cambridge Exam Drill'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60">
                        [{q.marks} Marks]
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                        {q.difficulty}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed font-sans">
                    {q.question}
                  </p>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">
                      Your Working Out / Solution Steps:
                    </label>
                    <textarea
                      rows={3}
                      value={studentAnswers[qIdx] || ''}
                      onChange={(e) =>
                        setStudentAnswers({
                          ...studentAnswers,
                          [qIdx]: e.target.value,
                        })
                      }
                      placeholder="Type your algebraic steps or mark scheme points..."
                      className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleMarkScheme(qIdx)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
                      >
                        {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{isRevealed ? 'Hide Mark Scheme' : 'Check Mark Scheme'}</span>
                      </button>

                      <button
                        onClick={() => onSolveWithThinking(q.question, q.marks)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold hover:bg-blue-100 transition-colors"
                      >
                        <Brain className="w-3.5 h-3.5" />
                        <span>High Thinking Proof (Gemini 4 Argon)</span>
                      </button>
                    </div>

                    {isRevealed && (
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-slate-400 mr-1">Self Grade:</span>
                        {Array.from({ length: q.marks + 1 }, (_, i) => i).map((m) => (
                          <button
                            key={m}
                            onClick={() => handleScoreSelf(qIdx, m)}
                            className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center transition-colors ${
                              score === m
                                ? 'bg-teal-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {isRevealed && (
                    <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-800/40 text-teal-950 dark:text-teal-200 text-xs sm:text-sm animate-fade-in">
                      <div className="flex items-center gap-2 font-bold text-teal-800 dark:text-teal-300 mb-1.5">
                        <Award className="w-4 h-4 text-teal-500" />
                        <span>Official Cambridge Mark Scheme Standard:</span>
                      </div>
                      <p className="font-mono text-xs leading-relaxed">
                        {q.solutionHint}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: VIDEO MASTERCLASSES */}
      {activeSection === 'video' && (
        <div className="space-y-6 animate-fade-in">
          {/* Video Selector Carousel */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-semibold mr-1">Select Masterclass:</span>
            {VIDEO_MASTERCLASSES.map((vid) => (
              <button
                key={vid.id}
                onClick={() => {
                  setSelectedVideoId(vid.id);
                  setVideoAnalysisResult(null);
                }}
                className={`shrink-0 px-3 py-1.5 rounded-xl font-medium transition-colors ${
                  selectedVideoId === vid.id
                    ? 'bg-violet-600 text-white font-bold'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                {vid.subjectName} ({vid.duration})
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b goodness-border">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {activeVideo.title}
                </h3>
                <span className="text-xs text-slate-400">
                  {activeVideo.lecturer} • Duration: {activeVideo.duration} • 1080p Cambridge Studio
                </span>
              </div>

              <button
                onClick={handleAnalyzeVideo}
                disabled={videoAnalyzing}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-teal-600 text-white text-xs sm:text-sm font-semibold hover:opacity-95 shadow-sm disabled:opacity-50"
              >
                {videoAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Video with Gemini 4 Argon...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Extract Visual Equations & Traps</span>
                  </>
                )}
              </button>
            </div>

            {/* Video Player Display */}
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 group shadow-xl">
              {isPlayingVideo ? (
                <video
                  src={activeVideo.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <>
                  <img
                    src={activeVideo.thumbnail}
                    alt={activeVideo.title}
                    className="w-full h-full object-cover opacity-65 group-hover:opacity-80 transition-opacity"
                  />
                  <div
                    onClick={() => setIsPlayingVideo(true)}
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  >
                    <div className="w-20 h-20 rounded-full bg-teal-500/90 text-white flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                      <Play className="w-9 h-9 ml-1 fill-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-2xl">
                    <span className="font-semibold">{activeVideo.topic}</span>
                    <span className="text-teal-400 font-mono">{activeVideo.duration}</span>
                  </div>
                </>
              )}
            </div>

            {/* Timestamps Chapter Breakdown */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                Video Chapters & Key Concepts:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {activeVideo.timestamps.map((ts, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50"
                  >
                    <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400 block mb-1">
                      {ts.time}
                    </span>
                    <strong className="text-xs font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">
                      {ts.label}
                    </strong>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block leading-tight">
                      {ts.concept}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Analysis Result Box */}
            {videoAnalysisResult && (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 animate-fade-in">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-500" />
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                    Gemini 4 Argon Video Intelligence Breakdown
                  </h5>
                </div>
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                  {videoAnalysisResult}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
