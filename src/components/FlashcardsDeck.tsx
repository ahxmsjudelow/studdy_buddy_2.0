import React, { useState, useMemo } from 'react';
import { Subject } from '../data/subjects';
import { INITIAL_FLASHCARDS, FlashcardItem } from '../data/flashcardsData';
import {
  Sparkles,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Loader2,
  Award,
  Shuffle,
  Layers,
  Filter,
} from 'lucide-react';
import { calculateSM2, SpacedCardReview } from '../utils/studyUtils';
import confetti from 'canvas-confetti';

interface FlashcardsDeckProps {
  currentSubject?: Subject;
  allSubjects: Subject[];
  onAddPoints: (amount: number, reason: string) => void;
  darkMode?: boolean;
  cards?: FlashcardItem[];
  onUpdateCards?: (cards: FlashcardItem[]) => void;
  /** Open with this filter (e.g. 'yt-import') instead of the active subject */
  initialFilter?: string | null;
  onConsumeInitialFilter?: () => void;
}

export const FlashcardsDeck: React.FC<FlashcardsDeckProps> = ({
  currentSubject,
  allSubjects,
  onAddPoints,
  darkMode,
  cards: externalCards,
  onUpdateCards,
  initialFilter,
  onConsumeInitialFilter,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    initialFilter || currentSubject?.id || 'all'
  );
  React.useEffect(() => {
    if (initialFilter) onConsumeInitialFilter?.();
  }, []);

  // The parent owns the deck so review progress (SM-2) and generated/imported cards
  // survive switching tabs. Previously every update stayed in local state and was lost.
  const [localCards, setLocalCards] = useState<FlashcardItem[]>(INITIAL_FLASHCARDS);
  const cards = externalCards ?? localCards;
  const setCards = (updater: FlashcardItem[] | ((prev: FlashcardItem[]) => FlashcardItem[])) => {
    const next = typeof updater === 'function' ? updater(cards) : updater;
    if (onUpdateCards) onUpdateCards(next);
    else setLocalCards(next);
  };
  const [genError, setGenError] = useState<string | null>(null);
  const importCount = cards.filter((c) => c.subjectId === 'yt-import').length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Filtered cards based on selected subject
  const filteredCards = useMemo(() => {
    if (selectedSubjectId === 'all') return cards;
    return cards.filter(
      (c) => c.subjectId === selectedSubjectId || c.subjectId.includes(selectedSubjectId)
    );
  }, [cards, selectedSubjectId]);

  const activeCard = filteredCards[currentIndex] || filteredCards[0];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSM2Rating = (quality: number) => {
    if (!activeCard) return;
    const updatedSM2 = calculateSM2(activeCard.sm2, quality);

    setCards((prev) =>
      prev.map((c) => (c.id === activeCard.id ? { ...c, sm2: updatedSM2 } : c))
    );

    onAddPoints(20, 'Completed active recall review');

    setIsFlipped(false);
    setShowHint(false);
    if (currentIndex + 1 < filteredCards.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#00A896', '#3B82F6', '#10B981'],
      });
      setCurrentIndex(0);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleGenerateCards = async () => {
    const targetSub = allSubjects.find((s) => s.id === selectedSubjectId) || currentSubject || allSubjects[0];
    const targetTopic = targetSub.topics[0] || 'Core Revision';
    setIsGenerating(true);
    setGenError(null);

    try {
      const res = await fetch('/api/gemini/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: targetSub.name + (targetSub.code ? ` (${targetSub.code})` : ''),
          topic: targetTopic,
          count: 5,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not generate cards.');
      if (Array.isArray(data.cards) && data.cards.length > 0) {
        const newFormatted: FlashcardItem[] = data.cards.map((c: any, i: number) => ({
          id: `gen-${Date.now()}-${i}`,
          subjectId: targetSub.id,
          subjectName: targetSub.name + (targetSub.code ? ` (${targetSub.code})` : ''),
          topic: targetTopic,
          front: c.front,
          back: c.back,
          hint: c.hint || 'Cambridge Syllabus Key Point',
          difficulty: c.difficulty || 'Standard',
          sm2: { intervalDays: 1, easeFactor: 2.5, repetitions: 0 },
        }));
        setCards((prev) => [...newFormatted, ...prev]);
        setCurrentIndex(0);
        setIsFlipped(false);
        setShowHint(false);
        onAddPoints(30, 'Generated new Cambridge flashcard deck');
        if (data.offline) setGenError('AI is unavailable, so these cards came from the built-in syllabus bank.');
        setSelectedSubjectId(targetSub.id);
      } else {
        setGenError('No cards were returned. Try again.');
      }
    } catch (err: any) {
      console.error(err);
      setGenError(err.message || 'Could not generate cards.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b goodness-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SuperMemo-2 Spaced Repetition Engine ({cards.length} Cards in Library)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Active Recall Flashcards
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-serif italic mt-1">
            Optimize neural retention with spaced repetition and AI-generated syllabus card decks.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Shuffle Deck"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            onClick={handleGenerateCards}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors shadow-sm disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Generate New AI Deck</span>
          </button>
        </div>
      </div>

      {genError && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">{genError}</div>
      )}

      {/* Filter by Subject Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => {
            setSelectedSubjectId('all');
            setCurrentIndex(0);
          }}
          className={`shrink-0 px-3 py-1.5 rounded-xl font-medium transition-colors ${
            selectedSubjectId === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          All Subjects ({cards.length})
        </button>

        {importCount > 0 && (
          <button
            onClick={() => {
              setSelectedSubjectId('yt-import');
              setCurrentIndex(0);
            }}
            className={`shrink-0 px-3 py-1.5 rounded-xl font-medium transition-colors ${
              selectedSubjectId === 'yt-import'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
            }`}
          >
            Imported ({importCount})
          </button>
        )}

        {allSubjects.slice(0, 10).map((s) => {
          const count = cards.filter((c) => c.subjectId === s.id).length;
          return (
            <button
              key={s.id}
              onClick={() => {
                setSelectedSubjectId(s.id);
                setCurrentIndex(0);
              }}
              className={`shrink-0 px-3 py-1.5 rounded-xl font-medium transition-colors ${
                selectedSubjectId === s.id
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {s.name} {count > 0 ? `(${count})` : ''}
            </button>
          );
        })}
      </div>

      {/* 3D Interactive Flip Flashcard */}
      {filteredCards.length > 0 && activeCard ? (
        <div className="perspective-1000 py-4">
          <div
            onClick={handleFlip}
            className="relative w-full min-h-[300px] sm:min-h-[340px] rounded-3xl cursor-pointer select-none transition-all duration-500 transform hover:scale-[1.01]"
          >
            <div
              className={`w-full min-h-[300px] sm:min-h-[340px] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col justify-between transition-colors ${
                isFlipped
                  ? 'bg-gradient-to-br from-indigo-900 to-slate-900 text-white'
                  : 'bg-white dark:bg-slate-900/90 text-slate-900 dark:text-white'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between text-xs pb-3 border-b border-black/10 dark:border-white/10">
                <span className="font-mono text-slate-400">
                  Card {currentIndex + 1} of {filteredCards.length} • {activeCard.subjectName}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    {isFlipped ? 'Answer & Mark Scheme' : 'Question Prompt'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Interval: {activeCard.sm2.intervalDays}d
                  </span>
                </div>
              </div>

              {/* Card Content Body */}
              <div className="py-6 text-center">
                <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 block mb-2 font-mono">
                  {activeCard.topic}
                </span>
                <h3 className="text-lg sm:text-2xl font-bold leading-relaxed max-w-xl mx-auto whitespace-pre-wrap">
                  {isFlipped ? activeCard.back : activeCard.front}
                </h3>

                {!isFlipped && showHint && (
                  <p className="mt-4 text-xs sm:text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 py-2 px-4 rounded-xl inline-block">
                    Hint: {activeCard.hint}
                  </p>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-black/10 dark:border-white/10">
                {!isFlipped ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowHint(!showHint);
                    }}
                    className="hover:text-amber-500 font-semibold"
                  >
                    {showHint ? 'Hide Hint' : 'Show Memory Hint'}
                  </button>
                ) : (
                  <span className="text-teal-400 font-semibold">
                    Cambridge Mark Scheme Key Point
                  </span>
                )}

                <span className="flex items-center gap-1 font-serif italic">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Tap card to flip</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 mb-4">No cards in this category yet.</p>
          <button
            onClick={handleGenerateCards}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            Generate Cards for This Subject with Gemini
          </button>
        </div>
      )}

      {/* SM-2 Recall Feedback Buttons */}
      {isFlipped && activeCard ? (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 animate-fade-in">
          <div className="text-center text-xs text-slate-400 font-semibold">
            Rate your recall difficulty (Calculates SM-2 interval):
          </div>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => handleSM2Rating(1)}
              className="py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-semibold text-xs border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition-colors"
            >
              Again (1d)
            </button>
            <button
              onClick={() => handleSM2Rating(3)}
              className="py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-semibold text-xs border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors"
            >
              Hard (3d)
            </button>
            <button
              onClick={() => handleSM2Rating(4)}
              className="py-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-semibold text-xs border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition-colors"
            >
              Good (6d)
            </button>
            <button
              onClick={() => handleSM2Rating(5)}
              className="py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold text-xs border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
            >
              Easy (12d)
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between text-xs text-slate-500">
          <button
            onClick={() => {
              if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
                setIsFlipped(false);
                setShowHint(false);
              }
            }}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Card</span>
          </button>

          <button
            onClick={() => {
              if (currentIndex + 1 < filteredCards.length) {
                setCurrentIndex(currentIndex + 1);
                setIsFlipped(false);
                setShowHint(false);
              }
            }}
            disabled={currentIndex + 1 >= filteredCards.length}
            className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white disabled:opacity-30"
          >
            <span>Next Card</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
