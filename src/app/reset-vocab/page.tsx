"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ResetVocabPage() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const STORAGE_KEY = "hebrew-app-progress";
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
      const data = JSON.parse(raw);

      // Verwijder alle vocab-kaarten
      const cleanedCards: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(data.cards ?? {})) {
        if (!key.startsWith("vocab-")) {
          cleanedCards[key] = value;
        }
      }

      // Reset words_learned naar 0
      const cleaned = {
        ...data,
        cards: cleanedCards,
        stats: {
          ...data.stats,
          wordsLearned: 0,
        },
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    }

    setDone(true);
  }, []);

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      {done ? (
        <>
          <div className="text-5xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-green-lightest mb-2">
            Woordenschat-voortgang gewist
          </h1>
          <p className="text-green-light/60 mb-6 text-sm">
            Vocab-kaarten en woorden-teller zijn verwijderd uit deze browser.
            Je alefbet-progressie is intact.
          </p>
          <Link
            href="/"
            className="gradient-green text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md"
          >
            Terug naar dashboard
          </Link>
        </>
      ) : (
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-green border-t-transparent mx-auto" />
      )}
    </div>
  );
}
