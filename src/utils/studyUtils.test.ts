import test from 'node:test';
import assert from 'node:assert/strict';
import {
  searchAndFilterSubjects,
  calculateStudyStreak,
  computeGradeEstimate,
  calculateSM2,
  extractYoutubeVideoId,
  formatYoutubeEmbedUrl,
} from './studyUtils';
import { SUBJECTS } from '../data/subjects';

test('searchAndFilterSubjects filters by code, name, and stage', () => {
  // Test search by code
  const result0580 = searchAndFilterSubjects(SUBJECTS, '0580');
  assert.equal(result0580.length, 1);
  assert.equal(result0580[0].name, 'Mathematics');
  assert.equal(result0580[0].code, '0580');

  // Test stage filter Y7-Y9
  const y7Results = searchAndFilterSubjects(SUBJECTS, '', 'All', 'Y7-Y9');
  assert.equal(y7Results.length >= 3, true);
  assert.ok(y7Results.every((s) => s.stage === 'Y7-Y9'));

  // Test category filter
  const scienceResults = searchAndFilterSubjects(SUBJECTS, '', 'Sciences');
  assert.ok(scienceResults.length > 0);
  assert.ok(scienceResults.every((s) => s.category === 'Sciences'));
});

test('calculateStudyStreak handles consecutive and broken study days', () => {
  const mockToday = new Date('2026-10-30T10:00:00Z');
  
  // Consecutive 3 days
  const consecutiveDays = [
    '2026-10-30T08:00:00Z',
    '2026-10-29T14:30:00Z',
    '2026-10-28T19:00:00Z',
  ];
  assert.equal(calculateStudyStreak(consecutiveDays, mockToday), 3);

  // Missing yesterday -> streak broken (only today)
  const missedYesterday = [
    '2026-10-30T08:00:00Z',
    '2026-10-27T19:00:00Z',
  ];
  assert.equal(calculateStudyStreak(missedYesterday, mockToday), 1);

  // Only dates from long ago
  const oldDays = ['2026-10-20T08:00:00Z'];
  assert.equal(calculateStudyStreak(oldDays, mockToday), 0);
});

test('computeGradeEstimate maps percentages accurately to Cambridge grading', () => {
  assert.deepEqual(computeGradeEstimate(95), {
    letterGrade: 'A*',
    numberGrade: 9,
    descriptor: 'Outstanding Distinction',
  });
  assert.deepEqual(computeGradeEstimate(82), {
    letterGrade: 'A',
    numberGrade: 8,
    descriptor: 'Excellent Mastery',
  });
  assert.deepEqual(computeGradeEstimate(65), {
    letterGrade: 'C',
    numberGrade: 6,
    descriptor: 'Proficient Pass',
  });
  assert.deepEqual(computeGradeEstimate(30), {
    letterGrade: 'U',
    numberGrade: 1,
    descriptor: 'Unclassified',
  });
});

test('calculateSM2 updates intervals and ease factors appropriately', () => {
  const initial = { intervalDays: 1, easeFactor: 2.5, repetitions: 0 };

  // First successful recall
  const round1 = calculateSM2(initial, 4);
  assert.equal(round1.intervalDays, 1);
  assert.equal(round1.repetitions, 1);

  // Second successful recall
  const round2 = calculateSM2(round1, 5);
  assert.equal(round2.intervalDays, 6);
  assert.equal(round2.repetitions, 2);

  // Failure resets repetitions and interval to 1
  const failedRound = calculateSM2(round2, 1);
  assert.equal(failedRound.intervalDays, 1);
  assert.equal(failedRound.repetitions, 0);
});

test('extractYoutubeVideoId parses various YouTube URL patterns', () => {
  const watchUrl = 'https://www.youtube.com/watch?v=0jPcbOQzXyE';
  const shortUrl = 'https://youtu.be/0jPcbOQzXyE';
  const embedUrl = 'https://www.youtube.com/embed/0jPcbOQzXyE';
  const invalidUrl = 'https://google.com';

  assert.equal(extractYoutubeVideoId(watchUrl), '0jPcbOQzXyE');
  assert.equal(extractYoutubeVideoId(shortUrl), '0jPcbOQzXyE');
  assert.equal(extractYoutubeVideoId(embedUrl), '0jPcbOQzXyE');
  assert.equal(extractYoutubeVideoId(invalidUrl), null);
  assert.equal(formatYoutubeEmbedUrl('0jPcbOQzXyE'), 'https://www.youtube.com/embed/0jPcbOQzXyE');
});

