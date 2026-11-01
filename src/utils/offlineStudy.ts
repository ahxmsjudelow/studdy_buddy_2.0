/**
 * AI-free study engine. Used by the server (and tests) so the AI Tutor and
 * YouTube-to-Notes ("Turbo") keep working when Gemini is unavailable,
 * out of quota, or no API key is configured.
 */
import type { Subject } from '../data/subjects';
import type { FlashcardItem } from '../data/flashcardsData';

export interface PackFlashcard { front: string; back: string; hint: string; difficulty: 'Standard' | 'Challenging' | 'Expert' }
export interface PackQuiz { question: string; options: string[]; correctIndex: number; explanation: string }
export interface OfflinePack {
  summary: string;
  notes: string;
  flashcards: PackFlashcard[];
  quiz: PackQuiz[];
  audioScript: string;
}

const STOP = new Set(('the a an and or but if then of to in on at by for with from as is are was were be been being this that these those it its '
  + 'they them their there here which who whom what when where why how not no can could should would will shall may might must do does did done have has had '
  + 'into than also such more most some any each other about over under between through during before after again further once only own same so very just '
  + 'we you your our us i he she his her him').split(' '));

const DIFFICULTIES: PackFlashcard['difficulty'][] = ['Standard', 'Standard', 'Challenging', 'Expert'];

