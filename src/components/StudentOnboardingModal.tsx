import React, { useState } from 'react';
import { Check, Sparkles, BookOpen, GraduationCap, X, Search, CheckCircle2 } from 'lucide-react';
import { SUBJECTS, Subject } from '../data/subjects';
import confetti from 'canvas-confetti';

interface StudentOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveDashboard: (yearGroup: 'Y7-Y9' | 'Y10-Y13', selectedSubjectIds: string[]) => void;
  currentYearGroup?: 'Y7-Y9' | 'Y10-Y13';
  currentSelectedSubjectIds?: string[];
  darkMode?: boolean;
}

export const StudentOnboardingModal: React.FC<StudentOnboardingModalProps> = ({
  isOpen,
  onClose,
  onSaveDashboard,
  currentYearGroup = 'Y10-Y13',
  currentSelectedSubjectIds = ['0580', '0610', '0620', '0625', '0478'],
  darkMode = false,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [yearGroup, setYearGroup] = useState<'Y7-Y9' | 'Y10-Y13'>(currentYearGroup);
  const [selectedIds, setSelectedIds] = useState<string[]>(currentSelectedSubjectIds);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Re-sync with the app's current choices each time the modal opens (they can change
  // elsewhere, e.g. enrolling from the catalog, and the modal used to show stale picks).
  React.useEffect(() => {
    if (isOpen) {
      setStep(1);
      setYearGroup(currentYearGroup);
      setSelectedIds(currentSelectedSubjectIds);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Available subjects for the chosen year group
  const availableSubjects = SUBJECTS.filter((s) => s.stage === yearGroup);

  const filteredSubjects = availableSubjects.filter((s) => {
    if (categoryFilter !== 'All' && s.category !== categoryFilter) return false;
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      (s.code && s.code.toLowerCase().includes(q)) ||
      s.topics.some((t) => t.toLowerCase().includes(q))
    );
  });

  const toggleSubject = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (yearGroup === 'Y7-Y9') {
      setSelectedIds(availableSubjects.map((s) => s.id));
    } else {
      // Pick top popular Cambridge IGCSE subjects
      const popularIds = availableSubjects.filter((s) => s.popular).map((s) => s.id);
      setSelectedIds(popularIds);
    }
  };

  const handleQuickPreset = (presetName: string) => {
    if (presetName === 'Sciences') {
      setSelectedIds(['0580', '0610', '0620', '0625', '0478']);
    } else if (presetName === 'Business') {
      setSelectedIds(['0580', '0450', '0455', '0452', '0500']);
    } else if (presetName === 'Humanities') {
      setSelectedIds(['0500', '0460', '0470', '0495', '0580']);
    }
  };

  const handleFinish = () => {
    if (selectedIds.length === 0) return;
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00A896', '#0B2545', '#3B82F6', '#10B981'],
    });
    onSaveDashboard(yearGroup, selectedIds);
    onClose();
  };

  const categories = ['All', 'Sciences', 'Mathematics & Computing', 'Languages & Literature', 'Humanities & Social Sciences', 'Business & Economics', 'Creative & Vocational'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200/50 dark:border-teal-800/40 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Customize Your Study Buddy
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-serif italic">
                Step {step} of 2 — {step === 1 ? 'Select Your Academic Level' : 'Select Your Core Subjects'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="text-center max-w-md mx-auto mb-8">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Which curriculum are you studying?
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  We will calibrate your personal dashboard, exam questions, and Socratic tutoring models accordingly.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option 1: Y7 - Y9 */}
                <div
                  onClick={() => {
                    setYearGroup('Y7-Y9');
                    // Reset to Y7-Y9 default subjects
                    setSelectedIds(['y7-math', 'y7-eng', 'y7-sci']);
                  }}
                  className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-200 text-left relative ${
                    yearGroup === 'Y7-Y9'
                      ? 'border-teal-500 bg-teal-50/40 dark:bg-teal-950/20 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  {yearGroup === 'Y7-Y9' && (
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    Year 7 – Year 9
                  </h4>
                  <p className="text-xs font-medium text-teal-600 dark:text-teal-400 mb-2">
                    Key Stage 3 / Lower Secondary
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Foundational curriculum focusing on core <strong>Mathematics, English, and Science</strong>. Build mastery in algebra, scientific inquiry, and language analysis.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">Math</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">English</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">Science</span>
                  </div>
                </div>

                {/* Option 2: Y10 - Y13 */}
                <div
                  onClick={() => {
                    setYearGroup('Y10-Y13');
                    if (!selectedIds.some((id) => !id.startsWith('y7'))) {
                      setSelectedIds(['0580', '0610', '0620', '0625', '0478']);
                    }
                  }}
                  className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-200 text-left relative ${
                    yearGroup === 'Y10-Y13'
                      ? 'border-teal-500 bg-teal-50/40 dark:bg-teal-950/20 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  {yearGroup === 'Y10-Y13' && (
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    Year 10 – Year 13
                  </h4>
                  <p className="text-xs font-medium text-teal-600 dark:text-teal-400 mb-2">
                    Cambridge IGCSE & Upper Secondary
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Full catalog of 80+ Cambridge IGCSE subjects (0580, 0620, 0610, 0625, 0478, 0450, etc.). Rigorous mark scheme training, past paper drills, and high-thinking steps.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-mono font-medium">0580 Math</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-mono font-medium">0625 Physics</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-mono font-medium">0478 CompSci</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Select your subjects ({selectedIds.length} chosen)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {yearGroup === 'Y7-Y9'
                      ? 'Key Stage 3 core subjects'
                      : 'Choose your Cambridge IGCSE subjects from the official syllabus'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSelectAll}
                    className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {yearGroup === 'Y7-Y9' ? 'Select All 3' : 'Select Top 5 Core'}
                  </button>
                  {yearGroup === 'Y10-Y13' && (
                    <div className="hidden sm:flex items-center gap-1.5">
                      <button
                        onClick={() => handleQuickPreset('Sciences')}
                        className="text-xs px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-teal-600"
                      >
                        STEM
                      </button>
                      <button
                        onClick={() => handleQuickPreset('Business')}
                        className="text-xs px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-teal-600"
                      >
                        Business
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Filters for Y10-Y13 */}
              {yearGroup === 'Y10-Y13' && (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      placeholder="Search Cambridge subject name or 4-digit code (e.g. 0580, 0620, 0450)..."
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`shrink-0 px-2.5 py-1 rounded-lg font-medium transition-colors ${
                          categoryFilter === cat
                            ? 'bg-teal-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Subjects Checklist Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
                {filteredSubjects.map((subject) => {
                  const isChecked = selectedIds.includes(subject.id);
                  return (
                    <div
                      key={subject.id}
                      onClick={() => toggleSubject(subject.id)}
                      className={`cursor-pointer p-3.5 rounded-xl border flex items-start gap-3 transition-all duration-150 ${
                        isChecked
                          ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30'
                          : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center shrink-0 border transition-colors ${
                          isChecked
                            ? 'bg-teal-600 border-teal-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {subject.name}
                          </span>
                          {subject.code && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold shrink-0">
                              {subject.code}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {subject.category} • {subject.topics.length} topics
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          {step === 1 ? (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Selected: <strong className="text-slate-900 dark:text-white">{yearGroup}</strong>
            </div>
          ) : (
            <button
              onClick={() => setStep(1)}
              className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              ← Back to Year Groups
            </button>
          )}

          <div className="flex items-center gap-3">
            {step === 1 ? (
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs sm:text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm"
              >
                Next: Select Subjects →
              </button>
            ) : (
              <button
                disabled={selectedIds.length === 0}
                onClick={handleFinish}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-xs sm:text-sm font-semibold hover:opacity-95 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate My Dashboard ({selectedIds.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
