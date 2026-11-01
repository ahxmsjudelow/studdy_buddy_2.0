import React from 'react';
import { Sparkles, Sun, Moon, Flame, Clock, BookOpen, BrainCircuit, MessageSquare, Compass, Video } from 'lucide-react';
import { StudyBuddyLogo } from './StudyBuddyLogo';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  streak: number;
  openPomodoro: () => void;
  user: { name: string; email: string; avatar: string } | null;
  onViewLanding: () => void;
  onSignOut: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  activeTab,
  setActiveTab,
  streak,
  openPomodoro,
  user,
  onViewLanding,
  onSignOut,
  onOpenAuth,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Sparkles },
    { id: 'planner', label: 'Study Planner', icon: Clock },
    { id: 'module', label: 'Learning Modules', icon: BookOpen },
    { id: 'thinking', label: 'High Thinking', icon: BrainCircuit, badge: 'Argon' },
    { id: 'chat', label: 'AI Tutor', icon: MessageSquare },
    { id: 'flashcards', label: 'Flashcards', icon: Sparkles },
    { id: 'catalog', label: 'Curriculum', icon: BookOpen },
    { id: 'rewards', label: 'PRO Quest', icon: Flame },
    { id: 'video', label: 'Video Analyzer', icon: Video },
  ];

  return (
    <header className="sticky top-0 z-40 w-full goodness-glass border-b goodness-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand with User's Official Logo */}
        <div
          className="flex items-center space-x-3 cursor-pointer group shrink-0"
          onClick={() => setActiveTab('dashboard')}
        >
          <div className="h-9 sm:h-10 flex items-center shrink-0">
            <StudyBuddyLogo className="h-9 sm:h-10" darkMode={darkMode} />
          </div>
          <div className="hidden xl:block pl-3 border-l border-gray-200 dark:border-gray-800">
            <p className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
              Cambridge & KS3 Hub
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-serif italic -mt-0.5 whitespace-nowrap">
              Taking learning to another step.
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 p-1 bg-gray-100/80 dark:bg-gray-800/60 rounded-2xl border border-gray-200/60 dark:border-gray-700/50" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-3 py-1.5 text-xs font-medium rounded-xl transition-all duration-200 flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-white dark:bg-gray-900 text-teal-600 dark:text-teal-400 shadow-xs font-bold'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1 text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right side controls: Streak, Pomodoro, User / Landing, Theme */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Study Streak */}
          <div
            title="Consecutive study day streak"
            className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-800/30 text-orange-600 dark:text-orange-400 text-xs font-semibold"
          >
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
            <span>{streak}d</span>
          </div>

          {/* Pomodoro Timer button */}
          <button
            onClick={openPomodoro}
            aria-label="Open Pomodoro focus timer"
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border border-gray-200/80 dark:border-gray-700/80 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-medium transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="hidden md:inline">Focus</span>
          </button>

          {/* User Profile or Guest Indicator */}
          {user ? (
            <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-200">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-teal-500"
                />
                <span className="hidden lg:inline font-semibold max-w-[100px] truncate">{user.name}</span>
              </div>
              <button
                onClick={onViewLanding}
                title="View About / Why Study Buddy is Best"
                className="px-2.5 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              >
                Why Best?
              </button>
              <button
                onClick={onSignOut}
                title="Sign out of Study Buddy"
                className="p-1.5 text-xs text-slate-400 hover:text-rose-500 transition-colors"
              >
                Exit
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="px-3 py-1.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition-colors shadow-xs"
              >
                Sign In
              </button>
              <button
                onClick={onViewLanding}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                About
              </button>
            </div>
          )}

          {/* Dark Mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200/60 dark:border-gray-700/50"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Mobile nav bar scrollable */}
      <div className="lg:hidden flex items-center space-x-2 px-4 py-2 overflow-x-auto border-t goodness-border bg-gray-50/50 dark:bg-gray-900/50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`shrink-0 px-3 py-1 text-xs font-medium rounded-lg flex items-center space-x-1.5 ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
