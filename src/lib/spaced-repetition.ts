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

// All scheduling works on calendar dates in the user's LOCAL timezone.
// Using toISOString() (UTC) here caused "today"/streak/due-date to drift by a
// day for users east/west of UTC (e.g. evening study in NL rolled to tomorrow).

/** Format a Date as a local YYYY-MM-DD string. */
export function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Today's date as a local YYYY-MM-DD string. */
export function todayLocal(): string {
  return toLocalDateString(new Date());
}

/** Local YYYY-MM-DD string `days` days from today. */
export function localDatePlusDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toLocalDateString(date);
}

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

  return {
    ...card,
    easeFactor,
    interval,
    repetitions,
    nextReview: localDatePlusDays(interval),
    lastReview: todayLocal(),
  };
}

export function isDueForReview(card: ReviewCard): boolean {
  return card.nextReview <= todayLocal();
}

export function createNewCard(id: string): ReviewCard {
  return {
    id,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: todayLocal(),
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
    completedStacks?: number[];
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
  const today = todayLocal();
  const yesterday = localDatePlusDays(-1);

  // Already studied today — nothing to update.
  if (progress.stats.lastStudyDate === today) {
    return progress;
  }

  // Continue the streak if the last study day was yesterday, otherwise reset.
  const streak = progress.stats.lastStudyDate === yesterday
    ? progress.stats.streak + 1
    : 1;

  // Return a new object instead of mutating the input, so React state updates
  // stay predictable.
  return {
    ...progress,
    stats: {
      ...progress.stats,
      streak,
      lastStudyDate: today,
    },
  };
}

/** Number of cards currently due for review, optionally filtered by id prefix. */
export function countDueCards(
  cards: Record<string, ReviewCard>,
  idPrefix?: string
): number {
  return Object.values(cards).filter(
    (card) =>
      (!idPrefix || card.id.startsWith(idPrefix)) && isDueForReview(card)
  ).length;
}

/** Cards due for review (oldest scheduled first), optionally filtered by prefix. */
export function getDueCards(
  cards: Record<string, ReviewCard>,
  idPrefix?: string
): ReviewCard[] {
  return Object.values(cards)
    .filter(
      (card) =>
        (!idPrefix || card.id.startsWith(idPrefix)) && isDueForReview(card)
    )
    .sort((a, b) => a.nextReview.localeCompare(b.nextReview));
}
