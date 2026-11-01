import React, { useState, useMemo } from 'react';
import { Subject } from '../data/subjects';
import {
  Calendar,
  Clock,
  Target,
  Sparkles,
  CheckCircle2,
  Play,
  RotateCcw,
  Sliders,
  ChevronRight,
  TrendingUp,
  Award,
  BookOpen,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudyPlannerProps {
  chosenSubjects: Subject[];
  allSubjects: Subject[];
  onStartSession: (subject: Subject, topic: string) => void;
  onOpenTimer: () => void;
  darkMode?: boolean;
}

interface SubjectGoal {
  subjectId: string;
  targetGrade: 'A*' | 'A' | 'B' | 'C';
  confidence: 'Needs Focus' | 'Moderate' | 'Confident';
  weeklyHours: number;
}

export const StudyPlanner: React.FC<StudyPlannerProps> = ({
  chosenSubjects,
  allSubjects,
  onStartSession,
  onOpenTimer,
  darkMode,
}) => {
  // Config state
  const [dailyHoursGoal, setDailyHoursGoal] = useState<number>(3.5);
  const [studyDaysPerWeek, setStudyDaysPerWeek] = useState<number>(5);
  const [examSession, setExamSession] = useState<'May/June' | 'Oct/Nov' | 'Term Mocks'>('May/June');
  const [completedSessions, setCompletedSessions] = useState<string[]>([]);

  // Subject specific goals
  const [subjectGoals, setSubjectGoals] = useState<Record<string, SubjectGoal>>(() => {
    const initial: Record<string, SubjectGoal> = {};
    chosenSubjects.forEach((s) => {
      initial[s.id] = {
        subjectId: s.id,
        targetGrade: 'A*',
        confidence: s.category === 'Sciences' || s.category === 'Mathematics & Computing' ? 'Needs Focus' : 'Moderate',
        weeklyHours: 3.5,
      };
    });
    return initial;
  });

  const totalWeeklyHoursBudget = dailyHoursGoal * studyDaysPerWeek;

  // Calculate intelligent recommended time distribution
  const recommendations = useMemo(() => {
    let totalWeight = 0;
    const weights: Record<string, number> = {};

    chosenSubjects.forEach((s) => {
      const goal = subjectGoals[s.id] || {
        confidence: 'Moderate',
        targetGrade: 'A*',
      };
      // Weighting formula: Needs Focus gets 1.5x, Moderate gets 1.0x, Confident gets 0.7x
      const confWeight = goal.confidence === 'Needs Focus' ? 1.6 : goal.confidence === 'Moderate' ? 1.0 : 0.7;
      const gradeWeight = goal.targetGrade === 'A*' ? 1.3 : goal.targetGrade === 'A' ? 1.1 : 0.9;
      const w = confWeight * gradeWeight;
      weights[s.id] = w;
      totalWeight += w;
    });

    const hoursPerSubject: Record<string, number> = {};
    chosenSubjects.forEach((s) => {
      const frac = totalWeight > 0 ? (weights[s.id] || 1) / totalWeight : 1 / chosenSubjects.length;
      hoursPerSubject[s.id] = Math.round(frac * totalWeeklyHoursBudget * 2) / 2; // round to nearest 0.5h
    });

    return hoursPerSubject;
  }, [chosenSubjects, subjectGoals, totalWeeklyHoursBudget]);

  // Generate 7-day schedule with topic allocation
  const weeklySchedule = useMemo(() => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const activeDays = days.slice(0, studyDaysPerWeek);

    const schedule: { day: string; blocks: { id: string; subject: Subject; topic: string; durationMin: number; style: string }[] }[] = [];

    let subjectIdx = 0;
    activeDays.forEach((day, dIdx) => {
      const blocks = [];
      const slotsCount = dailyHoursGoal >= 4 ? 3 : dailyHoursGoal >= 2.5 ? 2 : 1;

      for (let i = 0; i < slotsCount; i++) {
        if (chosenSubjects.length === 0) break;
        const sub = chosenSubjects[(subjectIdx + i) % chosenSubjects.length];
        const topicIdx = (dIdx + i) % (sub.topics.length || 1);
        const topicName = sub.topics[topicIdx] || 'Syllabus Review & Past Papers';
        const duration = Math.round((dailyHoursGoal * 60) / slotsCount);

        const style = i % 2 === 0 ? 'Deep Concept Working' : 'Active Recall & Past Paper Drill';

        blocks.push({
          id: `${day}-${sub.id}-${i}`,
          subject: sub,
          topic: topicName,
          durationMin: duration,
          style,
        });
      }
      subjectIdx = (subjectIdx + 1) % chosenSubjects.length;
      schedule.push({ day, blocks });
    });

    return schedule;
  }, [chosenSubjects, dailyHoursGoal, studyDaysPerWeek]);

  const toggleSessionComplete = (id: string) => {
    if (completedSessions.includes(id)) {
      setCompletedSessions(completedSessions.filter((x) => x !== id));
    } else {
      setCompletedSessions([...completedSessions, id]);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#00A896', '#3B82F6', '#10B981'],
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b goodness-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/40 text-teal-700 dark:text-teal-300 text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Intelligent Study Planner & Timetable</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Personalized Study Planner
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-serif italic mt-1">
            Balancing exam weights, cognitive fatigue, and spaced topic allocation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenTimer}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 text-xs sm:text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm"
          >
            <Clock className="w-4 h-4 text-teal-400 dark:text-teal-600" />
            <span>Launch Pomodoro</span>
          </button>
        </div>
      </div>

      {/* Target Configuration Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>Study Goals & Target Exam Window</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Daily Study Budget */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">
              Daily Target Hours: <strong className="text-slate-900 dark:text-white">{dailyHoursGoal} hrs/day</strong>
            </label>
            <input
              type="range"
              min="1"
              max="6"
              step="0.5"
              value={dailyHoursGoal}
              onChange={(e) => setDailyHoursGoal(parseFloat(e.target.value))}
              className="w-full accent-teal-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>1 hr (Light)</span>
              <span>3.5 hrs (Optimal)</span>
              <span>6 hrs (Sprint)</span>
            </div>
          </div>

          {/* Days Per Week */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">
              Study Days Per Week: <strong className="text-slate-900 dark:text-white">{studyDaysPerWeek} days</strong>
            </label>
            <div className="flex gap-1.5">
              {[4, 5, 6, 7].map((num) => (
                <button
                  key={num}
                  onClick={() => setStudyDaysPerWeek(num)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    studyDaysPerWeek === num
                      ? 'bg-teal-600 text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {num}d
                </button>
              ))}
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">
              Total: {totalWeeklyHoursBudget} hrs/week
            </span>
          </div>

          {/* Exam Session Target */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">
              Target Cambridge Session:
            </label>
            <select
              value={examSession}
              onChange={(e) => setExamSession(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="May/June">May / June Series (Main)</option>
              <option value="Oct/Nov">October / November Series</option>
              <option value="Term Mocks">Term Mock Examination</option>
            </select>
            <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium block mt-1">
              Exam countdown: ~42 days to syllabus peak
            </span>
          </div>
        </div>
      </div>

      {/* Recommended Weekly Hours Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Recommended Subject Allocation (Based on Your Goals)</span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Weighted by target grade & confidence
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {chosenSubjects.map((sub) => {
            const goal = subjectGoals[sub.id] || { targetGrade: 'A*', confidence: 'Moderate' };
            const recommendedHours = recommendations[sub.id] || 2;
            const pct = Math.round((recommendedHours / totalWeeklyHoursBudget) * 100);

            return (
              <div
                key={sub.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {sub.name}
                    </span>
                    {sub.code && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                        {sub.code}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <select
                      value={goal.confidence}
                      onChange={(e) => {
                        setSubjectGoals({
                          ...subjectGoals,
                          [sub.id]: {
                            ...goal,
                            subjectId: sub.id,
                            confidence: e.target.value as any,
                            weeklyHours: recommendedHours,
                          },
                        });
                      }}
                      className="text-[11px] px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-none font-medium"
                    >
                      <option value="Needs Focus">Needs Focus (More time)</option>
                      <option value="Moderate">Moderate Confidence</option>
                      <option value="Confident">Confident (Maintain)</option>
                    </select>

                    <span className="text-[11px] font-bold px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                      Goal: {goal.targetGrade}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-500 dark:text-slate-400">Recommended:</span>
                    <strong className="text-teal-600 dark:text-teal-400 font-mono">
                      {recommendedHours} hrs/wk ({pct}%)
                    </strong>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, pct * 2)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Day by Day Timetable & Topic Allocation */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Weekly Topic Allocation Timetable</span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {completedSessions.length} sessions completed this week
          </span>
        </div>

        <div className="space-y-3">
          {weeklySchedule.map((dayItem) => (
            <div
              key={dayItem.day}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {dayItem.day}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {dayItem.blocks.reduce((acc, b) => acc + b.durationMin, 0)} minutes scheduled
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {dayItem.blocks.map((block) => {
                  const isDone = completedSessions.includes(block.id);
                  return (
                    <div
                      key={block.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isDone
                          ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                          : 'bg-teal-50/40 dark:bg-teal-950/20 border-teal-200/60 dark:border-teal-800/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300 block truncate">
                            {block.subject.name} {block.subject.code ? `(${block.subject.code})` : ''}
                          </span>
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block truncate">
                            {block.topic}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleSessionComplete(block.id)}
                          title={isDone ? 'Mark as incomplete' : 'Mark as done'}
                          className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                            isDone
                              ? 'bg-teal-600 border-teal-600 text-white'
                              : 'border-slate-300 dark:border-slate-600 text-transparent hover:border-teal-500'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-800/60">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {block.durationMin} min
                        </span>
                        <button
                          onClick={() => onStartSession(block.subject, block.topic)}
                          className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-semibold hover:underline"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Start Study</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
