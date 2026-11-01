import React, { useState } from 'react';
import { Subject } from '../data/subjects';
import {
  Brain,
  Headphones,
  Sparkles,
  MessageSquare,
  Compass,
  FileText,
  SlidersHorizontal,
  Flame,
  Award,
  BookOpen,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { computeGradeEstimate } from '../utils/studyUtils';

interface PersonalizedDashboardProps {
  yearGroup: 'Y7-Y9' | 'Y10-Y13';
  chosenSubjects: Subject[];
  onOpenCustomizer: () => void;
  onLaunchThinking: (subject: Subject, question?: string) => void;
  onLaunchTTS: (subject: Subject, topicText: string) => void;
  onLaunchFlashcards: (subject: Subject) => void;
  onLaunchChat: (subject: Subject) => void;
  onLaunchSearch: (subject: Subject) => void;
  onViewSubjectDetail: (subject: Subject) => void;
  onOpenWorkspace: (subject: Subject) => void;
  onLaunchTurboVideo?: () => void;
  streak: number;
}

export const PersonalizedDashboard: React.FC<PersonalizedDashboardProps> = ({
  yearGroup,
  chosenSubjects,
  onOpenCustomizer,
  onLaunchThinking,
  onLaunchTTS,
  onLaunchFlashcards,
  onLaunchChat,
  onLaunchSearch,
  onViewSubjectDetail,
  onOpenWorkspace,
  onLaunchTurboVideo,
  streak,
}) => {
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All');
  const gradeEstimate = computeGradeEstimate(88); // Projected Cambridge score

  const filtered = selectedSubjectFilter === 'All'
    ? chosenSubjects
    : chosenSubjects.filter((s) => s.id === selectedSubjectFilter);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner & Profile Overview */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 text-white p-6 sm:p-8 border border-slate-700/60 shadow-xl">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              <span>{yearGroup === 'Y7-Y9' ? 'Lower Secondary (Years 7–9)' : 'Cambridge IGCSE (Years 10–13)'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Personalized Study Dashboard
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-serif italic max-w-xl">
              &ldquo;Taking learning to another step.&rdquo; Your customized syllabus hub with intelligent problem breakdowns, audio coaching, and past paper drills.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCustomizer}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-medium transition-colors backdrop-blur-sm"
            >
              <SlidersHorizontal className="w-4 h-4 text-teal-400" />
              <span>Change Subjects ({chosenSubjects.length})</span>
            </button>
          </div>
        </div>

        {/* Dashboard Stat Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-700/60">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-xs text-slate-400 block mb-1">Enrolled Subjects</span>
            <div className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-400" />
              <span>{chosenSubjects.length}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-xs text-slate-400 block mb-1">Study Streak</span>
            <div className="text-xl sm:text-2xl font-bold text-orange-400 flex items-center gap-2">
              <Flame className="w-5 h-5 fill-orange-400" />
              <span>{streak} Days</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-xs text-slate-400 block mb-1">Projected Grade</span>
            <div className="text-xl sm:text-2xl font-bold text-emerald-400 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span>{gradeEstimate.letterGrade} ({gradeEstimate.numberGrade})</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-xs text-slate-400 block mb-1">Active Recall Deck</span>
            <div className="text-xl sm:text-2xl font-bold text-sky-400 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-400" />
              <span>SM-2 Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Turbo Video Intelligence Banner (Turbo.ai style) */}
      {onLaunchTurboVideo && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-500/10 via-orange-500/10 to-amber-500/10 border border-rose-200/80 dark:border-rose-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <span className="font-extrabold text-xs">AI</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                  Turbo.ai Video Intelligence
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-semibold">
                  New
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                Paste any YouTube lecture URL to instantly generate Cambridge study notes, 3D flip flashcards, and a mastery quiz.
              </p>
            </div>
          </div>

          <button
            onClick={onLaunchTurboVideo}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
          >
            <span>Launch Turbo Video</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Subject Quick Filter Bar */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedSubjectFilter('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedSubjectFilter === 'All'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            All Chosen ({chosenSubjects.length})
          </button>
          {chosenSubjects.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSubjectFilter(s.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedSubjectFilter === s.id
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {s.code ? `${s.name} (${s.code})` : s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Subjects Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((subject) => {
          const sampleQ = subject.sampleQuestions?.[0];
          return (
            <div
              key={subject.id}
              className="group bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/90 dark:border-slate-800 hover:border-teal-400/80 dark:hover:border-teal-500/50 p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Subject Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/40">
                        {subject.category}
                      </span>
                      {subject.code && (
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          Code: {subject.code}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {subject.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => onViewSubjectDetail(subject)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="View Full Syllabus & Topics"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Key Syllabus Topics */}
                <div className="mb-5">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">
                    Core Syllabus Modules ({subject.topics.length} total):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {subject.topics.slice(0, 4).map((topic, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 font-medium"
                      >
                        {topic}
                      </span>
                    ))}
                    {subject.topics.length > 4 && (
                      <span
                        onClick={() => onViewSubjectDetail(subject)}
                        className="text-xs px-2 py-1 rounded-lg text-teal-600 dark:text-teal-400 font-medium cursor-pointer hover:underline"
                      >
                        +{subject.topics.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Featured Practice Question snippet if available */}
                {sampleQ && (
                  <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 mb-5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      <span>Cambridge Past Paper Challenge {sampleQ.year ? `(${sampleQ.year})` : ''}</span>
                      <span className="text-teal-600 dark:text-teal-400 font-bold">{sampleQ.marks} Marks</span>
                    </div>
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
                      {sampleQ.question}
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Resource & Study Tool Links */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                  Study Materials & Intelligent Tools:
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {/* Link 1: High Thinking Problem Solver */}
                  <button
                    onClick={() => onLaunchThinking(subject, sampleQ?.question)}
                    className="flex items-center gap-2 p-2 rounded-xl text-left bg-blue-50/60 dark:bg-blue-950/30 hover:bg-blue-100/70 dark:hover:bg-blue-900/40 border border-blue-200/50 dark:border-blue-800/30 transition-colors group/btn"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Brain className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-blue-950 dark:text-blue-200 block truncate">
                        Deep Solve
                      </span>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 block truncate">
                        High Thinking
                      </span>
                    </div>
                  </button>

                  {/* Link 2: Audio Voice Tutor & TTS */}
                  <button
                    onClick={() => onLaunchTTS(subject, subject.topics[0] || subject.name)}
                    className="flex items-center gap-2 p-2 rounded-xl text-left bg-teal-50/60 dark:bg-teal-950/30 hover:bg-teal-100/70 dark:hover:bg-teal-900/40 border border-teal-200/50 dark:border-teal-800/30 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
                      <Headphones className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-teal-950 dark:text-teal-200 block truncate">
                        Listen Audio
                      </span>
                      <span className="text-[10px] text-teal-600 dark:text-teal-400 block truncate">
                        3.8 Flash TTS
                      </span>
                    </div>
                  </button>

                  {/* Link 3: Active Recall Flashcards */}
                  <button
                    onClick={() => onLaunchFlashcards(subject)}
                    className="flex items-center gap-2 p-2 rounded-xl text-left bg-indigo-50/60 dark:bg-indigo-950/30 hover:bg-indigo-100/70 dark:hover:bg-indigo-900/40 border border-indigo-200/50 dark:border-indigo-800/30 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200 block truncate">
                        Flashcards
                      </span>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 block truncate">
                        SM-2 Deck
                      </span>
                    </div>
                  </button>

                  {/* Link 4: Socratic AI Tutor */}
                  <button
                    onClick={() => onLaunchChat(subject)}
                    className="flex items-center gap-2 p-2 rounded-xl text-left bg-sky-50/60 dark:bg-sky-950/30 hover:bg-sky-100/70 dark:hover:bg-sky-900/40 border border-sky-200/50 dark:border-sky-800/30 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-sky-950 dark:text-sky-200 block truncate">
                        Ask Tutor
                      </span>
                      <span className="text-[10px] text-sky-600 dark:text-sky-400 block truncate">
                        Socratic Chat
                      </span>
                    </div>
                  </button>

                  {/* Link 5: Grounded Syllabus Specs */}
                  <button
                    onClick={() => onLaunchSearch(subject)}
                    className="flex items-center gap-2 p-2 rounded-xl text-left bg-amber-50/60 dark:bg-amber-950/30 hover:bg-amber-100/70 dark:hover:bg-amber-900/40 border border-amber-200/50 dark:border-amber-800/30 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-amber-950 dark:text-amber-200 block truncate">
                        Syllabus Spec
                      </span>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 block truncate">
                        Google Search
                      </span>
                    </div>
                  </button>

                  {/* Link 6: Export to Study Tasks / Schedule */}
                  <button
                    onClick={() => onOpenWorkspace(subject)}
                    className="flex items-center gap-2 p-2 rounded-xl text-left bg-slate-100/80 dark:bg-slate-800/60 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                        Study Tasks
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                        Google Tasks/Slides
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
