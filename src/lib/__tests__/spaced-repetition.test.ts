import { describe, it, expect } from "vitest";
import {
  calculateNextReview,
  isDueForReview,
  createNewCard,
  updateStreak,
  countDueCards,
  getDueCards,
  toLocalDateString,
  todayLocal,
  localDatePlusDays,
  type ReviewCard,
  type ProgressData,
} from "../spaced-repetition";

describe("date helpers", () => {
  it("formats a Date as local YYYY-MM-DD", () => {
    expect(toLocalDateString(new Date(2026, 5, 3))).toBe("2026-06-03");
    expect(toLocalDateString(new Date(2026, 0, 9))).toBe("2026-01-09");
  });

  it("todayLocal matches toLocalDateString(now)", () => {
    expect(todayLocal()).toBe(toLocalDateString(new Date()));
  });

  it("localDatePlusDays is consistent with todayLocal", () => {
    expect(localDatePlusDays(0)).toBe(todayLocal());
    expect(localDatePlusDays(1) > todayLocal()).toBe(true);
  });
});

describe("calculateNextReview (SM-2)", () => {
  it("first correct review sets interval 1 and reps 1", () => {
    const next = calculateNextReview(createNewCard("c"), 5);
    expect(next.repetitions).toBe(1);
    expect(next.interval).toBe(1);
    expect(next.nextReview).toBe(localDatePlusDays(1));
    expect(next.lastReview).toBe(todayLocal());
  });

  it("second correct review sets interval 6", () => {
    let card = calculateNextReview(createNewCard("c"), 5);
    card = calculateNextReview(card, 5);
    expect(card.repetitions).toBe(2);
    expect(card.interval).toBe(6);
  });

  it("third correct review multiplies interval by ease factor", () => {
    let card = calculateNextReview(createNewCard("c"), 5);
    card = calculateNextReview(card, 5);
    const ease = card.easeFactor;
    const prevInterval = card.interval;
    card = calculateNextReview(card, 5);
    expect(card.interval).toBe(Math.round(prevInterval * ease));
  });

  it("an incorrect answer resets repetitions and interval", () => {
    let card = calculateNextReview(createNewCard("c"), 5);
    card = calculateNextReview(card, 5); // interval 6, reps 2
    card = calculateNextReview(card, 1); // lapse
    expect(card.repetitions).toBe(0);
    expect(card.interval).toBe(1);
  });

  it("never lets the ease factor drop below 1.3", () => {
    let card = createNewCard("c");
    for (let i = 0; i < 10; i++) card = calculateNextReview(card, 0);
    expect(card.easeFactor).toBeGreaterThanOrEqual(1.3);
  });
});

describe("isDueForReview", () => {
  it("a brand-new card is due today", () => {
    expect(isDueForReview(createNewCard("c"))).toBe(true);
  });

  it("a card scheduled in the future is not due", () => {
    const card: ReviewCard = {
      ...createNewCard("c"),
      nextReview: localDatePlusDays(3),
    };
    expect(isDueForReview(card)).toBe(false);
  });

  it("a card scheduled in the past is due", () => {
    const card: ReviewCard = {
      ...createNewCard("c"),
      nextReview: localDatePlusDays(-2),
    };
    expect(isDueForReview(card)).toBe(true);
  });
});

describe("countDueCards / getDueCards", () => {
  const cards: Record<string, ReviewCard> = {
    "vocab-1": { ...createNewCard("vocab-1"), nextReview: localDatePlusDays(-1) },
    "vocab-2": { ...createNewCard("vocab-2"), nextReview: localDatePlusDays(5) },
    "letter-1": { ...createNewCard("letter-1"), nextReview: localDatePlusDays(-3) },
  };

  it("counts only due cards, optionally filtered by prefix", () => {
    expect(countDueCards(cards)).toBe(2);
    expect(countDueCards(cards, "vocab-")).toBe(1);
    expect(countDueCards(cards, "letter-")).toBe(1);
  });

  it("returns due cards sorted oldest-scheduled first", () => {
    const due = getDueCards(cards);
    expect(due.map((c) => c.id)).toEqual(["letter-1", "vocab-1"]);
  });
});

describe("updateStreak", () => {
  const base = (lastStudyDate: string, streak: number): ProgressData => ({
    cards: {},
    stats: {
      totalReviewed: 0,
      streak,
      lastStudyDate,
      wordsLearned: 0,
      lettersLearned: 0,
    },
  });

  it("increments the streak when the last study day was yesterday", () => {
    const result = updateStreak(base(localDatePlusDays(-1), 4));
    expect(result.stats.streak).toBe(5);
    expect(result.stats.lastStudyDate).toBe(todayLocal());
  });

  it("resets the streak to 1 after a gap", () => {
    const result = updateStreak(base(localDatePlusDays(-3), 9));
    expect(result.stats.streak).toBe(1);
  });

  it("is a no-op when already studied today", () => {
    const input = base(todayLocal(), 7);
    const result = updateStreak(input);
    expect(result.stats.streak).toBe(7);
  });

  it("does not mutate the input object", () => {
    const input = base(localDatePlusDays(-1), 4);
    const result = updateStreak(input);
    expect(input.stats.streak).toBe(4);
    expect(input.stats.lastStudyDate).toBe(localDatePlusDays(-1));
    expect(result).not.toBe(input);
  });
});