export function splitSentences(text: string): string[] {
  return text
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .split(/\n{1,}|(?<=[.!?])\s+/)
    .map((s) => s.trim().replace(/^[-*•\d.)\s#]+/, '').trim())
    .filter((s) => s.length >= 25 && s.length <= 320 && /[a-zA-Z]{3}/.test(s));
}

export function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z][a-z0-9'-]{2,}/g) || []).filter((w) => !STOP.has(w));
}

function termFrequency(text: string): Map<string, number> {
  const tf = new Map<string, number>();
  for (const w of tokenize(text)) if (w.length > 3) tf.set(w, (tf.get(w) || 0) + 1);
  return tf;
}

function rankKeywords(tf: Map<string, number>, limit: number): string[] {
  return [...tf.entries()].sort((a, b) => b[1] - a[1] || b[0].length - a[0].length).slice(0, limit).map(([w]) => w);
}

function titleCase(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

/** Deterministic placement so output (and tests) are stable. */
function placeCorrect(correct: string, distractors: string[], slot: number): { options: string[]; correctIndex: number } {
  const options = distractors.slice(0, 3);
  const idx = slot % 4;
  options.splice(idx, 0, correct);
  return { options, correctIndex: idx };
}

const DEF_RE = /^([A-Z][A-Za-z0-9\s\-()/']{2,60}?)\s+(?:is|are|means|refers to|is defined as|are defined as|can be defined as|describes)\s+(.{15,260})$/;

/**
 * Builds a study pack (summary, notes, flashcards, quiz, audio script) from
 * raw text such as a pasted transcript or teacher notes. Returns null when
 * there is not enough material.
 */
export function buildStudyPackFromText(text: string, opts: { title?: string; subject?: string } = {}): OfflinePack | null {
  const clean = (text || '').trim();
  if (clean.length < 120) return null;
  const sentences = splitSentences(clean);
  if (sentences.length < 3) return null;

  const tf = termFrequency(clean);
  const keywords = rankKeywords(tf, 24);
  const keywordSet = new Set(keywords);

  const scored = sentences.map((s, i) => {
    const toks = tokenize(s);
    const score = toks.reduce((a, w) => a + (tf.get(w) || 0), 0) / Math.sqrt(toks.length + 4);
    return { s, i, score };
  });
  const top = [...scored].sort((a, b) => b.score - a.score).slice(0, 5).sort((a, b) => a.i - b.i);

  const definitions: { term: string; sentence: string }[] = [];
  const formulas: string[] = [];
  for (const { s } of scored) {
    const m = s.match(DEF_RE);
    if (m && !definitions.some((d) => d.term.toLowerCase() === m[1].toLowerCase())) definitions.push({ term: m[1].trim(), sentence: s });
    if (/[=≈]/.test(s) && s.length < 160 && !formulas.includes(s)) formulas.push(s);
  }

  const subject = opts.subject || 'this topic';
  const title = opts.title || `${titleCase(keywords[0] || 'Lecture')} study notes`;
  const summary = `${title} covers ${keywords.slice(0, 4).join(', ')}. Key takeaways:\n`
    + top.map((t, i) => `${i + 1}. ${t.s}`).join('\n');

  const notes = [
    `# ${title}`,
    '',
    '## Key ideas',
    ...top.map((t) => `- ${t.s}`),
    ...(definitions.length ? ['', '## Key definitions', ...definitions.slice(0, 8).map((d) => `- **${d.term}**: ${d.sentence.replace(d.term, '').replace(/^\s*(is|are|means|refers to|is defined as|are defined as|can be defined as|describes)\s+/i, '')}`)] : []),
    ...(formulas.length ? ['', '## Formulas & relationships', ...formulas.slice(0, 6).map((f) => `- ${f}`)] : []),
    '',
    '## Key terms to learn',
    keywords.slice(0, 12).map((k) => `**${k}**`).join(' · '),
    '',
    `## Exam tip`,
    `For ${subject}, state definitions using the exact keywords above and show every line of working to earn method marks.`,
  ].join('\n');

  // ---- Flashcards ----
  const flashcards: PackFlashcard[] = [];
  definitions.slice(0, 5).forEach((d, i) => flashcards.push({
    front: `Define: ${d.term}`,
    back: d.sentence,
    hint: `Starts with "${d.sentence.split(' ').slice(0, 2).join(' ')}…"`,
    difficulty: DIFFICULTIES[i % 4],
  }));
  formulas.slice(0, 3).forEach((f, i) => flashcards.push({
    front: `Complete the relationship: ${f.replace(/[=≈].*$/, '= ?').slice(0, 120)}`,
    back: f,
    hint: 'Recall the formula from the lecture',
    difficulty: i === 0 ? 'Standard' : 'Challenging',
  }));
  const clozeTargets: { s: string; kw: string }[] = [];
  for (const { s } of [...scored].sort((a, b) => b.score - a.score)) {
    if (flashcards.length + clozeTargets.length >= 10) break;
    if (definitions.some((d) => d.sentence === s) || formulas.includes(s)) continue;
    const words = s.match(/[A-Za-z][A-Za-z'-]{3,}/g) || [];
    const kw = words.find((w) => keywordSet.has(w.toLowerCase()));
    if (kw) clozeTargets.push({ s, kw });
  }
  clozeTargets.forEach(({ s, kw }, i) => flashcards.push({
    front: `Fill in the blank: ${s.replace(new RegExp(`\\b${kw}\\b`, 'i'), '_____')}`,
    back: `${kw} — ${s}`,
    hint: `${kw.length} letters, starts with "${kw[0].toUpperCase()}"`,
    difficulty: DIFFICULTIES[(i + 1) % 4],
  }));

  // ---- Quiz (cloze multiple choice with distractors from other key terms) ----
  const quiz: PackQuiz[] = [];
  for (const { s, kw } of clozeTargets.slice(0, 5)) {
    const distractors = keywords.filter((k) => k !== kw.toLowerCase() && !s.toLowerCase().includes(k)).slice(0, 3);
    if (distractors.length < 3) continue;
    const { options, correctIndex } = placeCorrect(kw.toLowerCase(), distractors, quiz.length);
    quiz.push({
      question: `Which term correctly completes this statement? "${s.replace(new RegExp(`\\b${kw}\\b`, 'i'), '_____')}"`,
      options,
      correctIndex,
      explanation: `The statement reads: ${s}`,
    });
  }

  const audioScript = `Here is a quick revision summary of ${title}. ${top.slice(0, 3).map((t) => t.s).join(' ')} `
    + `Remember the key terms: ${keywords.slice(0, 5).join(', ')}.`;

  return { summary, notes, flashcards, quiz, audioScript };
}

// --------------------------------------------------------------------------
// Offline tutor
// --------------------------------------------------------------------------

export type TutorRole = 'socratic' | 'examiner' | 'flashcard_coach';
export interface TutorMsg { role: string; content: string }

interface Hit { kind: 'card' | 'question' | 'formula' | 'topic'; score: number; title: string; body: string; hint?: string }

function overlap(q: Set<string>, text: string): number {
  let n = 0;
  for (const t of new Set(tokenize(text))) if (q.has(t)) n++;
  return n;
}

const REVEAL_RE = /\b(show|give|reveal|tell)\b.*\b(answer|solution|me)\b|\bi (give up|don'?t know)\b|\bnot sure\b/i;

export function offlineTutorReply(args: {
  messages: TutorMsg[];
  subject?: Subject | null;
  role?: TutorRole;
  flashcards?: FlashcardItem[];
}): string {
  const { messages, subject, role = 'socratic', flashcards = [] } = args;
  const userMsgs = messages.filter((m) => m.role === 'user');
  const last = (userMsgs[userMsgs.length - 1]?.content || '').trim();
  const lower = last.toLowerCase();
  const reveal = REVEAL_RE.test(last) && userMsgs.length > 1;
  const queryText = reveal ? userMsgs[userMsgs.length - 2].content : last;
  const q = new Set(tokenize(queryText));
  const subjectName = subject ? subject.name + (subject.code ? ` (${subject.code})` : '') : 'your subject';

  // Intent shortcuts --------------------------------------------------------
  if (/\b(exam question|mark question|practice question|test me|quiz me)\b/.test(lower) && subject?.sampleQuestions?.length) {
    const marks = lower.match(/(\d+)[\s-]*mark/);
    const pool = marks ? subject.sampleQuestions.filter((s) => s.marks === Number(marks[1])) : subject.sampleQuestions;
    const pick = (pool.length ? pool : subject.sampleQuestions)[userMsgs.length % (pool.length || subject.sampleQuestions.length)];
    return `Here is a ${pick.marks}-mark ${subjectName} question${pick.year ? ` (${pick.year})` : ''}:\n\n${pick.question}\n\nWrite out your working, then reply "show answer" and I will give you the mark-scheme hint.`;
  }
  if (/\b(formula|equation|derivation|derive)\b/.test(lower) && subject?.keyFormulas?.length) {
    return `Key formulas for ${subjectName}:\n${subject.keyFormulas.map((f) => `• ${f}`).join('\n')}\n\nExam tip: always write the formula first, then substitute values, to secure method marks.`;
  }
  if (/\b(common mistakes?|pitfalls?|traps?|lose marks)\b/.test(lower)) {
    return `Top ${subjectName} examiner traps:\n• Not showing intermediate working (lose M marks).\n• Wrong units or too few significant figures (give 3 s.f. unless told otherwise).\n• Vague wording instead of syllabus keywords.\n• Not answering the command word (State / Explain / Calculate / Evaluate).\n• Skipping a final check that the answer is sensible.`;
  }

  // Retrieval ---------------------------------------------------------------
  const hits: Hit[] = [];
  for (const c of flashcards) {
    if (subject && c.subjectId !== subject.id && c.subjectId !== subject.code && !c.subjectName?.includes(subject.code || '#')) continue;
    const s = overlap(q, `${c.front} ${c.topic}`) * 2 + overlap(q, c.back) + overlap(q, c.hint);
    if (s > 0) hits.push({ kind: 'card', score: s, title: c.topic, body: `${c.front}\n${c.back}`, hint: c.hint });
  }
  for (const sq of subject?.sampleQuestions || []) {
    const s = overlap(q, sq.question) * 2 + overlap(q, sq.solutionHint);
    if (s > 0) hits.push({ kind: 'question', score: s, title: sq.question, body: sq.solutionHint });
  }
  for (const f of subject?.keyFormulas || []) {
    const s = overlap(q, f) * 2;
    if (s > 0) hits.push({ kind: 'formula', score: s, title: 'Formula', body: f });
  }
  for (const t of subject?.topics || []) {
    const s = overlap(q, t) * 3;
    if (s > 0) hits.push({ kind: 'topic', score: s, title: t, body: t });
  }
  hits.sort((a, b) => b.score - a.score);
  const best = hits[0];

  if (!best) {
    const topics = (subject?.topics || []).slice(0, 5).map((t) => `• ${t}`).join('\n');
    return `I'm running in offline mode (no AI connection), so I can only help with built-in ${subjectName} revision material. I couldn't match that to a topic.\n\nTry asking about one of these:\n${topics || '• a syllabus topic or key formula'}\n\nOr say "give me a 4-mark exam question".`;
  }

  const related = hits.filter((h) => h !== best && h.kind === 'card').slice(0, 2);
  const answerText = best.kind === 'card' ? best.body.split('\n').slice(1).join('\n') : best.body;
  const questionText = best.kind === 'card' ? best.body.split('\n')[0] : best.title;

  if (role === 'examiner') {
    const points = answerText.split(/(?<=[.;])\s+/).filter(Boolean).slice(0, 4);
    return `Examiner view — ${best.title}\n\nMark-scheme style points:\n${points.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\nTo gain full marks use the exact keywords above and show your working. Want a practice question? Ask "give me a 4-mark exam question".`;
  }
  if (role === 'flashcard_coach') {
    const next = related[0]?.body.split('\n')[0] || questionText;
    return reveal
      ? `Answer: ${answerText}\n\nNext drill: ${next}`
      : `Rapid recall: ${questionText}\n\nSay your answer, then type "show answer". Memory trigger: ${best.hint || 'think keywords'}.`;
  }
  // socratic
  if (reveal || userMsgs.length > 3) {
    return `Here's the full explanation for ${best.title}:\n\n${answerText}${related.length ? `\n\nRelated idea: ${related[0].body.split('\n')[0]}` : ''}\n\nCan you now explain it back in your own words?`;
  }
  return `Good question about ${best.title}. Let's work it out together:\n\n• ${questionText}\n• Hint: ${best.hint || answerText.split(/[.;]/)[0].split(' ').slice(0, 4).join(' ') + '…'}\n\nWhat do you think? (Type "show answer" if you want the full explanation.)`;
}

/** Flashcards from built-in subject data, used when AI card generation fails. */
export function offlineFlashcardsForSubject(subject: Subject | undefined, topic: string, count: number): PackFlashcard[] {
  if (!subject) return [];
  const cards: PackFlashcard[] = [];
  for (const sq of subject.sampleQuestions || []) {
    cards.push({ front: sq.question, back: sq.solutionHint, hint: `${sq.marks} marks${sq.year ? ` · ${sq.year}` : ''}`, difficulty: sq.difficulty });
  }
  for (const f of subject.keyFormulas || []) {
    const [lhs] = f.split(/\s*=\s*/);
    cards.push({ front: `State the formula: ${lhs.trim()}`, back: f, hint: 'Write the formula before substituting', difficulty: 'Standard' });
  }
  for (const t of subject.topics || []) {
    if (cards.length >= count + 4) break;
    cards.push({ front: `List the key ideas you must know for "${t}"`, back: `Revise ${t} in ${subject.name}: definitions, formulas, and one worked past-paper question.`, hint: 'Syllabus topic', difficulty: 'Standard' });
  }
  const t = topic.toLowerCase();
  cards.sort((a, b) => Number(b.front.toLowerCase().includes(t)) - Number(a.front.toLowerCase().includes(t)));
  return cards.slice(0, Math.max(1, count));
}
