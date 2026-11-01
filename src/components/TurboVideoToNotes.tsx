import React, { useEffect, useState } from 'react';
import { api, playWavBase64, stopAudio } from '../utils/api';
import { MarkdownText } from './MarkdownText';
import {
  Youtube,
  Sparkles,
  FileText,
  Layers,
  CheckCircle2,
  HelpCircle,
  Copy,
  Check,
  Volume2,
  RotateCw,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  BookmarkPlus,
  Play,
  Lightbulb,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FlashcardItem } from '../data/flashcardsData';

interface TurboVideoToNotesProps {
  onAddFlashcardsToMainDeck?: (cards: FlashcardItem[]) => void;
  onAddPoints: (pts: number, reason: string) => void;
  /** Text (e.g. teacher notes) to turn into a study pack */
  seed?: { text: string; title: string; subject: string } | null;
  darkMode: boolean;
}

export interface TurboStudyPack {
  title: string;
  author: string;
  estimatedDuration: string;
  videoId: string | null;
  embedUrl: string | null;
  youtubeUrl: string;
  summary: string;
  notes: string;
  flashcards: {
    front: string;
    back: string;
    hint: string;
    difficulty: string;
  }[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  audioScript: string;
  /** true when Gemini was unavailable and the built-in engine produced this pack */
  offline?: boolean;
  notice?: string;
}

// Preset verified educational lectures for 1-click test
const PRESET_LECTURES = [
  {
    name: 'Math 0580: Calculus & Tangents',
    url: 'https://www.youtube.com/watch?v=0jPcbOQzXyE',
    subject: 'Mathematics (0580)',
    titleHint: 'Differentiation, Finding Gradients & Turning Points in IGCSE Math',
  },
  {
    name: "Physics 0625: Newton's Laws & Forces",
    url: 'https://www.youtube.com/watch?v=kKKM8Y-u7ds',
    subject: 'Physics (0625)',
    titleHint: "Newton's First, Second & Third Laws of Motion & Free Body Diagrams",
  },
  {
    name: 'Chemistry 0620: Stoichiometry & Moles',
    url: 'https://www.youtube.com/watch?v=1rYc_040Tls',
    subject: 'Chemistry (0620)',
    titleHint: 'Calculating Moles, Reacting Masses, Gas Volumes & Titrations',
  },
  {
    name: 'CS 0478: Von Neumann CPU Architecture',
    url: 'https://www.youtube.com/watch?v=jFDMZpkUWCw',
    subject: 'Computer Science (0478)',
    titleHint: 'The Fetch-Decode-Execute Cycle, Registers (PC, MAR, MDR, ALU) & Buses',
  },
  {
    name: 'Biology 0610: Osmosis & Cell Transport',
    url: 'https://www.youtube.com/watch?v=IaZ8MtF3C6M',
    subject: 'Biology (0610)',
    titleHint: 'Diffusion, Osmosis, Water Potential & Active Transport in Cells',
  },
];

export const TurboVideoToNotes: React.FC<TurboVideoToNotesProps> = ({
  onAddFlashcardsToMainDeck,
  onAddPoints,
  seed,
  darkMode,
}) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [titleHint, setTitleHint] = useState('');
  const [subject, setSubject] = useState('Cambridge IGCSE');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Active generated result
  const [studyPack, setStudyPack] = useState<TurboStudyPack | null>(null);

