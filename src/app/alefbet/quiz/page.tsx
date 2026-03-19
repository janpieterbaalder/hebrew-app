"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { alphabet } from "@/data/alphabet";
import {
  getProgress,
  saveProgress,
  createNewCard,
  calculateNextReview,
  updateStreak,
  type Quality,
} from "@/lib/spaced-repetition";

type QuizMode = "name" | "sound";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function AlefbetQuiz() {
  const [mode, setMode] = useState<QuizMode>("name");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [quizLetters, setQuizLetters] = useState(alphabet);
  const [quizComplete, setQuizComplete] = useState(false);

  const generateOptions = useCallback(
    (letterIndex: number, letters: typeof alphabet) => {
      const current = letters[letterIndex];
      const correctAnswer =
        mode === "name" ? current.name : current.sound.split(" ")[0];
      const otherLetters = alphabet.filter((l) => l.id !== current.id);
      const wrongAnswers = shuffleArray(otherLetters)
        .slice(0, 3)
        .map((l) => (mode === "name" ? l.name : l.sound.split(" ")[0]));
      setOptions(shuffleArray([correctAnswer, ...wrongAnswers]));
    },
    [mode]
  );

  useEffect(() => {
    const shuffled = shuffleArray([...alphabet]);
    setQuizLetters(shuffled);
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setQuizComplete(false);
    setSelected(null);
    setIsCorrect(null);
    generateOptions(0, shuffled);
  }, [mode, generateOptions]);

  useEffect(() => {
    if (quizLetters.length > 0 && currentIndex < quizLetters.length) {
      generateOptions(currentIndex, quizLetters);
    }
  }, [currentIndex, quizLetters, generateOptions]);

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

    const progress = getProgress();
    const cardId = `letter-${current.id}`;
    if (!progress.cards[cardId]) {
      progress.cards[cardId] = createNewCard(cardId);
    }
    const quality: Quality = correct ? 5 : 1;
    progress.cards[cardId] = calculateNextReview(progress.cards[cardId], quality);
    progress.stats.totalReviewed += 1;

    if (correct) {
      const learnedCount = Object.keys(progress.cards).filter(
        (k) => k.startsWith("letter-") && progress.cards[k].repetitions >= 2
      ).length;
      progress.stats.lettersLearned = learnedCount;
    }

    const updated = updateStreak(progress);
    saveProgress(updated);
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
            onClick={() => {
              const shuffled = shuffleArray([...alphabet]);
              setQuizLetters(shuffled);
              setCurrentIndex(0);
              setScore({ correct: 0, total: 0 });
              setQuizComplete(false);
              setSelected(null);
              setIsCorrect(null);
            }}
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
            onClick={() => setMode("name")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              mode === "name"
                ? "gradient-green text-white"
                : "bg-surface-light text-green-light/60 border border-green-darkest/50"
            }`}
          >
            Naam
          </button>
          <button
            onClick={() => setMode("sound")}
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
