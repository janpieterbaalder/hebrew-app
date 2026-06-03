"use client";

import Link from "next/link";
import { vocabulary, type VocabWord } from "@/data/vocabulary";
import { getDueCards } from "@/lib/spaced-repetition";
import { useProgress } from "@/components/ProgressContext";
import FlashcardSession from "@/components/FlashcardSession";
import { CheckCircleIcon } from "@/components/icons";

const wordById = new Map<number, VocabWord>(vocabulary.map((w) => [w.id, w]));

export default function ReviewPage() {
  const { progress, ready } = useProgress();

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" aria-busy="true" aria-label="Laden">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-green border-t-transparent" />
      </div>
    );
  }

  // Pull the vocab cards that the spaced-repetition schedule says are due
  // today, oldest-scheduled first, and map them back to their words.
  const dueWords = getDueCards(progress.cards, "vocab-")
    .map((card) => wordById.get(Number(card.id.replace("vocab-", ""))))
    .filter((w): w is VocabWord => w !== undefined);

  if (dueWords.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-5">
          <span className="w-20 h-20 rounded-2xl gradient-green flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <CheckCircleIcon className="w-9 h-9" />
          </span>
        </div>
        <h1 className="text-2xl font-bold text-green-lightest mb-2">
          Niets te herhalen
        </h1>
        <p className="text-green-light/70 mb-6 text-sm">
          Je hebt op dit moment geen woorden die herhaald moeten worden. Kom
          later terug, of oefen een nieuwe stapel om woorden toe te voegen aan
          je herhaalschema.
        </p>
        <Link
          href="/woordenschat"
          className="gradient-green text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md"
        >
          Naar woordenschat
        </Link>
      </div>
    );
  }

  return (
    <FlashcardSession
      words={dueWords}
      title="Herhaling"
      subtitle={`Herhalen · ${dueWords.length} woord${dueWords.length !== 1 ? "en" : ""} te herhalen`}
      shuffle={false}
    />
  );
}
