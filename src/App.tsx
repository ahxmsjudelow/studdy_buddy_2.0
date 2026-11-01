import React, { useState, useEffect } from 'react';
import { SUBJECTS, Subject } from './data/subjects';
import { INITIAL_FLASHCARDS, FlashcardItem } from './data/flashcardsData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { TurboVideoToNotes } from './components/TurboVideoToNotes';
import { StudentOnboardingModal } from './components/StudentOnboardingModal';
import { PersonalizedDashboard } from './components/PersonalizedDashboard';
import { StudyPlanner } from './components/StudyPlanner';
import { InteractiveLearningModule } from './components/InteractiveLearningModule';
import { ThinkingSolver } from './components/ThinkingSolver';
import { StudyChatbot } from './components/StudyChatbot';
import { FlashcardsDeck } from './components/FlashcardsDeck';
import { SearchGroundingView } from './components/SearchGroundingView';
import { MapsGroundingView } from './components/MapsGroundingView';
import { VideoAnalyzer } from './components/VideoAnalyzer';
import { WorkspaceTools } from './components/WorkspaceTools';
import { GamificationHub, Badge } from './components/GamificationHub';
import { SubjectCatalog } from './components/SubjectCatalog';
import { SubjectDetailModal } from './components/SubjectDetailModal';
import { PomodoroTimer } from './components/PomodoroTimer';
import { ClassesHub } from './components/ClassesHub';
import { playWavBase64 } from './utils/api';
import { StudyBuddyLogo } from './components/StudyBuddyLogo';
import {
  BookOpen,
  Calendar,
  Sparkles,
  Trophy,
  Brain,
  MessageSquare,
  Compass,
  MapPin,
  Share2,
  Video,
  Layers,
  Crown,
  Youtube,
  GraduationCap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

export default function App() {
  // User Authentication state (defaults to landing page for first-time visitors)
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('studybuddy_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'landing' | 'workspace'>(() => {
    try {
      const saved = localStorage.getItem('studybuddy_user');
      return saved ? 'workspace' : 'landing';
    } catch {
      return 'landing';
    }
  });

  // Global flashcards state (synced with YouTube imports & SuperMemo-2 deck)
  const [allFlashcards, setAllFlashcards] = useState<FlashcardItem[]>(INITIAL_FLASHCARDS);

  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Year group & Enrolled subjects state
  const [yearGroup, setYearGroup] = useState<'Y7-Y9' | 'Y10-Y13'>('Y10-Y13');
  const [chosenSubjectIds, setChosenSubjectIds] = useState<string[]>([
    '0580', // Math
    '0610', // Biology
    '0620', // Chemistry
    '0625', // Physics
    '0478', // Computer Science
  ]);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Modals & Drawers state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState<boolean>(false);
  const [detailSubject, setDetailSubject] = useState<Subject | null>(null);

  // Active targeted subject for deep tools (solver, module, chat)
  const [activeSubject, setActiveSubject] = useState<Subject>(
    SUBJECTS.find((s) => s.code === '0580') || SUBJECTS[0]
  );
  const [solverQuestion, setSolverQuestion] = useState<string>('');
  // Text handed from class materials to the Turbo study-pack generator
  const [turboSeed, setTurboSeed] = useState<{ text: string; title: string; subject: string } | null>(null);
  // Which flashcard filter to open with (e.g. after importing a YouTube pack)
  const [flashcardsFilter, setFlashcardsFilter] = useState<string | null>(null);

  // Gamification state: streak, XP, PRO status, badges
  const [streak, setStreak] = useState<number>(3);
  const [points, setPoints] = useState<number>(375);
  const [isProUnlocked, setIsProUnlocked] = useState<boolean>(false);

  const [badges, setBadges] = useState<Badge[]>([
    { id: '1', name: 'First Step', description: 'Began Cambridge study journey', icon: '🌱', unlocked: true, unlockedAt: 'Oct 28', category: 'Streaks' },
    { id: '2', name: 'High Thinker', description: 'Solved a Cambridge past paper question with Gemini 4 Argon', icon: '🧠', unlocked: true, unlockedAt: 'Oct 29', category: 'Mastery' },
    { id: '3', name: 'Socratic Scholar', description: 'Completed active Socratic tutoring discussion', icon: '💬', unlocked: true, unlockedAt: 'Oct 30', category: 'Dedication' },
    { id: '4', name: 'Active Recall Ace', description: 'Reviewed 20+ SuperMemo-2 flashcards', icon: '🃏', unlocked: false, category: 'Mastery' },
    { id: '5', name: 'Cambridge Polymath', description: 'Enrolled in 5 or more Cambridge IGCSE subjects', icon: '🎓', unlocked: true, unlockedAt: 'Oct 30', category: 'Curriculum' },
    { id: '6', name: 'Study Buddy PRO', description: 'Earned 500 Academic XP to unlock PRO for free', icon: '👑', unlocked: false, category: 'Dedication' },
  ]);

  // Search in hero
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState('All');

  // Award XP. (Side effects must not live inside a state updater: React may run
  // updaters twice, which used to fire the PRO confetti twice and read a stale flag.)
  const handleAddPoints = (amount: number, _reason: string) => {
    setPoints((prev) => prev + amount);
  };

  const handleUnlockPro = () => {
    setIsProUnlocked(true);
    setBadges((prev) =>
      prev.map((b) => (b.id === '6' ? { ...b, unlocked: true, unlockedAt: 'Just now' } : b))
    );
  };

  // Auto-unlock PRO once 500 XP is reached (also unlocks the PRO badge)
  useEffect(() => {
    if (points >= 500 && !isProUnlocked) {
      handleUnlockPro();
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#F59E0B', '#10B981', '#00A896', '#3B82F6'],
      });
    }
  }, [points, isProUnlocked]);

  const chosenSubjects = SUBJECTS.filter((s) => chosenSubjectIds.includes(s.id));

  const toggleSubjectEnrollment = (id: string) => {
    if (chosenSubjectIds.includes(id)) {
      setChosenSubjectIds(chosenSubjectIds.filter((x) => x !== id));
    } else {
      setChosenSubjectIds([...chosenSubjectIds, id]);
      handleAddPoints(15, 'Enrolled in new subject');
    }
  };

  // Quick action handlers from dashboard
  const handleLaunchThinking = (subject: Subject, question?: string) => {
    setActiveSubject(subject);
    if (question) setSolverQuestion(question);
    setActiveTab('thinking');
  };

  const handleLaunchTTS = (subject: Subject) => {
    setActiveSubject(subject);
    setActiveTab('module');
  };

  const handleLaunchFlashcards = (subject: Subject) => {
    setActiveSubject(subject);
    setActiveTab('flashcards');
  };

  const handleLaunchChat = (subject: Subject) => {
    setActiveSubject(subject);
    setActiveTab('chat');
  };

  const handleLaunchSearch = (subject: Subject) => {
    setActiveSubject(subject);
    setActiveTab('search');
  };

  const handleLaunchModule = (subject: Subject) => {
    setActiveSubject(subject);
    setActiveTab('module');
  };

  // If visitor is on the Landing Page
  if (viewMode === 'landing') {
    return (
      <>
        <LandingPage
          onGetStarted={() => setIsAuthModalOpen(true)}
          onContinueWithGoogle={() => setIsAuthModalOpen(true)}
          onPreviewAsGuest={() => setViewMode('workspace')}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccessLogin={(loggedInUser) => {
            setUser(loggedInUser);
            try {
              localStorage.setItem('studybuddy_user', JSON.stringify(loggedInUser));
            } catch {}
            setViewMode('workspace');
            setIsAuthModalOpen(false);
            handleAddPoints(50, 'Signed in with Google');
          }}
          darkMode={darkMode}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-teal-500/25 transition-colors duration-300 flex flex-col">
      {/* Top Banner if PRO is earned */}
      {isProUnlocked && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-bold text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2">
          <Crown className="w-4 h-4 fill-slate-950" />
          <span>Study Buddy PRO Member — Unlimited High Thinking & Cambridge Audio Coaching</span>
        </div>
      )}

      {/* Primary Navigation */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        streak={streak}
        openPomodoro={() => setIsPomodoroOpen(true)}
        user={user}
        onViewLanding={() => setViewMode('landing')}
        onSignOut={() => {
          setUser(null);
          try {
            localStorage.removeItem('studybuddy_user');
          } catch {}
          setViewMode('landing');
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Sub-Header Tabs Row (Goodness Minimalist Navigation) */}
      <div className="border-b goodness-border goodness-glass sticky top-18 z-30 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 sm:gap-2 h-14">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Sparkles },
            { id: 'turbo', label: 'YouTube to Notes (Turbo AI)', icon: Youtube },
            { id: 'planner', label: 'Study Planner', icon: Calendar },
            { id: 'module', label: 'Learning Modules', icon: BookOpen },
            { id: 'thinking', label: 'High Thinking', icon: Brain },
            { id: 'chat', label: 'AI Tutor', icon: MessageSquare },
            { id: 'flashcards', label: 'Flashcards', icon: Sparkles },
            { id: 'catalog', label: 'Curriculum (80+)', icon: Layers },
            { id: 'search', label: 'Syllabus Grounding', icon: Compass },
            { id: 'maps', label: 'Study Spaces', icon: MapPin },
            { id: 'rewards', label: 'Gamification & PRO', icon: Trophy },
            { id: 'classes', label: 'Classes & Teachers', icon: GraduationCap },
            { id: 'workspace', label: 'Workspace Export', icon: Share2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Hero is shown on dashboard or catalog view */}
        {activeTab === 'dashboard' && (
          <Hero
            darkMode={darkMode}
            searchQuery={searchQuery}
            setSearchQuery={(q) => {
              setSearchQuery(q);
              if (q) setActiveTab('catalog');
            }}
            selectedStage={selectedStageFilter}
            setSelectedStage={(s) => {
              setSelectedStageFilter(s);
              if (s !== 'All') setActiveTab('catalog');
            }}
            onSelectFeature={(tab) => setActiveTab(tab)}
            totalSubjectsCount={SUBJECTS.length}
          />
        )}

        {/* Tab 1: Personalized Dashboard */}
        {activeTab === 'dashboard' && (
          <PersonalizedDashboard
            yearGroup={yearGroup}
            chosenSubjects={chosenSubjects}
            onOpenCustomizer={() => setIsOnboardingOpen(true)}
            onLaunchThinking={handleLaunchThinking}
            onLaunchTTS={handleLaunchTTS}
            onLaunchFlashcards={handleLaunchFlashcards}
            onLaunchChat={handleLaunchChat}
            onLaunchSearch={handleLaunchSearch}
            onViewSubjectDetail={(s) => setDetailSubject(s)}
            onOpenWorkspace={(s) => {
              setActiveSubject(s);
              setActiveTab('workspace');
            }}
            onLaunchTurboVideo={() => setActiveTab('turbo')}
            streak={streak}
          />
        )}

        {/* Tab: Turbo Video to Notes & Flashcards (Turbo.ai style) */}
        {activeTab === 'turbo' && (
          <TurboVideoToNotes
            onAddFlashcardsToMainDeck={(newCards) => {
              setAllFlashcards((prev) => [...newCards, ...prev]);
              setFlashcardsFilter('yt-import');
              setActiveTab('flashcards');
            }}
            onAddPoints={handleAddPoints}
            seed={turboSeed}
            darkMode={darkMode}
          />
        )}

        {/* Tab 2: Study Planner */}
        {activeTab === 'planner' && (
          <StudyPlanner
            chosenSubjects={chosenSubjects}
            allSubjects={SUBJECTS}
            onStartSession={(sub, topic) => {
              setActiveSubject(sub);
              setActiveTab('module');
            }}
            onOpenTimer={() => setIsPomodoroOpen(true)}
            darkMode={darkMode}
          />
        )}

        {/* Tab 3: Interactive Learning Modules */}
        {activeTab === 'module' && (
          <InteractiveLearningModule
            subject={activeSubject}
            onSolveWithThinking={(q, m) => {
              setSolverQuestion(q);
              setActiveTab('thinking');
            }}
            onListenTTS={(text) => {
              fetch('/api/gemini/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text.replace(/[*#_`]/g, '').slice(0, 800) }),
              })
                .then((r) => r.json())
                .then((d) => {
                  if (d.audioBase64) return playWavBase64(d.audioBase64);
                  throw new Error(d.error || 'No audio returned');
                })
                .catch((e) => alert(`Read-aloud is unavailable right now: ${e.message}`));
            }}
            darkMode={darkMode}
          />
        )}

        {/* Tab 4: High Thinking Solver */}
        {activeTab === 'thinking' && (
          <ThinkingSolver
            initialSubject={activeSubject}
            initialQuestion={solverQuestion}
            allSubjects={SUBJECTS}
            darkMode={darkMode}
          />
        )}

        {/* Tab 5: Study Chatbot */}
        {activeTab === 'chat' && (
          <StudyChatbot
            currentSubject={activeSubject}
            allSubjects={SUBJECTS}
            onAddPoints={handleAddPoints}
            darkMode={darkMode}
          />
        )}

        {/* Tab 6: Flashcards Deck */}
        {activeTab === 'flashcards' && (
          <FlashcardsDeck
            currentSubject={activeSubject}
            allSubjects={SUBJECTS}
            onAddPoints={handleAddPoints}
            cards={allFlashcards}
            onUpdateCards={setAllFlashcards}
            initialFilter={flashcardsFilter}
            onConsumeInitialFilter={() => setFlashcardsFilter(null)}
            darkMode={darkMode}
          />
        )}

        {/* Tab 7: Subject Catalog (80+ Cambridge subjects) */}
        {activeTab === 'catalog' && (
          <SubjectCatalog
            allSubjects={SUBJECTS}
            chosenSubjectIds={chosenSubjectIds}
            onToggleSubject={toggleSubjectEnrollment}
            onViewSubjectDetail={(s) => setDetailSubject(s)}
            onLaunchThinking={handleLaunchThinking}
            onLaunchTTS={handleLaunchTTS}
            darkMode={darkMode}
          />
        )}

        {/* Tab 8: Syllabus Search Grounding */}
        {activeTab === 'search' && (
          <SearchGroundingView
            currentSubject={activeSubject}
            allSubjects={SUBJECTS}
            darkMode={darkMode}
          />
        )}

        {/* Tab 9: Google Maps Grounding */}
        {activeTab === 'maps' && (
          <MapsGroundingView darkMode={darkMode} />
        )}

        {/* Tab 10: Video Analyzer */}
        {activeTab === 'video' && (
          <VideoAnalyzer darkMode={darkMode} />
        )}

        {/* Tab 11: Gamification & Rewards */}
        {activeTab === 'rewards' && (
          <GamificationHub
            points={points}
            onAddPoints={handleAddPoints}
            isProUnlocked={isProUnlocked}
            onUnlockPro={handleUnlockPro}
            badges={badges}
            darkMode={darkMode}
          />
        )}

        {/* Classes: students join by code, teachers upload material */}
        {activeTab === 'classes' && (
          <ClassesHub
            onMakeStudyPack={(text, title, subject) => {
              setTurboSeed({ text, title, subject });
              setActiveTab('turbo');
            }}
            onAddPoints={handleAddPoints}
            darkMode={darkMode}
          />
        )}

        {/* Tab 12: Workspace Tools */}
        {activeTab === 'workspace' && (
          <WorkspaceTools
            currentSubject={activeSubject}
            chosenSubjects={chosenSubjects}
            streak={streak}
            points={points}
            darkMode={darkMode}
          />
        )}
      </main>

      {/* Modals */}
      <StudentOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        currentYearGroup={yearGroup}
        currentSelectedSubjectIds={chosenSubjectIds}
        onSaveDashboard={(group, ids) => {
          setYearGroup(group);
          setChosenSubjectIds(ids);
          setActiveTab('dashboard');
          handleAddPoints(30, 'Customized personal study dashboard');
        }}
        darkMode={darkMode}
      />

      <SubjectDetailModal
        subject={detailSubject}
        onClose={() => setDetailSubject(null)}
        isEnrolled={detailSubject ? chosenSubjectIds.includes(detailSubject.id) : false}
        onToggleEnroll={toggleSubjectEnrollment}
        onLaunchThinking={handleLaunchThinking}
        onLaunchTTS={handleLaunchTTS}
        onLaunchModule={handleLaunchModule}
        darkMode={darkMode}
      />

      <PomodoroTimer
        isOpen={isPomodoroOpen}
        onClose={() => setIsPomodoroOpen(false)}
        onSessionComplete={(mins) => {
          handleAddPoints(40, `Finished ${mins}m focus session`);
        }}
        darkMode={darkMode}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessLogin={(loggedInUser) => {
          setUser(loggedInUser);
          try {
            localStorage.setItem('studybuddy_user', JSON.stringify(loggedInUser));
          } catch {}
          setIsAuthModalOpen(false);
          handleAddPoints(50, 'Signed in with Google');
        }}
        darkMode={darkMode}
      />

      {/* Footer featuring official Study Buddy logo */}
      <footer className="border-t goodness-border bg-white/60 dark:bg-slate-900/60 mt-16 py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <StudyBuddyLogo className="h-9 sm:h-10" darkMode={darkMode} />
            <div className="border-l border-slate-200 dark:border-slate-800 pl-3">
              <span className="text-xs font-serif italic text-slate-500 dark:text-slate-400 block">
                Taking learning to another step.
              </span>
              <span className="text-[10px] text-slate-400">
                Cambridge IGCSE & Key Stage 3 Academic Intelligence
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            <button onClick={() => setIsOnboardingOpen(true)} className="hover:text-teal-600 transition-colors">
              Customize Subjects
            </button>
            <button onClick={() => setActiveTab('planner')} className="hover:text-teal-600 transition-colors">
              Study Planner
            </button>
            <button onClick={() => setActiveTab('thinking')} className="hover:text-teal-600 transition-colors">
              High Thinking
            </button>
            <button onClick={() => setActiveTab('rewards')} className="hover:text-teal-600 transition-colors">
              PRO Quest
            </button>
            <button onClick={() => setIsPomodoroOpen(true)} className="hover:text-teal-600 transition-colors">
              Pomodoro
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
