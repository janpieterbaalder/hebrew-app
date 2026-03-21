"use client";

import Link from "next/link";
import { vocabulary } from "@/data/vocabulary";
import { useProgress } from "@/components/ProgressContext";

const STACK_SIZE = 20;
const NUM_STACKS = Math.ceil(vocabulary.length / STACK_SIZE);

export default function WoordenscatPage() {
  const { progress, ready } = useProgress();

  const completedStackNumbers = ready
    ? (progress.stats.completedStacks ?? [])
    : [];

  const stacks = Array.from({ length: NUM_STACKS }, (_, i) => {
    const stapelNumber = i + 1;
    const words = vocabulary.slice(i * STACK_SIZE, (i + 1) * STACK_SIZE);
    const learned = ready
      ? words.filter((w) => {
          const card = progress.cards[`vocab-${w.id}`];
          return card && card.repetitions >= 2;
        }).length
      : 0;
    const complete = completedStackNumbers.includes(stapelNumber);
    return { index: i, words, learned, complete };
  });

  const totalLearned = stacks.reduce((sum, s) => sum + s.learned, 0);
  const completedStacks = completedStackNumbers.length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-green-lightest">Woordenschat</h1>
          <p className="text-green-light/50 mt-1">
            {vocabulary.length} woorden in {NUM_STACKS} stapels van {STACK_SIZE}
          </p>
        </div>
        {ready && (
          <div className="text-right">
            <div className="text-2xl font-bold text-green">{totalLearned}</div>
            <div className="text-xs text-green-light/40">woorden geleerd</div>
            {completedStacks > 0 && (
              <div className="text-xs text-green mt-0.5">
                {completedStacks} stapel{completedStacks !== 1 ? "s" : ""} voltooid
              </div>
            )}
          </div>
        )}
      </div>

      {/* Overall progress bar */}
      {ready && (
        <div className="mb-6">
          <div className="flex justify-between text-xs text-green-light/40 mb-1">
            <span>Totale voortgang</span>
            <span>{totalLearned} / {vocabulary.length}</span>
          </div>
          <div className="w-full bg-surface rounded-full h-2">
            <div
              className="gradient-green-light h-2 rounded-full transition-all"
              style={{ width: `${(totalLearned / vocabulary.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        {stacks.map(({ index, words, learned, complete }) => {
          const stapelNumber = index + 1;
          const wordStart = index * STACK_SIZE + 1;
          const wordEnd = Math.min((index + 1) * STACK_SIZE, vocabulary.length);

          return (
            <Link
              key={index}
              href={`/woordenschat/oefenen?stapel=${stapelNumber}`}
              className="group flex items-center gap-4 gradient-card rounded-xl border border-green-darkest/50 p-4 hover:border-green-dark/50 hover:shadow-md hover:shadow-green-darkest/20 transition-all"
            >
              {/* Stack number / checkmark */}
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                  complete
                    ? "bg-green text-white"
                    : "gradient-green text-white"
                }`}
              >
                {complete ? "✓" : stapelNumber}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-green-lightest">
                    Stapel {stapelNumber}
                  </span>
                  <span className="text-xs text-green-light/40">
                    woorden {wordStart}–{wordEnd}
                  </span>
                </div>
                {ready ? (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-surface rounded-full h-1.5">
                      <div
                        className="gradient-green-light h-1.5 rounded-full transition-all"
                        style={{ width: `${(learned / words.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-green-light/40 shrink-0 w-10 text-right">
                      {learned}/{words.length}
                    </span>
                  </div>
                ) : (
                  <div className="w-full bg-surface rounded-full h-1.5 animate-pulse" />
                )}
              </div>

              <div className="text-green-dark group-hover:text-green transition-colors shrink-0 text-lg">
                →
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
