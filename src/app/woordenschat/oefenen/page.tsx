"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { vocabulary } from "@/data/vocabulary";
import {
  createNewCard,
  calculateNextReview,
  updateStreak,
  type Quality,
} from "@/lib/spaced-repetition";
import { useProgress } from "@/components/ProgressContext";

const STACK_SIZE = 20;

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

type FlashcardMode = "hebrew-to-dutch" | "dutch-to-hebrew";

function FlashcardPracticeInner() {
  const { ready, updateProgress } = useProgress();
  const searchParams = useSearchParams();

  // Determine which stack to practice (1-based, default 1)
  const stapelParam = searchParams.get("stapel");
  const stapelNumber = stapelParam
    ? Math.max(1, Math.min(25, parseInt(stapelParam, 10)))
    : 1;
  const wordStart = (stapelNumber - 1) * STACK_SIZE;
  const wordEnd = Math.min(wordStart + STACK_SIZE, vocabulary.length);
  const totalStacks = Math.ceil(vocabulary.length / STACK_SIZE);

  const [mode, setMode] = useState<FlashcardMode>("hebrew-to-dutch");
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  // Initialise with the correct stack immediately — NOT based on progress,
  // so this never re-fires when progress changes (Bug 2 fix).
  const [words, setWords] = useState(() =>
    shuffleArray(vocabulary.slice(wordStart, wordEnd))
  );
  const [sessionScore, setSessionScore] = useState({ correct: 0, total: 0 });
  const [sessionComplete, setSessionComplete] = useState(false);

  // When the stapel URL param changes, reset the session for the new stack.
  useEffect(() => {
    setWords(shuffleArray(vocabulary.slice(wordStart, wordEnd)));
    setCurrentIndex(0);
    setShowAnswer(false);
    setSessionScore({ correct: 0, total: 0 });
    setSessionComplete(false);
  }, [wordStart, wordEnd]);

  const handleScore = useCallback(
    (quality: Quality) => {
      const currentWord = words[currentIndex];

      updateProgress((prev) => {
        const cards = { ...prev.cards };
        const cardId = `vocab-${currentWord.id}`;
        if (!cards[cardId]) cards[cardId] = createNewCard(cardId);
        cards[cardId] = calculateNextReview(cards[cardId], quality);

        const learnedCount = Object.keys(cards).filter(
          (k) => k.startsWith("vocab-") && cards[k].repetitions >= 2
        ).length;

        // Check if this stack is now fully complete
        const stackWords = vocabulary.slice(wordStart, wordEnd);
        const stackNowComplete = stackWords.every((w) => {
          const card = cards[`vocab-${w.id}`];
          return card && card.repetitions >= 2;
        });
        const prevCompleted = prev.stats.completedStacks ?? [];
        const completedStacks =
          stackNowComplete && !prevCompleted.includes(stapelNumber)
            ? [...prevCompleted, stapelNumber]
            : prevCompleted;

        return updateStreak({
          cards,
          stats: {
            ...prev.stats,
            totalReviewed: prev.stats.totalReviewed + 1,
            wordsLearned: learnedCount,
            completedStacks,
          },
        });
      });

      setSessionScore((prev) => ({
        correct: prev.correct + (quality >= 3 ? 1 : 0),
        total: prev.total + 1,
      }));

      if (currentIndex + 1 >= words.length) {
        setSessionComplete(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
        setShowAnswer(false);
      }
    },
    [words, currentIndex, updateProgress]
  );

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-green border-t-transparent" />
      </div>
    );
  }

  if (sessionComplete) {
    const percentage =
      sessionScore.total > 0
        ? Math.round((sessionScore.correct / sessionScore.total) * 100)
        : 0;
    const nextStapel = stapelNumber < totalStacks ? stapelNumber + 1 : null;

    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">
          {percentage >= 80 ? "🎉" : percentage >= 50 ? "👍" : "💪"}
        </div>
        <h1 className="text-3xl font-bold text-green-lightest mb-2">
          Stapel {stapelNumber} voltooid!
        </h1>
        <p className="text-xl text-green-light/60 mb-6">
          {sessionScore.correct} van {sessionScore.total} correct ({percentage}%)
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href={`/woordenschat/oefenen?stapel=${stapelNumber}`}
            className="gradient-green text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md"
          >
            Opnieuw oefenen
          </Link>
          {nextStapel && (
            <Link
              href={`/woordenschat/oefenen?stapel=${nextStapel}`}
              className="bg-surface-light text-green-light border border-green-darkest/50 px-6 py-2.5 rounded-lg font-medium hover:bg-surface-lighter transition-colors"
            >
              Naar stapel {nextStapel} →
            </Link>
          )}
          <Link
            href="/woordenschat"
            className="bg-surface-light text-green-light border border-green-darkest/50 px-6 py-2.5 rounded-lg font-medium hover:bg-surface-lighter transition-colors"
          >
            Terug naar overzicht
          </Link>
        </div>
      </div>
    );
  }

  const currentWord = words[currentIndex];
  if (!currentWord) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/woordenschat"
          className="text-green-light/50 hover:text-green-light text-sm"
        >
          ← Terug
        </Link>
        <span className="text-sm text-green-light/50 font-medium">
          Stapel {stapelNumber} · woorden {wordStart + 1}–{wordEnd}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => { setMode("hebrew-to-dutch"); setShowAnswer(false); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              mode === "hebrew-to-dutch"
                ? "gradient-green text-white"
                : "bg-surface-light text-green-light/60 border border-green-darkest/50"
            }`}
          >
            עב→NL
          </button>
          <button
            onClick={() => { setMode("dutch-to-hebrew"); setShowAnswer(false); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              mode === "dutch-to-hebrew"
                ? "gradient-green text-white"
                : "bg-surface-light text-green-light/60 border border-green-darkest/50"
            }`}
          >
            NL→עב
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-green-light/40 mb-1">
          <span>Woord {currentIndex + 1} van {words.length}</span>
          <span>Score: {sessionScore.correct}/{sessionScore.total}</span>
        </div>
        <div className="w-full bg-surface rounded-full h-2">
          <div
            className="gradient-green-light h-2 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
          />
        </div>
      </div>

      <div
        className="gradient-card rounded-2xl border border-green-darkest/50 p-8 text-center mb-6 shadow-lg cursor-pointer min-h-[250px] flex flex-col items-center justify-center"
        onClick={() => setShowAnswer(true)}
      >
        {mode === "hebrew-to-dutch" ? (
          <>
            <div className="hebrew-large text-green mb-4">{currentWord.hebrew}</div>
            <div className="text-sm text-green-light/40 mb-2">
              ({currentWord.transliteration})
            </div>
            {showAnswer ? (
              <div className="mt-4 space-y-2">
                <div className="text-2xl font-semibold text-green-lightest">
                  {currentWord.dutch}
                </div>
                {currentWord.notes && (
                  <div className="text-sm text-green-light/40">{currentWord.notes}</div>
                )}
              </div>
            ) : (
              <div className="text-green-light/30 text-sm mt-4">
                Klik om het antwoord te zien
              </div>
            )}
          </>
        ) : (
          <>
            <div className="text-2xl font-semibold text-green-lightest mb-2">
              {currentWord.dutch}
            </div>
            {showAnswer ? (
              <div className="mt-4 space-y-2">
                <div className="hebrew-large text-green">{currentWord.hebrew}</div>
                <div className="text-sm text-green-light/40">
                  ({currentWord.transliteration})
                </div>
                {currentWord.notes && (
                  <div className="text-sm text-green-light/40">{currentWord.notes}</div>
                )}
              </div>
            ) : (
              <div className="text-green-light/30 text-sm mt-4">
                Klik om het antwoord te zien
              </div>
            )}
          </>
        )}
      </div>

      {showAnswer && (
        <div>
          <p className="text-center text-sm text-green-light/50 mb-3">
            Hoe goed kende je dit woord?
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleScore(1)}
              className="bg-red-900/20 border-2 border-red-500/30 text-red-300 rounded-xl py-3 px-4 font-medium hover:bg-red-900/30 transition-colors"
            >
              Niet geweten
            </button>
            <button
              onClick={() => handleScore(3)}
              className="bg-amber-900/20 border-2 border-amber-500/30 text-amber-300 rounded-xl py-3 px-4 font-medium hover:bg-amber-900/30 transition-colors"
            >
              Moeilijk
            </button>
            <button
              onClick={() => handleScore(5)}
              className="bg-green-darkest/40 border-2 border-green/40 text-green-light rounded-xl py-3 px-4 font-medium hover:bg-green-darkest/60 transition-colors"
            >
              Geweten!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// useSearchParams() needs a Suspense boundary in Next.js App Router
export default function FlashcardPractice() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-green border-t-transparent" />
        </div>
      }
    >
      <FlashcardPracticeInner />
    </Suspense>
  );
}
