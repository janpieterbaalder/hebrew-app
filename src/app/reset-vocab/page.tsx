"use client";

import { useState } from "react";
import Link from "next/link";
import { resetVocabAction } from "@/lib/actions";
import { TrashIcon, CheckCircleIcon } from "@/components/icons";

const STORAGE_KEY = "hebrew-app-progress";

export default function ResetVocabPage() {
  const [status, setStatus] = useState<"idle" | "working" | "done">("idle");

  async function handleReset() {
    setStatus("working");

    // Clear vocab cards + counters from localStorage.
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        const cleanedCards: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(data.cards ?? {})) {
          if (!key.startsWith("vocab-")) cleanedCards[key] = value;
        }
        const cleaned = {
          ...data,
          cards: cleanedCards,
          stats: { ...data.stats, wordsLearned: 0, completedStacks: [] },
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
      } catch {
        // Corrupt local data — ignore and continue with the server reset.
      }
    }

    // Clear it on the server too, otherwise it would be merged back on the
    // next load (and re-appear on other devices).
    await resetVocabAction().catch(() => {});

    setStatus("done");
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      {status === "done" ? (
        <>
          <div className="flex justify-center mb-4">
            <span className="w-16 h-16 rounded-2xl gradient-green flex items-center justify-center text-white shadow-lg shadow-primary/30">
              <CheckCircleIcon className="w-8 h-8" />
            </span>
          </div>
          <h1 className="text-2xl font-bold text-green-lightest mb-2">
            Woordenschat-voortgang gewist
          </h1>
          <p className="text-green-light/60 mb-6 text-sm">
            Vocab-kaarten en woorden-teller zijn verwijderd, zowel in deze
            browser als op de server. Je alefbet-progressie is intact.
          </p>
          <Link
            href="/"
            className="gradient-green text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md"
          >
            Terug naar dashboard
          </Link>
        </>
      ) : (
        <>
          <div className="flex justify-center mb-4">
            <span className="w-16 h-16 rounded-2xl bg-danger/15 border border-danger/30 flex items-center justify-center text-danger">
              <TrashIcon className="w-8 h-8" />
            </span>
          </div>
          <h1 className="text-2xl font-bold text-green-lightest mb-2">
            Woordenschat-voortgang wissen?
          </h1>
          <p className="text-green-light/60 mb-6 text-sm">
            Dit verwijdert al je woordenschat-kaarten en zet de woorden-teller
            op 0. Je alefbet- en grammatica-voortgang blijft behouden. Deze
            actie kan niet ongedaan worden gemaakt.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleReset}
              disabled={status === "working"}
              className="bg-red-900/30 border border-red-500/40 text-red-300 px-6 py-2.5 rounded-lg font-medium hover:bg-red-900/40 transition-colors disabled:opacity-50"
            >
              {status === "working" ? "Bezig..." : "Ja, wissen"}
            </button>
            <Link
              href="/"
              className="bg-surface-light text-green-light border border-green-darkest/50 px-6 py-2.5 rounded-lg font-medium hover:bg-surface-lighter transition-colors"
            >
              Annuleren
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
