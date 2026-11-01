import { Subject } from '../data/subjects';

export interface SpacedCardReview {
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
}

/**
 * Filters subjects based on stage, category, and text search across name, code, topics.
 */
export function searchAndFilterSubjects(
  subjects: Subject[],
  query: string,
  category: string = 'All',
  stage: string = 'All'
): Subject[] {
  const normalizedQuery = query.trim().toLowerCase();

  return subjects.filter((subject) => {
    // Stage check
    if (stage !== 'All' && subject.stage !== stage) {
      return false;
    }

    // Category check
    if (category !== 'All' && subject.category !== category) {
      return false;
    }

    // Search query check
    if (!normalizedQuery) {
      return true;
    }

    const matchesName = subject.name.toLowerCase().includes(normalizedQuery);
    const matchesCode = subject.code ? subject.code.toLowerCase().includes(normalizedQuery) : false;
    const matchesTopics = subject.topics.some((topic) =>
      topic.toLowerCase().includes(normalizedQuery)
    );

    return matchesName || matchesCode || matchesTopics;
  });
}

/**
 * Calculates current consecutive study day streak based on ISO date strings.
 */
export function calculateStudyStreak(dateStrings: string[], today = new Date()): number {
  if (!dateStrings || dateStrings.length === 0) return 0;

  const uniqueDays = Array.from(
    new Set(
      dateStrings.map((d) => {
        const date = new Date(d);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
          date.getDate()
        ).padStart(2, '0')}`;
      })
    )
  ).sort().reverse();

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate()
  ).padStart(2, '0')}`;

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(
    yesterday.getDate()
  ).padStart(2, '0')}`;

  let startIndex = 0;
  if (uniqueDays[0] === todayStr) {
    startIndex = 0;
  } else if (uniqueDays[0] === yesterdayStr) {
    startIndex = 0;
  } else {
    return 0; // Streak broken
  }

  let streak = 0;
  let expectedDate = new Date(uniqueDays[startIndex]);

  for (let i = startIndex; i < uniqueDays.length; i++) {
    const expectedStr = `${expectedDate.getFullYear()}-${String(expectedDate.getMonth() + 1).padStart(2, '0')}-${String(
      expectedDate.getDate()
    ).padStart(2, '0')}`;

    if (uniqueDays[i] === expectedStr) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Computes Cambridge IGCSE grade estimate (A* to U or 9 to 1) based on raw percentage.
 */
export function computeGradeEstimate(percentage: number): {
  letterGrade: 'A*' | 'A' | 'B' | 'C' | 'D' | 'E' | 'U';
  numberGrade: number;
  descriptor: string;
} {
  const score = Math.max(0, Math.min(100, Math.round(percentage)));

  if (score >= 90) return { letterGrade: 'A*', numberGrade: 9, descriptor: 'Outstanding Distinction' };
  if (score >= 80) return { letterGrade: 'A', numberGrade: 8, descriptor: 'Excellent Mastery' };
  if (score >= 70) return { letterGrade: 'B', numberGrade: 7, descriptor: 'Strong Merit' };
  if (score >= 60) return { letterGrade: 'C', numberGrade: 6, descriptor: 'Proficient Pass' };
  if (score >= 50) return { letterGrade: 'D', numberGrade: 4, descriptor: 'Developing Foundation' };
  if (score >= 40) return { letterGrade: 'E', numberGrade: 3, descriptor: 'Needs Consolidation' };
  return { letterGrade: 'U', numberGrade: 1, descriptor: 'Unclassified' };
}

/**
 * Formats a syllabus title with code badge.
 */
export function formatSyllabusCode(code?: string, name: string = ''): string {
  if (!code) return name;
  return `${name} (${code})`;
}

/**
 * Anki/SuperMemo-2 spaced repetition calculation.
 * Quality: 0 = complete blackout, 3 = pass with effort, 5 = perfect recall.
 */
export function calculateSM2(
  current: SpacedCardReview,
  quality: number
): SpacedCardReview {
  const q = Math.max(0, Math.min(5, quality));

  let nextInterval: number;
  let nextReps: number;
  let nextEase = current.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (nextEase < 1.3) nextEase = 1.3;

  if (q < 3) {
    nextReps = 0;
    nextInterval = 1;
  } else {
    if (current.repetitions === 0) {
      nextInterval = 1;
    } else if (current.repetitions === 1) {
      nextInterval = 6;
    } else {
      nextInterval = Math.round(current.intervalDays * nextEase);
    }
    nextReps = current.repetitions + 1;
  }

  return {
    intervalDays: nextInterval,
    easeFactor: Number(nextEase.toFixed(2)),
    repetitions: nextReps,
  };
}

/**
 * Extracts standard 11-char YouTube video ID from various YouTube URL formats.
 */
export function extractYoutubeVideoId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/**
 * Produces a safe embed URL for an 11-char YouTube video ID.
 */
export function formatYoutubeEmbedUrl(videoId: string | null): string | null {
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
}

