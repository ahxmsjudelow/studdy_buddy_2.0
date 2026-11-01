import test from 'node:test';
import assert from 'node:assert/strict';
import { buildStudyPackFromText, offlineTutorReply } from './offlineStudy';
import { SUBJECTS } from '../data/subjects';
import { INITIAL_FLASHCARDS } from '../data/flashcardsData';

const TEXT = `Osmosis is the net movement of water molecules from a region of higher water potential to a region of lower water potential through a partially permeable membrane.
Diffusion is the net movement of particles from a region of higher concentration to a region of lower concentration down a concentration gradient.
Active transport is the movement of particles against a concentration gradient using energy from respiration.
Plant cells become turgid when water enters the vacuole by osmosis and presses the cell membrane against the cell wall.
Animal cells placed in pure water burst because they have no cell wall to resist the water entering by osmosis.
The rate of diffusion increases when temperature, surface area or the concentration gradient increases.`;

test('study pack from text has summary, cards and quiz', () => {
  const p = buildStudyPackFromText(TEXT, { title: 'Cell transport', subject: 'Biology' })!;
  assert.ok(p);
  assert.ok(p.flashcards.length >= 4, `cards: ${p.flashcards.length}`);
  assert.ok(p.quiz.length >= 1);
  for (const q of p.quiz) { assert.equal(q.options.length, 4); assert.ok(q.correctIndex >= 0 && q.correctIndex < 4); assert.equal(new Set(q.options).size, 4); }
  assert.match(p.notes, /Osmosis/);
  assert.equal(buildStudyPackFromText('too short'), null);
});

test('offline tutor answers from subject data and reveals on request', () => {
  const bio = SUBJECTS.find((s) => s.code === '0580')!;
  const msgs = [{ role: 'user', content: 'How do I find a turning point using differentiation?' }];
  const r1 = offlineTutorReply({ messages: msgs, subject: bio, role: 'socratic', flashcards: INITIAL_FLASHCARDS });
  assert.ok(r1.length > 40);
  const r2 = offlineTutorReply({ messages: [...msgs, { role: 'assistant', content: r1 }, { role: 'user', content: 'show answer' }], subject: bio, flashcards: INITIAL_FLASHCARDS });
  assert.match(r2, /full explanation/);
  const q = offlineTutorReply({ messages: [{ role: 'user', content: 'Give me a 4-mark exam question' }], subject: bio, flashcards: [] });
  assert.match(q, /mark/);
  const none = offlineTutorReply({ messages: [{ role: 'user', content: 'zzzz qqqq' }], subject: bio });
  assert.match(none, /offline mode/);
});
