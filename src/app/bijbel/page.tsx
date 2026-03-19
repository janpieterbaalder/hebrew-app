"use client";

import Link from "next/link";
import { genesisVerses } from "@/data/genesis";

export default function BijbelPage() {
  const chapters = [...new Set(genesisVerses.map((v) => v.chapter))];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-green-lightest">Bijbeltekst lezen</h1>
        <p className="text-green-light/50 mt-1">
          Lees de Hebreeuwse Bijbel woord voor woord met grammaticale analyse
        </p>
      </div>

      <div className="gradient-card rounded-xl border border-green-darkest/50 p-6 mb-6">
        <h2 className="text-xl font-semibold text-green-lightest mb-2">
          <span className="hebrew text-2xl text-green">בְּרֵאשִׁית</span>{" "}
          Genesis
        </h2>
        <p className="text-green-light/50 text-sm mb-4">
          Begin met het eerste boek van de Bijbel. Elk vers bevat
          woord-voor-woord analyse met grammaticale informatie.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {chapters.map((chapter) => {
            const verseCount = genesisVerses.filter((v) => v.chapter === chapter).length;
            return (
              <Link
                key={chapter}
                href={`/bijbel/genesis/${chapter}`}
                className="bg-green-darkest/30 border border-green-dark/30 rounded-lg p-4 text-center hover:bg-green-darkest/50 hover:border-green-dark/50 transition-colors"
              >
                <div className="text-2xl font-bold text-green">{chapter}</div>
                <div className="text-xs text-green-light/40">{verseCount} verzen</div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="gradient-card border border-green-darkest/50 rounded-xl p-6">
        <h3 className="font-semibold text-green-lightest mb-2">
          Hoe gebruik je de bijbellezer?
        </h3>
        <ul className="text-sm text-green-light/50 space-y-2">
          <li><strong className="text-green-light">Klik op een woord</strong> om de volledige grammaticale analyse te zien</li>
          <li><strong className="text-green-light">Transliteratie</strong> staat onder elk Hebreeuws woord</li>
          <li><strong className="text-green-light">Grammatica-info</strong> bevat de werkwoordsvorm, stam, naamval, etc.</li>
          <li>Begin bij Genesis 1:1 en werk stap voor stap door de tekst</li>
        </ul>
      </div>
    </div>
  );
}
