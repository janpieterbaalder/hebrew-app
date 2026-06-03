"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { SparkleIcon } from "@/components/icons";
import { vocabulary, type VocabWord } from "@/data/vocabulary";
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

interface FlashcardSessionProps {
  /** The words to study in this session. */
  words: VocabWord[];
  /** Heading shown on cards and the completion screen, e.g. "Stapel 3". */
  title: string;
  /** Optional sub-label, e.g. "woorden 41–60". */
  subtitle?: string;
  /** When set, the session tracks stack completion and offers a next-stack link. */
  stapelNumber?: number;
  /** Total number of stacks (for the next-stack link). */
  totalStacks?: number;
  /** Whether to shuffle the words (true for stacks, false to keep review order). */
  shuffle?: boolean;
}

export default function FlashcardSession({
  words: inputWords,
  title,
  subtitle,
  stapelNumber,
  totalStacks,
  shuffle = true,
}: FlashcardSessionProps) {
  const { updateProgress } = useProgress();

  const [mode, setMode] = useState<FlashcardMode>("hebrew-to-dutch");
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [words] = useState(() => (shuffle ? shuffleArray(inputWords) : inputWords));
  const [sessionScore, setSessionScore] = useState({ correct: 0, total: 0 });
  const [sessionComplete, setSessionComplete] = useState(false);

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

        // Track stack completion only in stack mode.
        let completedStacks = prev.stats.completedStacks ?? [];
        if (stapelNumber) {
          const start = (stapelNumber - 1) * STACK_SIZE;
          const stackWords = vocabulary.slice(start, start + STACK_SIZE);
          const stackNowComplete = stackWords.every((w) => {
            const card = cards[`vocab-${w.id}`];
            return card && card.repetitions >= 2;
          });
          if (stackNowComplete && !completedStacks.includes(stapelNumber)) {
            completedStacks = [...completedStacks, stapelNumber];
          }
        }

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
    [words, currentIndex, updateProgress, stapelNumber]
  );

  if (sessionComplete) {
    const percentage =
      sessionScore.total > 0
        ? Math.round((sessionScore.correct / sessionScore.total) * 100)
        : 0;
    const nextStapel =
      stapelNumber && totalStacks && stapelNumber < totalStacks
        ? stapelNumber + 1
        : null;

    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center" role="status">
        <div className="flex justify-center mb-5">
          <span className="w-20 h-20 rounded-2xl gradient-green flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <SparkleIcon className="w-9 h-9" />
          </span>
        </div>
        <h1 className="text-3xl font-bold text-green-lightest mb-2">
          {title} voltooid!
        </h1>
        <p className="text-xl text-green-light/70 mb-6">
          {sessionScore.correct} van {sessionScore.total} correct ({percentage}%)
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          {stapelNumber && (
            <Link
              href={`/woordenschat/oefenen?stapel=${stapelNumber}`}
              className="gradient-green text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md"
            >
              Opnieuw oefenen
            </Link>
          )}
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
          className="text-green-light/70 hover:text-green-light text-sm"
        >
          ← Terug
        </Link>
        <span className="text-sm text-green-light/70 font-medium">
          {subtitle ?? title}
        </span>
        <div className="flex gap-2" role="group" aria-label="Richting">
          <button
            type="button"
            aria-pressed={mode === "hebrew-to-dutch"}
            onClick={() => { setMode("hebrew-to-dutch"); setShowAnswer(false); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              mode === "hebrew-to-dutch"
                ? "gradient-green text-white"
                : "bg-surface-light text-green-light/70 border border-green-darkest/50"
            }`}
          >
            עב→NL
          </button>
          <button
            type="button"
            aria-pressed={mode === "dutch-to-hebrew"}
            onClick={() => { setMode("dutch-to-hebrew"); setShowAnswer(false); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              mode === "dutch-to-hebrew"
                ? "gradient-green text-white"
                : "bg-surface-light text-green-light/70 border border-green-darkest/50"
            }`}
          >
            NL→עב
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-green-light/60 mb-1">
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

      <button
        type="button"
        onClick={() => setShowAnswer(true)}
        aria-expanded={showAnswer}
        className="w-full gradient-card rounded-2xl border border-green-darkest/50 p-8 text-center mb-6 shadow-lg min-h-[250px] flex flex-col items-center justify-center cursor-pointer"
      >
        {mode === "hebrew-to-dutch" ? (
          <>
            <div className="hebrew-large text-green mb-4">{currentWord.hebrew}</div>
            <div className="text-sm text-green-light/60 mb-2">
              ({currentWord.transliteration})
            </div>
            <div className="mt-4 space-y-2" aria-live="polite">
              {showAnswer ? (
                <>
                  <div className="text-2xl font-semibold text-green-lightest">
                    {currentWord.dutch}
                  </div>
                  {currentWord.notes && (
                    <div className="text-sm text-green-light/60">{currentWord.notes}</div>
                  )}
                </>
              ) : (
                <div className="text-green-light/50 text-sm">
                  Klik om het antwoord te zien
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="text-2xl font-semibold text-green-lightest mb-2">
              {currentWord.dutch}
            </div>
            <div className="mt-4 space-y-2" aria-live="polite">
              {showAnswer ? (
                <>
                  <div className="hebrew-large text-green">{currentWord.hebrew}</div>
                  <div className="text-sm text-green-light/60">
                    ({currentWord.transliteration})
                  </div>
                  {currentWord.notes && (
                    <div className="text-sm text-green-light/60">{currentWord.notes}</div>
                  )}
                </>
              ) : (
                <div className="text-green-light/50 text-sm">
                  Klik om het antwoord te zien
                </div>
              )}
            </div>
          </>
        )}
      </button>

      {showAnswer && (
        <div>
          <p className="text-center text-sm text-green-light/70 mb-3">
            Hoe goed kende je dit woord?
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleScore(1)}
              className="bg-red-900/20 border-2 border-red-500/30 text-red-300 rounded-xl py-3 px-4 font-medium hover:bg-red-900/30 transition-colors"
            >
              Niet geweten
            </button>
            <button
              type="button"
              onClick={() => handleScore(3)}
              className="bg-amber-900/20 border-2 border-amber-500/30 text-amber-300 rounded-xl py-3 px-4 font-medium hover:bg-amber-900/30 transition-colors"
            >
              Moeilijk
            </button>
            <button
              type="button"
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
