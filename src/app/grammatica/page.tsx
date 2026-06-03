"use client";

import Link from "next/link";
import { grammarLessons } from "@/data/grammar";
import { useProgress } from "@/components/ProgressContext";
import { CheckIcon, ChevronRightIcon } from "@/components/icons";

export default function GrammaticaPage() {
  const { progress, ready } = useProgress();
  const completed = ready ? (progress.stats.grammarCompleted ?? []) : [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-green-lightest">Grammatica</h1>
        <p className="text-green-light/50 mt-1">
          Leer de basisgrammatica van Bijbels Hebreeuws
        </p>
        {ready && completed.length > 0 && (
          <p className="text-sm text-green mt-1">
            {completed.length} van {grammarLessons.length} lessen voltooid
          </p>
        )}
      </div>

      <div className="space-y-3">
        {grammarLessons
          .sort((a, b) => a.order - b.order)
          .map((lesson, index) => {
            const isDone = completed.includes(lesson.id);
            return (
              <Link
                key={lesson.id}
                href={`/grammatica/${lesson.id}`}
                className="group block gradient-card rounded-xl border border-green-darkest/50 p-5 hover:shadow-lg hover:shadow-green-darkest/30 hover:border-green-dark/50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold shrink-0 ${
                      isDone ? "bg-primary/20 text-green border border-green-dark/40" : "gradient-green text-white"
                    }`}
                  >
                    {isDone ? <CheckIcon className="w-5 h-5" /> : index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-green-lightest group-hover:text-green-light transition-colors">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-green-light/40 mt-0.5">
                      {lesson.summary}
                    </p>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-green-dark group-hover:text-green transition-colors shrink-0" />
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
