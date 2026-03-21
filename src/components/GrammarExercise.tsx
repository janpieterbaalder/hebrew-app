'use client';

import { useState } from 'react';
import type { GrammarExercise } from '@/data/grammar';
import { useProgress } from '@/components/ProgressContext';

interface GrammarExerciseProps {
  exercises: GrammarExercise[];
  lessonId: string;
}

export default function GrammarExercises({ exercises, lessonId }: GrammarExerciseProps) {
  const { updateProgress } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = exercises[currentIndex];
  const isAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === current?.correctAnswer;

  function handleSelect(option: string) {
    if (isAnswered) return;
    setSelectedAnswer(option);
    if (option === current.correctAnswer) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
    } else {
      // Mark this lesson as completed in progress
      updateProgress((prev) => {
        const already = prev.stats.grammarCompleted ?? [];
        if (already.includes(lessonId)) return prev;
        return {
          ...prev,
          stats: {
            ...prev.stats,
            grammarCompleted: [...already, lessonId],
          },
        };
      });
      setFinished(true);
    }
  }

  function handleRestart() {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    return (
      <div className="gradient-card rounded-xl border border-green-darkest/50 p-6 text-center">
        <h3 className="text-2xl font-bold text-green-lightest mb-2">Resultaat</h3>
        <p className="text-4xl font-bold text-green mb-4">
          {score} van de {exercises.length} correct!
        </p>
        <p className="text-green-light/50 mb-6">
          {score === exercises.length
            ? 'Uitstekend! Je beheerst deze stof volledig.'
            : score >= exercises.length * 0.7
              ? 'Goed gedaan! Je hebt de meeste vragen goed.'
              : 'Blijf oefenen, je kunt het!'}
        </p>
        <button
          onClick={handleRestart}
          className="gradient-green px-6 py-2 rounded-lg font-medium text-white"
        >
          Opnieuw proberen
        </button>
      </div>
    );
  }

  return (
    <div className="gradient-card rounded-xl border border-green-darkest/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-green-light/50">
          Oefening {currentIndex + 1}/{exercises.length}
        </span>
        <span className="text-sm text-green-light/50">
          Score: {score}/{currentIndex + (isAnswered ? 1 : 0)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-surface rounded-full h-1.5 mb-6">
        <div
          className="bg-green h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + (isAnswered ? 1 : 0)) / exercises.length) * 100}%` }}
        />
      </div>

      <h3 className="text-lg font-semibold text-green-lightest mb-4">{current.question}</h3>

      {current.type === 'multiple-choice' && current.options && (
        <div className="space-y-3">
          {current.options.map((option, i) => {
            let borderClass = 'border-green-darkest/50 hover:border-green/50';
            let bgClass = 'bg-surface-light';

            if (isAnswered) {
              if (option === current.correctAnswer) {
                borderClass = 'border-[#73C088]';
                bgClass = 'bg-[#73C088]/10';
              } else if (option === selectedAnswer && !isCorrect) {
                borderClass = 'border-red-500';
                bgClass = 'bg-red-500/10';
              } else {
                borderClass = 'border-green-darkest/30';
                bgClass = 'bg-surface-light opacity-50';
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(option)}
                disabled={isAnswered}
                className={`w-full text-left p-3 rounded-lg border ${borderClass} ${bgClass} transition-all duration-200 ${
                  !isAnswered ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <span
                  className={`${
                    option.match(/[\u0590-\u05FF]/) ? 'hebrew text-lg text-green' : 'text-green-lightest'
                  }`}
                >
                  {option}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {isAnswered && current.explanation && (
        <div
          className={`mt-4 p-3 rounded-lg border ${
            isCorrect ? 'border-[#73C088]/50 bg-[#73C088]/5' : 'border-red-500/50 bg-red-500/5'
          }`}
        >
          <p className="text-sm font-medium mb-1">
            {isCorrect ? (
              <span className="text-[#73C088]">Correct!</span>
            ) : (
              <span className="text-red-400">Helaas, dat is niet juist.</span>
            )}
          </p>
          <p className="text-sm text-green-light/60">{current.explanation}</p>
        </div>
      )}

      {isAnswered && (
        <button
          onClick={handleNext}
          className="gradient-green mt-4 px-6 py-2 rounded-lg font-medium text-white"
        >
          {currentIndex < exercises.length - 1 ? 'Volgende' : 'Bekijk resultaat'}
        </button>
      )}
    </div>
  );
}
