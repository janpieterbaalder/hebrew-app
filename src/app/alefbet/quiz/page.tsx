"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { alphabet } from "@/data/alphabet";
import {
  createNewCard,
  calculateNextReview,
  updateStreak,
  type Quality,
} from "@/lib/spaced-repetition";
import { useProgress } from "@/components/ProgressContext";

type QuizMode = "name" | "sound";
type Letter = (typeof alphabet)[number];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function answerFor(letter: Letter, mode: QuizMode): string {
  return mode === "name" ? letter.name : letter.sound.split(" ")[0];
}

// Build a shuffled set of one correct + three wrong answers for a letter.
// Pure function so the options can be derived with useMemo instead of being
// pushed into state from an effect.
function buildOptions(letter: Letter, mode: QuizMode): string[] {
  const correctAnswer = answerFor(letter, mode);
  const wrongAnswers = shuffleArray(alphabet.filter((l) => l.id !== letter.id))
    .slice(0, 3)
    .map((l) => answerFor(l, mode));
  return shuffleArray([correctAnswer, ...wrongAnswers]);
}

export default function AlefbetQuiz() {
  const { ready, updateProgress } = useProgress();
  const [mode, setMode] = useState<QuizMode>("name");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [quizLetters, setQuizLetters] = useState(() =>
    shuffleArray([...alphabet])
  );
  const [quizComplete, setQuizComplete] = useState(false);

  // Options are derived from the current letter + mode. useMemo keeps them
  // stable for a given question (it only reshuffles when the question or mode
  // changes), so no effect/extra state is needed.
  const options = useMemo(() => {
    const current = quizLetters[currentIndex];
    return current ? buildOptions(current, mode) : [];
  }, [quizLetters, currentIndex, mode]);

  // Reset the quiz to a fresh shuffled run, optionally switching mode.
  const restartQuiz = useCallback((nextMode?: QuizMode) => {
    setQuizLetters(shuffleArray([...alphabet]));
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setQuizComplete(false);
    setSelected(null);
    setIsCorrect(null);
    if (nextMode) setMode(nextMode);
  }, []);

  const handleAnswer = (answer: string) => {
    if (selected !== null) return;

    const current = quizLetters[currentIndex];
    const correctAnswer =
      mode === "name" ? current.name : current.sound.split(" ")[0];
    const correct = answer === correctAnswer;

    setSelected(answer);
    setIsCorrect(correct);
    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));

    updateProgress((prev) => {
      const cards = { ...prev.cards };
      const cardId = `letter-${current.id}`;
      if (!cards[cardId]) {
        cards[cardId] = createNewCard(cardId);
      }
      const quality: Quality = correct ? 5 : 1;
      cards[cardId] = calculateNextReview(cards[cardId], quality);

      const learnedCount = Object.keys(cards).filter(
        (k) => k.startsWith("letter-") && cards[k].repetitions >= 2
      ).length;

      const updated = updateStreak({
        cards,
        stats: {
          ...prev.stats,
          totalReviewed: prev.stats.totalReviewed + 1,
          lettersLearned: correct ? learnedCount : prev.stats.lettersLearned,
        },
      });

      return updated;
    });
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= quizLetters.length) {
      setQuizComplete(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelected(null);
      setIsCorrect(null);
    }
  };

  // Loader: wait until server data is merged into context
  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-green border-t-transparent" />
      </div>
    );
  }

  if (quizComplete) {
    const percentage = Math.round((score.correct / score.total) * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">
          {percentage >= 80 ? "🎉" : percentage >= 50 ? "👍" : "💪"}
        </div>
        <h1 className="text-3xl font-bold text-green-lightest mb-2">
          Quiz voltooid!
        </h1>
        <p className="text-xl text-green-light/60 mb-6">
          {score.correct} van {score.total} correct ({percentage}%)
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => restartQuiz()}
            className="gradient-green text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md"
          >
            Opnieuw
          </button>
          <Link
            href="/alefbet"
            className="bg-surface-light text-green-light border border-green-darkest/50 px-6 py-2.5 rounded-lg font-medium hover:bg-surface-lighter transition-colors"
          >
            Terug naar overzicht
          </Link>
        </div>
      </div>
    );
  }

  const currentLetter = quizLetters[currentIndex];
  if (!currentLetter) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/alefbet" className="text-green-light/50 hover:text-green-light text-sm">
          ← Terug
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => mode !== "name" && restartQuiz("name")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              mode === "name"
                ? "gradient-green text-white"
                : "bg-surface-light text-green-light/60 border border-green-darkest/50"
            }`}
          >
            Naam
          </button>
          <button
            onClick={() => mode !== "sound" && restartQuiz("sound")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              mode === "sound"
                ? "gradient-green text-white"
                : "bg-surface-light text-green-light/60 border border-green-darkest/50"
            }`}
          >
            Klank
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-green-light/40 mb-1">
          <span>Vraag {currentIndex + 1} van {quizLetters.length}</span>
          <span>Score: {score.correct}/{score.total}</span>
        </div>
        <div className="w-full bg-surface rounded-full h-2">
          <div
            className="gradient-green-light h-2 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / quizLetters.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="gradient-card rounded-2xl border border-green-darkest/50 p-8 text-center mb-6 shadow-lg">
        <p className="text-sm text-green-light/40 mb-2">
          {mode === "name" ? "Wat is de naam van deze letter?" : "Wat is de klank van deze letter?"}
        </p>
        <div className="hebrew-xl text-8xl text-green leading-none py-4">
          {currentLetter.letter}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {options.map((option) => {
          let buttonClass =
            "bg-surface-light border-2 border-green-darkest/50 hover:border-green-dark/60 text-green-light";

          if (selected !== null) {
            const correctAnswer =
              mode === "name" ? currentLetter.name : currentLetter.sound.split(" ")[0];
            if (option === correctAnswer) {
              buttonClass = "bg-green-darkest/40 border-2 border-green text-green-light";
            } else if (option === selected && !isCorrect) {
              buttonClass = "bg-red-900/30 border-2 border-red-500/60 text-red-300";
            } else {
              buttonClass = "bg-surface-light border-2 border-green-darkest/30 text-green-light/30";
            }
          }

          return (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              disabled={selected !== null}
              className={`${buttonClass} rounded-xl p-4 text-lg font-medium transition-all`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="text-center">
          <p className={`text-lg font-medium mb-3 ${isCorrect ? "text-green" : "text-red-400"}`}>
            {isCorrect
              ? "Correct! ✓"
              : `Helaas. Het juiste antwoord was: ${
                  mode === "name" ? currentLetter.name : currentLetter.sound.split(" ")[0]
                }`}
          </p>
          <button
            onClick={nextQuestion}
            className="gradient-green text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md"
          >
            {currentIndex + 1 >= quizLetters.length ? "Resultaat bekijken" : "Volgende"}
          </button>
        </div>
      )}
    </div>
  );
}
