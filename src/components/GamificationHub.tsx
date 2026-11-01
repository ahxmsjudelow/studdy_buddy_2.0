import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Crown,
  Flame,
  Star,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  Users,
  Shield,
  Gift,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'Streaks' | 'Mastery' | 'Dedication' | 'Curriculum';
}

interface GamificationHubProps {
  points: number;
  onAddPoints: (amount: number, reason: string) => void;
  isProUnlocked: boolean;
  onUnlockPro: () => void;
  badges: Badge[];
  darkMode?: boolean;
}

export const GamificationHub: React.FC<GamificationHubProps> = ({
  points,
  onAddPoints,
  isProUnlocked,
  onUnlockPro,
  badges,
  darkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'badges' | 'pro'>('pro');
  const proThreshold = 500;
  const progressPct = Math.min(100, Math.round((points / proThreshold) * 100));

  // Sample student leaderboard (Cambridge scholars)
  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, name: 'Maya S.', school: 'Cambridge International School', points: 740, badge: 'A* Scholar', specialty: 'Math & Sciences (0580/0625)' },
    { rank: 2, name: 'Liam K.', school: 'British Overseas Academy', points: 680, badge: 'High Thinker', specialty: 'Computer Science (0478)' },
    { rank: 3, name: 'You', school: 'Study Buddy Scholar', points: points, badge: isProUnlocked ? 'PRO Member' : 'Rising Scholar', specialty: 'Cambridge IGCSE', isUser: true },
    { rank: 4, name: 'Zara A.', school: 'St. George Grammar', points: 490, badge: 'Past Paper Ace', specialty: 'Economics & Business' },
    { rank: 5, name: 'Ethan T.', school: 'International Lyceum', points: 410, badge: 'Active Recall Pro', specialty: 'Sciences Co-ordinated' },
    { rank: 6, name: 'Chloe M.', school: 'Kings College Junior', points: 360, badge: 'Socratic Thinker', specialty: 'English & Humanities' },
  ]);

  const handleClaimPro = () => {
    if (points >= proThreshold && !isProUnlocked) {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#F59E0B', '#10B981', '#00A896', '#3B82F6'],
      });
      onUnlockPro();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b goodness-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/40 text-amber-700 dark:text-amber-400 text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Academic Gamification & Rewards</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Study Quest & PRO Rewards
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-serif italic mt-1">
            Earn academic XP through past paper drills, active recall, and focus sessions to unlock Study Buddy PRO for free.
          </p>
        </div>

        {/* Current XP Pill */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-slate-900 dark:text-white flex items-center gap-2.5">
            <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                Your Academic XP
              </span>
              <span className="text-lg font-extrabold font-mono text-amber-600 dark:text-amber-400">
                {points} XP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center p-1.5 bg-slate-100/80 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 max-w-md">
        <button
          onClick={() => setActiveTab('pro')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'pro'
              ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Crown className="w-3.5 h-3.5" />
          <span>Earn PRO Version</span>
        </button>

        <button
          onClick={() => setActiveTab('badges')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'badges'
              ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Badges ({badges.filter((b) => b.unlocked).length}/{badges.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'leaderboard'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Leaderboard</span>
        </button>
      </div>

      {/* TAB 1: EARN PRO VERSION */}
      {activeTab === 'pro' && (
        <div className="space-y-6 animate-fade-in">
          {/* Main PRO Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white p-7 sm:p-9 shadow-xl">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                <Crown className="w-3.5 h-3.5" />
                <span>Earn It with Knowledge, Not Money</span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Study Buddy PRO Version
              </h3>

              <p className="text-amber-100 text-sm sm:text-base leading-relaxed font-serif italic">
                Reach <strong className="text-white underline">{proThreshold} Academic XP</strong> to permanently unlock Study Buddy PRO. Every past paper solved, active recall quiz mastered, and focus timer finished moves you closer!
              </p>

              {/* Progress Bar */}
              <div className="pt-2">
                <div className="flex justify-between items-center text-xs font-semibold mb-2">
                  <span>Current Progress: {points} / {proThreshold} XP</span>
                  <span>{progressPct}% Completed</span>
                </div>
                <div className="w-full h-3 rounded-full bg-black/20 overflow-hidden p-0.5">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {isProUnlocked ? (
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-amber-800 font-bold text-sm shadow-md">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Study Buddy PRO Unlocked & Active!</span>
                  </div>
                ) : points >= proThreshold ? (
                  <button
                    onClick={handleClaimPro}
                    className="px-6 py-3 rounded-xl bg-slate-950 text-white font-bold text-sm hover:bg-slate-900 transition-colors shadow-lg flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Claim Your Free PRO Version Now!</span>
                  </button>
                ) : (
                  <div className="text-xs text-amber-100 font-medium">
                    Need {proThreshold - points} more XP. Solve 2 problems or complete 3 flashcard decks!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Perks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                Unlimited High Thinking Proofs
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Full derivations with Gemini 4 Argon for the most intricate Cambridge P4 & P6 past paper questions.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold mb-3">
                <Gift className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                Custom Cambridge Mock Generator
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Generate tailored exam papers with official mark schemes and examiner notes across 80+ subjects.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold mb-3">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                Cambridge Examiner Audio Vault
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Dual-speaker tutor podcasts and speech downloads powered by Gemini 3.8 Flash TTS.
              </p>
            </div>
          </div>

          {/* Quick Ways to Earn Points */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
              How to Earn Academic XP:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50">
                <span className="font-bold text-teal-600 dark:text-teal-400 block font-mono text-sm mb-0.5">+50 XP</span>
                <span className="text-slate-700 dark:text-slate-300">Solve with High Thinking</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50">
                <span className="font-bold text-teal-600 dark:text-teal-400 block font-mono text-sm mb-0.5">+40 XP</span>
                <span className="text-slate-700 dark:text-slate-300">Complete 25m Focus Session</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50">
                <span className="font-bold text-teal-600 dark:text-teal-400 block font-mono text-sm mb-0.5">+25 XP</span>
                <span className="text-slate-700 dark:text-slate-300">Self-Grade Practice Question</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50">
                <span className="font-bold text-teal-600 dark:text-teal-400 block font-mono text-sm mb-0.5">+20 XP</span>
                <span className="text-slate-700 dark:text-slate-300">Review SM-2 Flashcard Deck</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BADGES & ACHIEVEMENTS */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-5 rounded-2xl border transition-all ${
                b.unlocked
                  ? 'bg-white dark:bg-slate-900/80 border-teal-300 dark:border-teal-700/60 shadow-xs'
                  : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="text-3xl select-none">{b.icon}</div>
                {b.unlocked ? (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                    Unlocked
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    Locked
                  </span>
                )}
              </div>

              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                {b.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {b.description}
              </p>

              {b.unlockedAt && (
                <span className="text-[10px] text-slate-400 block mt-3 font-mono">
                  Earned {b.unlockedAt}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xs animate-fade-in space-y-4">
          <div className="flex items-center justify-between pb-3 border-b goodness-border">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Cambridge Scholars Leaderboard
              </h3>
              <p className="text-xs text-slate-400 font-serif italic">
                Friendly academic rankings across lower and upper secondary cohorts.
              </p>
            </div>
            <span className="text-xs text-teal-600 dark:text-teal-400 font-semibold">
              Weekly Reset in 3 Days
            </span>
          </div>

          <div className="space-y-2">
            {leaderboard
              .sort((a, b) => b.points - a.points)
              .map((student, idx) => (
                <div
                  key={student.name}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-colors ${
                    student.isUser
                      ? 'bg-teal-50/70 dark:bg-teal-950/40 border-teal-400 dark:border-teal-600/60 shadow-xs'
                      : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-700/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        idx === 0
                          ? 'bg-amber-400 text-slate-950 font-black'
                          : idx === 1
                          ? 'bg-slate-300 dark:bg-slate-600 text-slate-900 dark:text-white'
                          : idx === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {idx + 1}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {student.name}
                        </span>
                        {student.isUser && (
                          <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/60 px-1.5 py-0.2 rounded">
                            YOU
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 truncate hidden sm:inline">
                          • {student.specialty}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                        {student.school}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm sm:text-base font-extrabold font-mono text-slate-900 dark:text-white block">
                      {student.points} XP
                    </span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                      {student.badge}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
