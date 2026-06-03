"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { vocabulary } from "@/data/vocabulary";
import { useProgress } from "@/components/ProgressContext";
import FlashcardSession from "@/components/FlashcardSession";

const STACK_SIZE = 20;
const NUM_STACKS = Math.ceil(vocabulary.length / STACK_SIZE);

function StackPractice({ stapelNumber }: { stapelNumber: number }) {
  const { ready } = useProgress();

  const wordStart = (stapelNumber - 1) * STACK_SIZE;
  const wordEnd = Math.min(wordStart + STACK_SIZE, vocabulary.length);
  const words = vocabulary.slice(wordStart, wordEnd);

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" aria-busy="true" aria-label="Laden">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-green border-t-transparent" />
      </div>
    );
  }

  return (
    <FlashcardSession
      key={stapelNumber}
      words={words}
      title={`Stapel ${stapelNumber}`}
      subtitle={`Stapel ${stapelNumber} · woorden ${wordStart + 1}–${wordEnd}`}
      stapelNumber={stapelNumber}
      totalStacks={NUM_STACKS}
    />
  );
}

function StackPracticeLoader() {
  const searchParams = useSearchParams();
  const stapelParam = searchParams.get("stapel");
  const stapelNumber = stapelParam
    ? Math.max(1, Math.min(NUM_STACKS, parseInt(stapelParam, 10)))
    : 1;

  return <StackPractice key={stapelNumber} stapelNumber={stapelNumber} />;
}

// useSearchParams() needs a Suspense boundary in Next.js App Router
export default function FlashcardPractice() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]" aria-busy="true" aria-label="Laden">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-green border-t-transparent" />
        </div>
      }
    >
      <StackPracticeLoader />
    </Suspense>
  );
}