  // Tab: 'notes' | 'flashcards' | 'summary' | 'quiz'
  const [activeTab, setActiveTab] = useState<'notes' | 'flashcards' | 'summary' | 'quiz'>('notes');

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isAddedToDeck, setIsAddedToDeck] = useState(false);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIndex: number]: number }>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Copy status
  const [copied, setCopied] = useState(false);

  // Audio TTS playback state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Prefill from class materials
  useEffect(() => {
    if (seed) {
      setTranscript(seed.text);
      setTitleHint(seed.title);
      setYoutubeUrl('');
      if (seed.subject) setSubject(seed.subject);
    }
  }, [seed]);

  const handleGenerate = async (customUrl?: string, customSub?: string, customHint?: string) => {
    const targetUrl = customUrl || youtubeUrl;
    const text = customUrl ? '' : transcript;
    if (!targetUrl.trim() && !text.trim()) {
      setError('Paste a YouTube link, paste notes/a transcript, or select one of the presets below.');
      return;
    }
    stopAudio();
    setIsPlayingAudio(false);

    setIsLoading(true);
    setError(null);
    setIsAddedToDeck(false);
    setSelectedAnswers({});
    setQuizScore(null);
    setCurrentCardIndex(0);
    setIsFlipped(false);

    try {
      const data = await api<TurboStudyPack>('/api/gemini/youtube-to-notes', {
        body: {
          youtubeUrl: targetUrl,
          subject: customSub || subject,
          titleHint: customHint || (customUrl ? '' : titleHint),
          transcript: text,
        },
      });

      setStudyPack(data);
      setActiveTab('notes');
      onAddPoints(35, 'Generated Turbo study pack from YouTube');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with YouTube AI parser.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyNotes = () => {
    if (!studyPack) return;
    navigator.clipboard?.writeText(studyPack.notes).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => setError('Could not copy to the clipboard.'));
  };

  const handleAddAllToDeck = () => {
    if (!studyPack || !onAddFlashcardsToMainDeck) return;
    const newCards: FlashcardItem[] = studyPack.flashcards.map((c, i) => ({
      id: `yt-${Date.now()}-${i}`,
      subjectId: 'yt-import',
      subjectName: studyPack.title || 'YouTube Lecture',
      topic: studyPack.title,
      front: c.front,
      back: c.back,
      hint: c.hint,
      difficulty: (c.difficulty as any) || 'Standard',
      sm2: { intervalDays: 1, easeFactor: 2.5, repetitions: 0 },
    }));

    onAddFlashcardsToMainDeck(newCards);
    setIsAddedToDeck(true);
    onAddPoints(25, 'Exported YouTube flashcards to Active Recall Deck');
    confetti({ particleCount: 40, spread: 50 });
  };

  const handleAnswerQuiz = (qIndex: number, optionIndex: number) => {
    if (selectedAnswers[qIndex] !== undefined) return; // already answered
    const nextAnswers = { ...selectedAnswers, [qIndex]: optionIndex };
    setSelectedAnswers(nextAnswers);

    // If correct, award XP
    if (studyPack && optionIndex === studyPack.quiz[qIndex].correctIndex) {
      onAddPoints(10, 'Answered YouTube quiz question correctly');
    }
  };

  const handlePlayTTS = async () => {
    if (!studyPack?.audioScript) return;

    if (isPlayingAudio) {
      stopAudio();
      setIsPlayingAudio(false);
      return;
    }

    try {
      setIsPlayingAudio(true);
      const data = await api<{ audioBase64?: string }>('/api/gemini/tts', {
        body: { text: studyPack.audioScript.slice(0, 1500), voice: 'Puck' },
      });
      if (!data.audioBase64) throw new Error('No audio returned');
      const audio = await playWavBase64(data.audioBase64, () => setIsPlayingAudio(false));
      setAudioElement(audio);
    } catch (err: any) {
      console.error(err);
      setIsPlayingAudio(false);
      setError(`Audio is unavailable right now (${err.message}). You can still read the summary.`);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* 1. Header Inspired by Turbo.ai */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-700 dark:text-rose-300">
          <Youtube className="w-4 h-4 text-rose-600 fill-rose-600" />
          <span>Turbo.ai Video Intelligence</span>
          <span className="text-rose-400">|</span>
          <span className="font-normal text-slate-500 dark:text-slate-400">YouTube → Notes, Flashcards & Summary</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Turn Any YouTube Video into <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500">
            Study Notes, Flashcards & Quizzes
          </span>
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
          Paste any YouTube lecture link below. Powered by Gemini with Search Grounding, Study Buddy extracts the transcript, core formulas, structured notes, and active recall decks in seconds.
        </p>
      </div>

      {/* 2. Sleek Input Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Youtube className="w-5 h-5 text-rose-500" />
            </div>
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="Paste YouTube link (e.g. https://www.youtube.com/watch?v=...)"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-mono"
            />
          </div>

          <div className="w-full sm:w-48">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            >
              <option value="Cambridge IGCSE">Cambridge IGCSE</option>
              <option value="Mathematics (0580)">Mathematics (0580)</option>
              <option value="Physics (0625)">Physics (0625)</option>
              <option value="Chemistry (0620)">Chemistry (0620)</option>
              <option value="Biology (0610)">Biology (0610)</option>
              <option value="Computer Science (0478)">Computer Science (0478)</option>
              <option value="Economics (0455)">Economics (0455)</option>
              <option value="Business Studies (0450)">Business Studies (0450)</option>
              <option value="Key Stage 3 (Y7-Y9)">Key Stage 3 (Y7-Y9)</option>
            </select>
          </div>

          <button
            onClick={() => handleGenerate()}
            disabled={isLoading}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:opacity-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-200 disabled:opacity-50 shrink-0"
          >
            {isLoading ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Turbo Generate</span>
              </>
            )}
          </button>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
            Or paste a transcript / your notes (works even when AI is offline):
          </label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste lecture transcript, class notes or a textbook section here…"
            className="w-full min-h-[90px] px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          />
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        {/* 1-Click Preset Lectures */}
        <div className="pt-2">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            Or try one of these Cambridge masterclass lectures:
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESET_LECTURES.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setYoutubeUrl(p.url);
                  setSubject(p.subject);
                  handleGenerate(p.url, p.subject, p.titleHint);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200/80 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors flex items-center gap-1.5"
              >
                <Play className="w-3 h-3 text-rose-500 fill-rose-500" />
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Generated Results Showcase */}
      {studyPack && (
        <div className="space-y-6">
          {studyPack.offline && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
              {studyPack.notice || 'AI is unavailable; this pack was generated by the offline engine.'}
            </div>
          )}
          {/* Video Header & Embed Row */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-6 items-start">
            {/* Embed / Thumbnail */}
            {studyPack.embedUrl ? (
              <div className="w-full md:w-80 aspect-video rounded-2xl overflow-hidden bg-black shrink-0 border border-slate-200 dark:border-slate-800">
                <iframe
                  src={studyPack.embedUrl}
                  title={studyPack.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="w-full md:w-80 aspect-video rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                <Youtube className="w-12 h-12 text-rose-500" />
              </div>
            )}

            <div className="flex-1 space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 text-xs font-semibold">
                <span>{subject}</span>
                <span>•</span>
                <span>{studyPack.estimatedDuration || 'Lecture'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {studyPack.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Instructor / Channel: <span className="font-semibold text-slate-700 dark:text-slate-300">{studyPack.author || 'Educational Creator'}</span>
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={handlePlayTTS}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-xs font-semibold text-slate-800 dark:text-white flex items-center gap-2 transition-colors border border-slate-200 dark:border-slate-700"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'text-teal-500 animate-pulse' : ''}`} />
                  <span>{isPlayingAudio ? 'Stop Audio' : 'Listen to Audio Summary'}</span>
                </button>

                <a
                  href={studyPack.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open on YouTube</span>
                </a>
              </div>
            </div>
          </div>

          {/* 4 Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
            {[
              { id: 'notes', label: 'Structured Notes', icon: FileText, count: null },
              { id: 'flashcards', label: 'Flashcards', icon: Layers, count: studyPack.flashcards.length },
              { id: 'summary', label: 'Executive Summary', icon: CheckCircle2, count: null },
              { id: 'quiz', label: 'Mastery Quiz', icon: HelpCircle, count: studyPack.quiz.length },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shrink-0 ${
                    isActive
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t.label}</span>
                  {t.count !== null && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {t.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* TAB 1: STRUCTURED NOTES */}
          {activeTab === 'notes' && (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    Synthesized Lecture Notes
                  </h4>
                  <p className="text-xs text-slate-500 font-serif italic">
                    Aligned with Cambridge syllabus objectives & examiner criteria
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyNotes}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-teal-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
                  </button>
                </div>
              </div>

              <MarkdownText text={studyPack.notes} className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-sans" />
            </div>
          )}

          {/* TAB 2: FLASHCARDS (Active Recall Engine) */}
          {activeTab === 'flashcards' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    Interactive Recall Deck ({studyPack.flashcards.length} Cards)
                  </h4>
                  <p className="text-xs text-slate-500 font-serif italic">
                    Click card to flip. Test yourself before checking the mark scheme answer.
                  </p>
                </div>

                {onAddFlashcardsToMainDeck && (
                  <button
                    onClick={handleAddAllToDeck}
                    disabled={isAddedToDeck}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      isAddedToDeck
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200'
                        : 'bg-teal-600 text-white hover:bg-teal-700 shadow-xs'
                    }`}
                  >
                    {isAddedToDeck ? <Check className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                    <span>{isAddedToDeck ? 'Added to Study Buddy Deck' : 'Add All to Main Deck (+25 XP)'}</span>
                  </button>
                )}
              </div>

              {/* 3D Flip Card */}
              {studyPack.flashcards.length > 0 && (
                <div className="max-w-xl mx-auto">
                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="min-h-[260px] p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl cursor-pointer flex flex-col justify-between transition-transform duration-300 hover:scale-[1.01] relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold text-rose-400">
                        {isFlipped ? 'ANSWER & REASONING' : 'QUESTION'}
                      </span>
                      <span className="font-mono">
                        {currentCardIndex + 1} / {studyPack.flashcards.length}
                      </span>
                    </div>

                    <div className="py-6 text-center">
                      <p className="text-lg sm:text-xl font-bold leading-snug">
                        {isFlipped
                          ? studyPack.flashcards[currentCardIndex].back
                          : studyPack.flashcards[currentCardIndex].front}
                      </p>
                      {showHint && !isFlipped && (
                        <p className="text-xs text-amber-300 mt-4 italic font-serif">
                          💡 Hint: {studyPack.flashcards[currentCardIndex].hint}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowHint(!showHint);
                        }}
                        className="hover:text-amber-300 transition-colors flex items-center gap-1"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
                      </button>
                      <span className="text-[11px] font-mono uppercase bg-white/10 px-2 py-0.5 rounded-md">
                        {studyPack.flashcards[currentCardIndex].difficulty}
                      </span>
                      <span className="text-slate-400 hover:text-white transition-colors">
                        Click card to {isFlipped ? 'flip back' : 'reveal answer'}
                      </span>
                    </div>
                  </div>

                  {/* Card Navigation Controls */}
                  <div className="flex items-center justify-between mt-4">
                    <button
                      onClick={() => {
                        setCurrentCardIndex((prev) => Math.max(0, prev - 1));
                        setIsFlipped(false);
                        setShowHint(false);
                      }}
                      disabled={currentCardIndex === 0}
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsFlipped(!isFlipped);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
                    >
                      Flip Card
                    </button>

                    <button
                      onClick={() => {
                        setCurrentCardIndex((prev) =>
                          Math.min(studyPack.flashcards.length - 1, prev + 1)
                        );
                        setIsFlipped(false);
                        setShowHint(false);
                      }}
                      disabled={currentCardIndex === studyPack.flashcards.length - 1}
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 flex items-center gap-1"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Grid of all generated cards */}
              <div className="pt-6">
                <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  All Flashcards from this Lecture
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {studyPack.flashcards.map((c, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setCurrentCardIndex(idx);
                        setIsFlipped(false);
                      }}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                        currentCardIndex === idx
                          ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                        <span className="font-semibold text-rose-500">Card #{idx + 1}</span>
                        <span className="font-mono">{c.difficulty}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                        {c.front}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                        {c.back}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EXECUTIVE SUMMARY & AUDIO */}
          {activeTab === 'summary' && (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    Executive Summary & Takeaways
                  </h4>
                  <p className="text-xs text-slate-500 font-serif italic">
                    The core principles condensed for rapid pre-exam revision
                  </p>
                </div>

                <button
                  onClick={handlePlayTTS}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:opacity-95 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-opacity"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isPlayingAudio ? 'Pause Narration' : 'Play Audio Summary'}</span>
                </button>
              </div>

              <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line font-sans">
                {studyPack.summary}
              </div>
            </div>
          )}

          {/* TAB 4: MASTERY QUIZ */}
          {activeTab === 'quiz' && (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  Video Comprehension Quiz
                </h4>
                <p className="text-xs text-slate-500 font-serif italic">
                  Instant feedback to verify you mastered the concepts taught in the video
                </p>
              </div>

              <div className="space-y-6">
                {studyPack.quiz.map((q, qIdx) => {
                  const userAnswer = selectedAnswers[qIdx];
                  const hasAnswered = userAnswer !== undefined;
                  const isCorrect = userAnswer === q.correctIndex;

                  return (
                    <div
                      key={qIdx}
                      className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3"
                    >
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {qIdx + 1}. {q.question}
                      </p>

                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = userAnswer === optIdx;
                          const isOptionCorrect = optIdx === q.correctIndex;

                          let btnStyle =
                            'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750';

                          if (hasAnswered) {
                            if (isOptionCorrect) {
                              btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-semibold';
                            } else if (isSelected && !isCorrect) {
                              btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleAnswerQuiz(qIdx, optIdx)}
                              disabled={hasAnswered}
                              className={`w-full text-left px-4 py-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {hasAnswered && isOptionCorrect && (
                                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {hasAnswered && (
                        <div
                          className={`p-3 rounded-xl text-xs ${
                            isCorrect
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          <span className="font-bold">
                            {isCorrect ? '✓ Correct! (+10 XP)' : '✗ Not quite.'}{' '}
                          </span>
                          <span>{q.explanation}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
