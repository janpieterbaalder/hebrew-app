// SM-2 Spaced Repetition Algorithm
// Based on SuperMemo 2 algorithm

export interface ReviewCard {
  id: string;
  easeFactor: number; // >= 1.3
  interval: number; // days
  repetitions: number;
  nextReview: string; // ISO date
  lastReview?: string;
}

export type Quality = 0 | 1 | 2 | 3 | 4 | 5;
// 0 - Complete blackout
// 1 - Incorrect, but upon seeing the answer, remembered
// 2 - Incorrect, but answer seemed easy to recall
// 3 - Correct with serious difficulty
// 4 - Correct with some hesitation
// 5 - Perfect response

export function calculateNextReview(
  card: ReviewCard,
  quality: Quality
): ReviewCard {
  let { easeFactor, interval, repetitions } = card;

  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    // Incorrect response — reset
    repetitions = 0;
    interval = 1;
  }

  // Update ease factor
  easeFactor =
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const now = new Date();
  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    ...card,
    easeFactor,
    interval,
    repetitions,
    nextReview: nextReview.toISOString().split("T")[0],
    lastReview: now.toISOString().split("T")[0],
  };
}

export function isDueForReview(card: ReviewCard): boolean {
  const today = new Date().toISOString().split("T")[0];
  return card.nextReview <= today;
}

export function createNewCard(id: string): ReviewCard {
  return {
    id,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: new Date().toISOString().split("T")[0],
  };
}

// Local storage helpers for progress tracking
const STORAGE_KEY = "hebrew-app-progress";

export interface ProgressData {
  cards: Record<string, ReviewCard>;
  stats: {
    totalReviewed: number;
    streak: number;
    lastStudyDate: string;
    wordsLearned: number;
    lettersLearned: number;
    grammarCompleted?: string[];
  };
}

export function getProgress(): ProgressData {
  if (typeof window === "undefined") {
    return getDefaultProgress();
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return getDefaultProgress();
  try {
    return JSON.parse(stored);
  } catch {
    return getDefaultProgress();
  }
}

export function saveProgress(data: ProgressData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  // Auto-sync to server if user is logged in
  import("@/lib/actions").then(({ syncProgressAction }) => {
    syncProgressAction(data).catch((err) =>
      console.error("Auto-sync failed:", err)
    );
  });
}

function getDefaultProgress(): ProgressData {
  return {
    cards: {},
    stats: {
      totalReviewed: 0,
      streak: 0,
      lastStudyDate: "",
      wordsLearned: 0,
      lettersLearned: 0,
    },
  };
}

export function updateStreak(progress: ProgressData): ProgressData {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000)
    .toISOString()
    .split("T")[0];

  if (progress.stats.lastStudyDate === today) {
    return progress;
  }

  if (progress.stats.lastStudyDate === yesterday) {
    progress.stats.streak += 1;
  } else if (progress.stats.lastStudyDate !== today) {
    progress.stats.streak = 1;
  }

  progress.stats.lastStudyDate = today;
  return progress;
}
