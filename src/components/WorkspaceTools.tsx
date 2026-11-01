import React, { useState } from 'react';
import { Subject } from '../data/subjects';
import {
  Calendar,
  CheckSquare,
  Presentation,
  Mail,
  Video,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WorkspaceToolsProps {
  currentSubject?: Subject;
  chosenSubjects: Subject[];
  streak: number;
  points: number;
  darkMode?: boolean;
}

export const WorkspaceTools: React.FC<WorkspaceToolsProps> = ({
  currentSubject,
  chosenSubjects,
  streak,
  points,
  darkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'slides' | 'gmail' | 'meet'>('tasks');
  const [copied, setCopied] = useState<string | null>(null);

  const subject = currentSubject || chosenSubjects[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.7 },
      colors: ['#00A896', '#3B82F6'],
    });
    setTimeout(() => setCopied(null), 2000);
  };

  const tasksList = subject
    ? subject.topics.map((t, i) => `[ ] Cambridge ${subject.name} (${subject.code || ''}): Complete active recall on "${t}"`)
    : ['[ ] Complete Cambridge revision questions'];

  const slidesOutline = subject
    ? `# Cambridge IGCSE Revision Deck: ${subject.name} (${subject.code || ''})
Slide 1: Title & Syllabus Overview
- Official Code: ${subject.code || 'Secondary'}
- Exam Papers & Weighting
- Key Command Words

Slide 2: Core Concept 1 - ${subject.topics[0] || 'Foundations'}
- Definitions and First Principles
- Mark Scheme Keywords
- Examiner Tip: Always state formulas first

Slide 3: Core Concept 2 - ${subject.topics[1] || 'Applied Analysis'}
- Methodical Working Steps
- Common Student Pitfalls
- Sample Past Paper Calculation

Slide 4: Summary & Past Paper Drill Checklist`
    : '';

  const gmailReport = `Subject: Study Buddy Cambridge Revision Report - ${subject?.name || 'All Subjects'}

Dear Mentor / Parent,

Here is my latest Study Buddy progress summary:
- Current Academic Streak: ${streak} days
- Academic XP: ${points} XP
- Active Syllabus Focus: ${subject?.name || 'Cambridge IGCSE'}
- Topics Reviewed: ${subject?.topics.slice(0, 3).join(', ')}

Taking learning to another step with Study Buddy.`;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-6 border-b goodness-border">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/40 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>Productivity & Google Workspace Export</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Study Schedule & Workspace Export
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-serif italic mt-1">
          Export your Cambridge syllabus topics to Google Tasks, generate slide outlines for Google Slides, or email revision summaries via Gmail.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center p-1.5 bg-slate-100/80 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 max-w-lg">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'tasks'
              ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Google Tasks</span>
        </button>

        <button
          onClick={() => setActiveTab('slides')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'slides'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Presentation className="w-3.5 h-3.5" />
          <span>Google Slides</span>
        </button>

        <button
          onClick={() => setActiveTab('gmail')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'gmail'
              ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Gmail Report</span>
        </button>

        <button
          onClick={() => setActiveTab('meet')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'meet'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Study Meet</span>
        </button>
      </div>

      {/* Tab 1: Tasks */}
      {activeTab === 'tasks' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b goodness-border">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Google Tasks Checklist: {subject?.name}
              </h4>
              <p className="text-xs text-slate-400">
                Ready to paste directly into Google Tasks or your todo app.
              </p>
            </div>
            <button
              onClick={() => handleCopy(tasksList.join('\n'), 'tasks')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 text-xs font-semibold"
            >
              {copied === 'tasks' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied === 'tasks' ? 'Copied Tasks!' : 'Copy Tasks'}</span>
            </button>
          </div>

          <div className="space-y-2">
            {tasksList.map((t, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center justify-between"
              >
                <span>{t}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <a
              href="https://tasks.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline"
            >
              <span>Open Google Tasks in browser</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Tab 2: Slides */}
      {activeTab === 'slides' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b goodness-border">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Google Slides Presentation Outline
              </h4>
              <p className="text-xs text-slate-400">
                Structure your revision presentation or group peer teaching deck.
              </p>
            </div>
            <button
              onClick={() => handleCopy(slidesOutline, 'slides')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 text-xs font-semibold"
            >
              {copied === 'slides' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied === 'slides' ? 'Copied Outline!' : 'Copy Outline'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
            {slidesOutline}
          </pre>

          <a
            href="https://slides.new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            <span>Create new Google Slide deck (slides.new)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Tab 3: Gmail Report */}
      {activeTab === 'gmail' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b goodness-border">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Email Study Summary via Gmail
              </h4>
              <p className="text-xs text-slate-400">
                Share your weekly streak and revision milestones.
              </p>
            </div>
            <button
              onClick={() => handleCopy(gmailReport, 'gmail')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 text-xs font-semibold"
            >
              {copied === 'gmail' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied === 'gmail' ? 'Copied Email!' : 'Copy Text'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-sans text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
            {gmailReport}
          </pre>

          <a
            href={`mailto:?subject=${encodeURIComponent('Study Buddy Cambridge Revision Report')}&body=${encodeURIComponent(gmailReport)}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-500 transition-colors shadow-sm"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Open in Mail Client</span>
          </a>
        </div>
      )}

      {/* Tab 4: Study Meet */}
      {activeTab === 'meet' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 animate-fade-in">
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Google Meet Group Revision Room
            </h4>
            <p className="text-xs text-slate-400">
              Host a silent co-working or group problem-solving room with classmates.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm space-y-2">
            <span className="font-bold block">Study Buddy Co-Working Agenda:</span>
            <ul className="space-y-1 list-disc list-inside">
              <li>00:00 - 00:25: Silent Cambridge Past Paper Drill (25m)</li>
              <li>00:25 - 00:30: Mark Scheme Cross-Check & Discussion (5m)</li>
              <li>00:30 - 00:55: Active Recall Quiz on {subject?.name || 'Syllabus'} (25m)</li>
            </ul>
          </div>

          <a
            href="https://meet.new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition-colors shadow-sm"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Launch Google Meet (meet.new)</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>
      )}
    </div>
  );
};
