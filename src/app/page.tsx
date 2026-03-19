"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProgress, type ProgressData } from "@/lib/spaced-repetition";

const modules = [
  {
    href: "/alefbet",
    title: "Het Alefbet",
    description: "Leer de 22 Hebreeuwse letters, eindletters, en klinkertekens (nikkud) herkennen.",
    icon: "א",
    gradient: "gradient-green",
    progressKey: "lettersLearned",
    total: 22,
  },
  {
    href: "/woordenschat",
    title: "Woordenschat",
    description: "De 500 meest voorkomende woorden in de Hebreeuwse Bijbel met flashcards.",
    icon: "📚",
    gradient: "gradient-green-light",
    progressKey: "wordsLearned",
    total: 500,
  },
  {
    href: "/grammatica",
    title: "Grammatica",
    description: "Werkwoordsstammen, vervoegingen, constructus en meer.",
    icon: "📖",
    gradient: "gradient-green",
    progressKey: null,
    total: 20,
  },
  {
    href: "/bijbel",
    title: "Bijbeltekst lezen",
    description: "Lees Genesis woord voor woord met grammaticale analyse.",
    icon: "📜",
    gradient: "gradient-green-light",
    progressKey: null,
    total: null,
  },
];

export default function Dashboard() {
  const [progress, setProgress] = useState<ProgressData | null>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-10 gradient-hero rounded-2xl py-12 px-6">
        <h1 className="text-4xl font-bold text-green-lightest mb-2">
          <span className="hebrew text-5xl text-green">עִבְרִית</span>
        </h1>
        <h2 className="text-2xl font-semibold text-green-light mb-2">
          Bijbels Hebreeuws Leren
        </h2>
        <p className="text-green-light/60 max-w-lg mx-auto">
          Leer stap voor stap de Hebreeuwse Bijbel lezen. Begin met het alfabet
          en werk je weg naar het lezen van echte bijbelteksten.
        </p>
      </div>

      {progress && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Dagen streak" value={progress.stats.streak} icon="🔥" />
          <StatCard label="Letters geleerd" value={progress.stats.lettersLearned} icon="א" />
          <StatCard label="Woorden geleerd" value={progress.stats.wordsLearned} icon="📝" />
          <StatCard label="Totaal geoefend" value={progress.stats.totalReviewed} icon="✓" />
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {modules.map((mod) => (
          <Link
            key={mod.href}
            href={mod.href}
            className="group block gradient-card rounded-xl border border-green-darkest/50 p-6 shadow-lg shadow-black/20 hover:border-green-dark/70 hover:shadow-green-darkest/30 transition-all"
          >
            <div className="flex items-start gap-4">
              <div
                className={`${mod.gradient} text-white w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-md`}
              >
                {mod.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-lightest group-hover:text-green-light transition-colors">
                  {mod.title}
                </h3>
                <p className="text-sm text-green-light/50 mt-1">
                  {mod.description}
                </p>
                {progress && mod.progressKey && mod.total && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-green-light/40 mb-1">
                      <span>Voortgang</span>
                      <span>
                        {progress.stats[mod.progressKey as keyof typeof progress.stats] as number} / {mod.total}
                      </span>
                    </div>
                    <div className="w-full bg-surface rounded-full h-2">
                      <div
                        className="gradient-green-light h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            ((progress.stats[mod.progressKey as keyof typeof progress.stats] as number) /
                              mod.total) *
                              100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 gradient-card border border-green-darkest/50 rounded-xl p-6">
        <h3 className="font-semibold text-green-lightest mb-3">
          Aanbevolen leerpad
        </h3>
        <div className="flex items-center gap-3 text-sm flex-wrap">
          <span className="bg-green-darkest/60 text-green-light px-3 py-1.5 rounded-full font-medium border border-green-dark/30">
            1. Alefbet
          </span>
          <span className="text-green-dark">→</span>
          <span className="bg-green-darkest/60 text-green-light px-3 py-1.5 rounded-full font-medium border border-green-dark/30">
            2. Woordenschat
          </span>
          <span className="text-green-dark">→</span>
          <span className="bg-green-darkest/60 text-green-light px-3 py-1.5 rounded-full font-medium border border-green-dark/30">
            3. Grammatica
          </span>
          <span className="text-green-dark">→</span>
          <span className="bg-green-darkest/60 text-green-light px-3 py-1.5 rounded-full font-medium border border-green-dark/30">
            4. Bijbeltekst
          </span>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="gradient-card rounded-xl border border-green-darkest/50 p-4 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-green-lightest">{value}</div>
      <div className="text-xs text-green-light/40">{label}</div>
    </div>
  );
}
