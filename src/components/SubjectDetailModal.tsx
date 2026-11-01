import React from 'react';
import { Subject } from '../data/subjects';
import {
  X,
  BookOpen,
  Brain,
  Headphones,
  Sparkles,
  Award,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

interface SubjectDetailModalProps {
  subject: Subject | null;
  onClose: () => void;
  onLaunchThinking: (subject: Subject, question?: string) => void;
  onLaunchTTS: (subject: Subject) => void;
  onLaunchModule: (subject: Subject) => void;
  isEnrolled: boolean;
  onToggleEnroll: (id: string) => void;
  darkMode?: boolean;
}

export const SubjectDetailModal: React.FC<SubjectDetailModalProps> = ({
  subject,
  onClose,
  onLaunchThinking,
  onLaunchTTS,
  onLaunchModule,
  isEnrolled,
  onToggleEnroll,
  darkMode,
}) => {
  if (!subject) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[88vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 font-bold flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {subject.name}
                </h3>
                {subject.code && (
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
                    {subject.code}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-serif italic">
                {subject.stage} • {subject.category}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Key Topics List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Official Cambridge Syllabus Modules:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {subject.topics.map((t, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 text-xs font-medium text-slate-800 dark:text-slate-200 flex items-start gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Formulas if present */}
          {subject.keyFormulas && subject.keyFormulas.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block font-mono">
                Key Exam Formulas & Identities:
              </span>
              <ul className="text-xs font-mono text-teal-100 space-y-1">
                {subject.keyFormulas.map((f, i) => (
                  <li key={i}>• {f}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Sample Past Paper Questions */}
          {subject.sampleQuestions && subject.sampleQuestions.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Featured Past Paper Questions:
              </h4>
              {subject.sampleQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>Question {idx + 1} {q.year ? `(${q.year})` : ''}</span>
                    <span className="text-teal-600 dark:text-teal-400 font-mono font-bold">
                      {q.marks} Marks
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                    {q.question}
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-serif italic">
                      Difficulty: {q.difficulty}
                    </span>
                    <button
                      onClick={() => {
                        onClose();
                        onLaunchThinking(subject, q.question);
                      }}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <Brain className="w-3.5 h-3.5" />
                      <span>Solve with High Thinking</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onToggleEnroll(subject.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              isEnrolled
                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                : 'bg-teal-600 text-white hover:bg-teal-500'
            }`}
          >
            {isEnrolled ? 'Remove from My Subjects' : '+ Add to My Enrolled Subjects'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onLaunchTTS(subject);
              }}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Listen to overview"
            >
              <Headphones className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                onClose();
                onLaunchModule(subject);
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs sm:text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
            >
              Open Interactive Learning Module →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
