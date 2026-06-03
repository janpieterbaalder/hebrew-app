import { describe, it, expect } from "vitest";
import { mergeProgress } from "../progress-merge";
import {
  createNewCard,
  type ReviewCard,
  type ProgressData,
} from "../spaced-repetition";

function card(id: string, repetitions: number, lastReview?: string): ReviewCard {
  return { ...createNewCard(id), repetitions, lastReview };
}

function progress(
  cards: ReviewCard[],
  stats: Partial<ProgressData["stats"]> = {}
): ProgressData {
  return {
    cards: Object.fromEntries(cards.map((c) => [c.id, c])),
    stats: {
      totalReviewed: 0,
      streak: 0,
      lastStudyDate: "",
      wordsLearned: 0,
      lettersLearned: 0,
      grammarCompleted: [],
      completedStacks: [],
      ...stats,
    },
  };
}

describe("mergeProgress — cards", () => {
  it("keeps a card that exists only locally", () => {
    const local = progress([card("vocab-1", 1, "2026-06-01")]);
    const remote = progress([]);
    const merged = mergeProgress(local, remote);
    expect(merged.cards["vocab-1"]).toBeDefined();
  });

  it("keeps the more recently reviewed card when present in both", () => {
    const local = progress([card("vocab-1", 3, "2026-06-02")]);
    const remote = progress([card("vocab-1", 1, "2026-06-01")]);
    const merged = mergeProgress(local, remote);
    expect(merged.cards["vocab-1"].repetitions).toBe(3);
  });

  it("prefers the remote card when it was reviewed later", () => {
    const local = progress([card("vocab-1", 1, "2026-06-01")]);
    const remote = progress([card("vocab-1", 4, "2026-06-05")]);
    const merged = mergeProgress(local, remote);
    expect(merged.cards["vocab-1"].repetitions).toBe(4);
  });
});

describe("mergeProgress — derived counts", () => {
  it("recomputes wordsLearned/lettersLearned from merged cards, ignoring inflated snapshots", () => {
    const local = progress(
      [card("vocab-1", 2, "2026-06-02"), card("letter-1", 2, "2026-06-02")],
      { wordsLearned: 999, lettersLearned: 999 }
    );
    const remote = progress([card("vocab-2", 1, "2026-06-01")], {
      wordsLearned: 50,
    });
    const merged = mergeProgress(local, remote);
    // Only vocab-1 and letter-1 reach repetitions >= 2.
    expect(merged.stats.wordsLearned).toBe(1);
    expect(merged.stats.lettersLearned).toBe(1);
  });
});

describe("mergeProgress — streak", () => {
  it("takes the streak from whichever side studied most recently", () => {
    const local = progress([], { streak: 3, lastStudyDate: "2026-06-03" });
    const remote = progress([], { streak: 8, lastStudyDate: "2026-05-01" });
    const merged = mergeProgress(local, remote);
    expect(merged.stats.streak).toBe(3);
    expect(merged.stats.lastStudyDate).toBe("2026-06-03");
  });

  it("takes the max streak when both studied on the same day", () => {
    const local = progress([], { streak: 4, lastStudyDate: "2026-06-03" });
    const remote = progress([], { streak: 6, lastStudyDate: "2026-06-03" });
    const merged = mergeProgress(local, remote);
    expect(merged.stats.streak).toBe(6);
  });
});

describe("mergeProgress — arrays", () => {
  it("unions grammarCompleted and completedStacks", () => {
    const local = progress([], {
      grammarCompleted: ["lidwoord"],
      completedStacks: [1, 3],
    });
    const remote = progress([], {
      grammarCompleted: ["lidwoord", "constructus"],
      completedStacks: [2, 3],
    });
    const merged = mergeProgress(local, remote);
    expect([...merged.stats.grammarCompleted!].sort()).toEqual([
      "constructus",
      "lidwoord",
    ]);
    expect(merged.stats.completedStacks).toEqual([1, 2, 3]);
  });
});
