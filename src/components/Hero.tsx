import React from 'react';
import { Search, Sparkles, Brain, Headphones, ArrowRight, ShieldCheck, Compass, BookOpenCheck } from 'lucide-react';
import { StudyBuddyLogo } from './StudyBuddyLogo';

interface HeroProps {
  darkMode: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedStage: string;
  setSelectedStage: (s: string) => void;
  onSelectFeature: (tab: string) => void;
  totalSubjectsCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  darkMode,
  searchQuery,
  setSearchQuery,
  selectedStage,
  setSelectedStage,
  onSelectFeature,
  totalSubjectsCount,
}) => {
  return (
    <section className="relative pt-12 pb-16 overflow-hidden">
      {/* Background ambient gradient glow inspired by ai.google and studyable.app */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/15 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-teal-400/10 dark:bg-teal-500/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '4s' }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle Pill Banner */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 mb-8 transition-transform hover:scale-102">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
          <span className="text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-300">
            Official Cambridge IGCSE & KS3 Syllabus Database
          </span>
          <span className="text-xs text-slate-400">|</span>
          <span className="text-xs font-medium text-teal-600 dark:text-teal-400 flex items-center gap-1">
            2026-2027 Editions <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        {/* Large Logo & Brand Hero */}
        <div className="flex justify-center mb-6">
          <StudyBuddyLogo className="h-14 sm:h-20" darkMode={darkMode} />
        </div>

        {/* Main Motto & Subtitle with ai.google & studyable typography */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] mb-5">
          Taking learning to <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 dark:from-sky-400 dark:via-indigo-300 dark:to-teal-300">another step.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-10">
          The ultimate intelligent study suite for secondary scholars. Master every Cambridge IGCSE code and KS3 topic with deep reasoning breakdowns, instant audio coaching, and active recall.
        </p>

        {/* Stage Filter Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-8">
          {[
            { id: 'All', label: 'All Curricula' },
            { id: 'Y7-Y9', label: 'Y7 - Y9 (Lower Secondary)' },
            { id: 'Y10-Y13', label: 'Cambridge IGCSE (Y10 - Y13)' },
          ].map((stage) => (
            <button
              key={stage.id}
              onClick={() => setSelectedStage(stage.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedStage === stage.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {stage.label}
            </button>
          ))}
        </div>

        {/* Unified Goodness Search Input */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 80+ subjects by code (e.g. 0580, 0620, 0450) or topic..."
              className="w-full pl-12 pr-28 py-3.5 sm:py-4 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all text-sm sm:text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-24 pr-2 flex items-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
            <div className="absolute inset-y-1.5 right-1.5 flex items-center">
              <span className="hidden sm:inline-block px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-mono border border-slate-200 dark:border-slate-700">
                {totalSubjectsCount} subjects
              </span>
            </div>
          </div>
        </div>

        {/* Core Pillars Grid inspired by ai.google card layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {/* Card 1: High Thinking */}
          <div
            onClick={() => onSelectFeature('thinking')}
            className="group cursor-pointer p-5 rounded-2xl bg-white/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 hover:border-blue-400 dark:hover:border-blue-500/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-800/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3.5 group-hover:scale-105 transition-transform">
              <Brain className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                Deep Solver
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-200/60 dark:border-amber-800/30">
                High Thinking
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Step-by-step rigorous working with Gemini 4 Argon for the hardest Cambridge exam papers.
            </p>
          </div>

          {/* Card 2: Audio Coaching & TTS */}
          <div
            onClick={() => onSelectFeature('chat')}
            className="group cursor-pointer p-5 rounded-2xl bg-white/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 hover:border-teal-400 dark:hover:border-teal-500/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-100 dark:border-teal-800/40 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-3.5 group-hover:scale-105 transition-transform">
              <Headphones className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                AI Voice Tutor
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 px-1.5 py-0.5 rounded border border-teal-200/60 dark:border-teal-800/30">
                TTS & Audio
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Dictate questions with voice transcription and listen to vocalized Cambridge explanations.
            </p>
          </div>

          {/* Card 3: Spaced Repetition */}
          <div
            onClick={() => onSelectFeature('flashcards')}
            className="group cursor-pointer p-5 rounded-2xl bg-white/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-800/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3.5 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                Active Recall
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-1.5 py-0.5 rounded border border-indigo-200/60 dark:border-indigo-800/30">
                SM-2 Deck
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              SuperMemo-2 active recall flashcards with 3D flip transitions and intelligent intervals.
            </p>
          </div>

          {/* Card 4: Syllabus & Search Grounding */}
          <div
            onClick={() => onSelectFeature('search')}
            className="group cursor-pointer p-5 rounded-2xl bg-white/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 hover:border-sky-400 dark:hover:border-sky-500/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-100 dark:border-sky-800/40 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-3.5 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                Live Grounding
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 px-1.5 py-0.5 rounded border border-sky-200/60 dark:border-sky-800/30">
                Google Search
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Real-time syllabus checks, grade boundaries, and verified British Council study locations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
