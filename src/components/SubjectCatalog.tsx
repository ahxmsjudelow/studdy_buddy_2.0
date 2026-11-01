import React, { useState } from 'react';
import { Subject } from '../data/subjects';
import {
  Search,
  BookOpen,
  ArrowRight,
  Sparkles,
  Brain,
  Headphones,
  Check,
  ChevronRight,
} from 'lucide-react';
import { searchAndFilterSubjects } from '../utils/studyUtils';

interface SubjectCatalogProps {
  allSubjects: Subject[];
  chosenSubjectIds: string[];
  onToggleSubject: (id: string) => void;
  onViewSubjectDetail: (subject: Subject) => void;
  onLaunchThinking: (subject: Subject) => void;
  onLaunchTTS: (subject: Subject) => void;
  darkMode?: boolean;
}

export const SubjectCatalog: React.FC<SubjectCatalogProps> = ({
  allSubjects,
  chosenSubjectIds,
  onToggleSubject,
  onViewSubjectDetail,
  onLaunchThinking,
  onLaunchTTS,
  darkMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');

  const categories = [
    'All',
    'Sciences',
    'Mathematics & Computing',
    'Languages & Literature',
    'Humanities & Social Sciences',
    'Business & Economics',
    'Creative & Vocational',
  ];

  const filtered = searchAndFilterSubjects(
    allSubjects,
    searchQuery,
    selectedCategory,
    selectedStage
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search & Filter Header */}
      <div className="space-y-4 pb-6 border-b goodness-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Curriculum & Subjects Hub
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-serif italic mt-0.5">
              Explore 80+ Cambridge IGCSE & Lower Secondary syllabuses with past papers and topic outlines.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {['All', 'Y7-Y9', 'Y10-Y13'].map((stage) => (
              <button
                key={stage}
                onClick={() => setSelectedStage(stage)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  selectedStage === stage
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {stage === 'All' ? 'All Stages' : stage}
              </button>
            ))}
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by subject name, code (e.g. 0580, 0620, 0450) or topic..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-xl font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white font-semibold'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Subjects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((subject) => {
          const isEnrolled = chosenSubjectIds.includes(subject.id);
          return (
            <div
              key={subject.id}
              className={`group p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                isEnrolled
                  ? 'bg-white dark:bg-slate-900/90 border-teal-500/80 dark:border-teal-600/60 shadow-xs'
                  : 'bg-white/80 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {subject.stage}
                    </span>
                    {subject.code && (
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
                        {subject.code}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onToggleSubject(subject.id)}
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-md transition-colors ${
                      isEnrolled
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-teal-50 hover:text-teal-600'
                    }`}
                  >
                    {isEnrolled ? '✓ Enrolled' : '+ Enroll'}
                  </button>
                </div>

                <h3
                  onClick={() => onViewSubjectDetail(subject)}
                  className="font-bold text-base text-slate-900 dark:text-white cursor-pointer hover:text-teal-600 transition-colors mb-1 truncate"
                >
                  {subject.name}
                </h3>
                <span className="text-xs text-slate-400 block mb-3">
                  {subject.category} • {subject.topics.length} Syllabus Modules
                </span>

                <div className="flex flex-wrap gap-1 mb-4">
                  {subject.topics.slice(0, 3).map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 truncate max-w-[200px]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Card Controls */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                <button
                  onClick={() => onViewSubjectDetail(subject)}
                  className="text-teal-600 dark:text-teal-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Open Syllabus</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onLaunchThinking(subject)}
                    title="Solve problem with High Thinking"
                    className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
                  >
                    <Brain className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onLaunchTTS(subject)}
                    title="Listen to audio overview"
                    className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 hover:bg-teal-100 transition-colors"
                  >
                    <Headphones className="w-3.5 h-3.5" />
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
