import React from 'react';
import {
  Brain,
  Headphones,
  Sparkles,
  Award,
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap,
  TrendingUp,
  Clock,
  BookOpen,
  Users,
  Video,
  FileCheck2,
  Youtube,
  Sun,
  Moon,
  Layers,
} from 'lucide-react';
import { StudyBuddyLogo } from './StudyBuddyLogo';

interface LandingPageProps {
  onGetStarted: () => void;
  onContinueWithGoogle: () => void;
  onPreviewAsGuest: () => void;
  darkMode: boolean;
  setDarkMode?: (val: boolean) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onContinueWithGoogle,
  onPreviewAsGuest,
  darkMode,
  setDarkMode,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-teal-500/25 transition-colors duration-300">
      {/* 0. Dedicated Landing Header */}
      <header className="sticky top-0 z-40 w-full goodness-glass border-b goodness-border transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <StudyBuddyLogo className="h-9 sm:h-10" darkMode={darkMode} />
            <div className="hidden sm:block pl-3 border-l border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
                Cambridge & Secondary Intelligence
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-serif italic -mt-0.5 block">
                Taking learning to another step.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onPreviewAsGuest}
              className="hidden md:inline-flex text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 px-3 py-2 rounded-xl transition-colors"
            >
              Explore as Guest
            </button>

            {setDarkMode && (
              <button
                onClick={() => setDarkMode(!darkMode)}
                aria-label="Toggle theme"
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 transition-colors"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>
            )}

            <button
              onClick={onGetStarted}
              className="text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
            >
              Sign In
            </button>

            <button
              onClick={onContinueWithGoogle}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs flex items-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-sm transition-all"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Get Started</span>
            </button>
          </div>
        </div>
      </header>

      <div className="space-y-24 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. HERO SHOWCASE */}
        <section className="text-center max-w-5xl mx-auto px-4">
          {/* Subtle Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/60 mb-8 transition-transform hover:scale-105">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
            <span className="text-xs font-semibold text-teal-800 dark:text-teal-300">
              The #1 Cambridge IGCSE & Secondary Academic Platform
            </span>
            <span className="text-xs text-teal-400">|</span>
            <span className="text-xs font-medium text-teal-600 dark:text-teal-400">
              100% Free with Academic XP
            </span>
          </div>

          {/* Brand Logo Presentation */}
          <div className="flex justify-center mb-6">
            <StudyBuddyLogo className="h-16 sm:h-24" darkMode={darkMode} />
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6">
            Taking learning to <br className="hidden sm:inline" />
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 dark:from-sky-400 dark:via-indigo-300 dark:to-teal-300">
              another step.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-10">
            Built for students who refuse to settle. Master every Cambridge IGCSE code and Key Stage 3 topic through rigorous High Thinking reasoning, Turbo.ai YouTube video note synthesis, AI audio coaching, and active recall.
          </p>

          {/* CTA Buttons with Google Sign-in */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8">
            <button
              onClick={onContinueWithGoogle}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-600 text-white font-bold text-sm sm:text-base hover:opacity-95 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onPreviewAsGuest}
            className="text-xs text-slate-500 dark:text-slate-400 font-semibold hover:text-teal-600 dark:hover:text-teal-400 transition-colors underline"
          >
            Explore workspace without signing in →
          </button>
        </section>

        {/* 1.5 NEW: TURBO.AI YOUTUBE FEATURE MARQUEE */}
        <section className="max-w-5xl mx-auto px-4">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-rose-500/10 via-amber-500/10 to-teal-500/10 dark:from-rose-950/40 dark:via-amber-950/30 dark:to-teal-950/40 border border-rose-200/60 dark:border-rose-900/40 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-xl text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 text-xs font-bold">
                  <Youtube className="w-4 h-4 text-rose-600 fill-rose-600" />
                  <span>Inspired by Turbo.ai</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  Paste Any YouTube Link. <br />
                  Get Flashcards, Notes & Summaries in Seconds.
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Found a 45-minute Cambridge Physics or Math lecture? Just paste the YouTube link into Study Buddy. Our Gemini AI engine synthesizes the video into structured markdown notes, high-yield active recall flashcards, and a quick self-assessment quiz.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                    ✓ Structured Notes
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                    ✓ 3D Flip Flashcards
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                    ✓ Spoken Audio TTS
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                    ✓ Comprehension Quiz
                  </span>
                </div>
              </div>

              <div className="w-full md:w-80 shrink-0">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
                    <Youtube className="w-4 h-4 fill-rose-600" />
                    <span>Turbo Video Intelligence</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-500 truncate">
                    youtube.com/watch?v=0jPcbOQzXyE
                  </div>
                  <button
                    onClick={onGetStarted}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs hover:opacity-95"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Try YouTube to Notes Free</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. WHY STUDY BUDDY IS THE BEST (Goodness Pillars) */}
        <section className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Why Study Buddy is The Best
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-serif italic mt-2 max-w-xl mx-auto">
              Unlike generic AI tools that hallucinate answers, Study Buddy is calibrated specifically to Cambridge International standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-teal-400/80 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                High Thinking Reasoning
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                Powered by <strong>Gemini 4 Argon</strong> with maximized reasoning depth. Never just an answer—get the full mathematical derivation, mark scheme method marks (M1, A1), and common examiner traps.
              </p>
              <div className="pt-2 text-xs font-mono font-semibold text-amber-600 dark:text-amber-400">
                ✓ ThinkingLevel.HIGH Enabled
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-teal-400/80 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Vocalized AI Coaching & TTS
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                Speak your doubts aloud with <strong>Gemini 3.5 Transcribe</strong>. Listen to concise audio summaries and dual-speaker podcasts with <strong>Gemini 3.8 Flash TTS</strong> during your revision commute.
              </p>
              <div className="pt-2 text-xs font-mono font-semibold text-teal-600 dark:text-teal-400">
                ✓ 24kHz Studio Audio Quality
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-teal-400/80 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                SuperMemo-2 Spaced Recall
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                Beat the Ebbinghaus forgetting curve. The built-in SM-2 engine calculates exact day intervals for flashcards so you review right before memories fade.
              </p>
              <div className="pt-2 text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                ✓ Scientifically Proven Intervals
              </div>
            </div>
          </div>
        </section>

        {/* 3. COMPARISON TABLE: STUDY BUDDY VS GENERIC APPS */}
        <section className="max-w-4xl mx-auto px-4">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                How Study Buddy Compares
              </h3>
              <p className="text-xs text-slate-400 font-serif italic mt-1">
                Purpose-built for secondary examinations and British curriculum.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Capability</th>
                    <th className="py-3 px-4 text-teal-600 dark:text-teal-400 font-extrabold">Study Buddy</th>
                    <th className="py-3 px-4 text-slate-400 font-normal">Generic Chatbots</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
                  <tr>
                    <td className="py-3.5 px-4 font-semibold">YouTube to Notes & Flashcards (Turbo AI)</td>
                    <td className="py-3.5 px-4 text-teal-600 font-bold">✓ Structured Notes, Flip Cards & Quiz</td>
                    <td className="py-3.5 px-4 text-slate-400">✗ None / Plain text only</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold">Cambridge IGCSE 80+ Syllabus Codes</td>
                    <td className="py-3.5 px-4 text-teal-600 font-bold">✓ Full Registry</td>
                    <td className="py-3.5 px-4 text-slate-400">✗ Generic only</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold">Step-by-Step Mark Scheme Derivation</td>
                    <td className="py-3.5 px-4 text-teal-600 font-bold">✓ High Thinking (Gemini 4 Argon)</td>
                    <td className="py-3.5 px-4 text-slate-400">✗ Skips intermediate lines</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold">Audio Tutor with Voice Dictation</td>
                    <td className="py-3.5 px-4 text-teal-600 font-bold">✓ Gemini 3.5 + 3.8 Flash TTS</td>
                    <td className="py-3.5 px-4 text-slate-400">✗ Robotic or missing</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold">Free PRO Membership (No Subscriptions)</td>
                    <td className="py-3.5 px-4 text-teal-600 font-bold">✓ Earn via Academic XP</td>
                    <td className="py-3.5 px-4 text-slate-400">✗ $20/mo Paywalls</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold">Google Workspace Export (Tasks, Slides)</td>
                    <td className="py-3.5 px-4 text-teal-600 font-bold">✓ Instant 1-Click Export</td>
                    <td className="py-3.5 px-4 text-slate-400">✗ Manual copy-paste</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 4. FINAL CTA BANNER */}
        <section className="text-center max-w-3xl mx-auto px-4 pb-12">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-950 text-white shadow-xl space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to take learning to another step?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto font-serif italic">
              Join thousands of scholars achieving distinctions across Cambridge IGCSE and Key Stage 3.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onContinueWithGoogle}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-slate-950 font-bold text-sm shadow-md hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
              <button
                onClick={onPreviewAsGuest}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-white/20 text-white font-medium text-sm hover:bg-white/10 transition-colors"
              >
                Preview Workspace as Guest
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

