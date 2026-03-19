"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { genesisVerses, type BibleWord } from "@/data/genesis";

export default function ChapterPage() {
  const params = useParams();
  const chapter = Number(params.chapter);
  const [selectedWord, setSelectedWord] = useState<{
    verse: number;
    word: BibleWord;
  } | null>(null);

  const verses = genesisVerses.filter((v) => v.chapter === chapter);

  if (verses.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-green-lightest mb-4">
          Hoofdstuk nog niet beschikbaar
        </h1>
        <p className="text-green-light/50 mb-6">
          Dit hoofdstuk is nog niet toegevoegd. We beginnen met Genesis 1.
        </p>
        <Link href="/bijbel" className="text-green hover:text-green-light font-medium">
          ← Terug naar overzicht
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/bijbel" className="text-green-light/50 hover:text-green-light text-sm mb-4 inline-block">
        ← Terug naar overzicht
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-green-lightest">
          <span className="hebrew text-3xl text-green">בְּרֵאשִׁית</span>{" "}
          Genesis {chapter}
        </h1>
      </div>

      <div className="space-y-6">
        {verses.map((verse) => (
          <div key={verse.verse} className="gradient-card rounded-xl border border-green-darkest/50 p-6">
            <div className="flex items-start gap-3 mb-4">
              <span className="gradient-green text-white px-2 py-0.5 rounded text-sm font-bold shrink-0">
                {verse.verse}
              </span>
              <div className="hebrew text-2xl text-green-lightest leading-relaxed text-right w-full">
                {verse.hebrew}
              </div>
            </div>

            <div className="text-green-light/50 text-sm mb-4 italic">{verse.dutch}</div>

            <div className="border-t border-green-darkest/30 pt-4">
              <h4 className="text-xs text-green-light/40 uppercase tracking-wide font-semibold mb-3">
                Woord-voor-woord analyse
              </h4>
              <div className="flex flex-wrap gap-2" dir="rtl">
                {verse.words.map((word, wIndex) => (
                  <button
                    key={wIndex}
                    onClick={() =>
                      setSelectedWord(
                        selectedWord?.verse === verse.verse && selectedWord?.word === word
                          ? null
                          : { verse: verse.verse, word }
                      )
                    }
                    className={`rounded-lg p-2 text-center transition-all min-w-[70px] ${
                      selectedWord?.verse === verse.verse && selectedWord?.word === word
                        ? "bg-green-darkest/50 border-2 border-green"
                        : "bg-surface border border-green-darkest/30 hover:border-green-dark/40 hover:bg-surface-light"
                    }`}
                    dir="rtl"
                  >
                    <div className="hebrew text-xl text-green">{word.hebrew}</div>
                    <div className="text-[10px] text-green-light/30 mt-0.5" dir="ltr">
                      {word.transliteration}
                    </div>
                    <div className="text-xs text-green-light/60 font-medium mt-0.5" dir="ltr">
                      {word.dutch}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedWord?.verse === verse.verse && (
              <div className="mt-4 bg-green-darkest/20 border border-green-dark/30 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="hebrew text-3xl text-green">{selectedWord.word.hebrew}</span>
                  <span className="text-green-light/50">({selectedWord.word.transliteration})</span>
                </div>
                <div className="text-lg font-semibold text-green-lightest mb-2">
                  {selectedWord.word.dutch}
                </div>
                {selectedWord.word.grammar && (
                  <div className="text-sm text-green-light/60 mb-1">
                    <span className="font-medium text-green-light">Grammatica: </span>
                    {selectedWord.word.grammar}
                  </div>
                )}
                {selectedWord.word.root && (
                  <div className="text-sm text-green-light/60">
                    <span className="font-medium text-green-light">Wortel: </span>
                    <span className="hebrew text-lg text-green">{selectedWord.word.root}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
