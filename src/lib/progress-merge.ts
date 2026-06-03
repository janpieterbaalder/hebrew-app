import type { ProgressData, ReviewCard } from "@/lib/spaced-repetition";

/**
 * Merge local and remote progress, keeping the most recent review per card.
 */
export function mergeProgress(
  local: ProgressData,
  remote: ProgressData
): ProgressData {
  const mergedCards: Record<string, ReviewCard> = { ...remote.cards };

  for (const [cardId, localCard] of Object.entries(local.cards)) {
    const remoteCard = remote.cards[cardId];

    if (!remoteCard) {
      mergedCards[cardId] = localCard;
    } else {
      const localDate = localCard.lastReview ?? "";
      const remoteDate = remoteCard.lastReview ?? "";

      if (localDate >= remoteDate) {
        mergedCards[cardId] = localCard;
      }
    }
  }

  // Streak and lastStudyDate must stay consistent with each other: take the
  // streak belonging to whichever snapshot studied most recently (rather than
  // Math.max, which could pair a high streak with a stale date).
  const localMoreRecent =
    local.stats.lastStudyDate >= remote.stats.lastStudyDate;
  const lastStudyDate = localMoreRecent
    ? local.stats.lastStudyDate
    : remote.stats.lastStudyDate;
  const streak =
    local.stats.lastStudyDate === remote.stats.lastStudyDate
      ? Math.max(local.stats.streak, remote.stats.streak)
      : localMoreRecent
        ? local.stats.streak
        : remote.stats.streak;

  const mergedStats = {
    totalReviewed: Math.max(
      local.stats.totalReviewed,
      remote.stats.totalReviewed
    ),
    streak,
    lastStudyDate,
    // wordsLearned/lettersLearned are derived counts, so recompute them from
    // the merged cards. Math.max on the stored snapshots could inflate the
    // count past what the actual cards support and never self-correct.
    wordsLearned: countLearned(mergedCards, "vocab-"),
    lettersLearned: countLearned(mergedCards, "letter-"),
    grammarCompleted: mergeStringArrays(
      local.stats.grammarCompleted ?? [],
      remote.stats.grammarCompleted ?? []
    ),
    completedStacks: mergeNumberArrays(
      local.stats.completedStacks ?? [],
      remote.stats.completedStacks ?? []
    ),
  };

  return { cards: mergedCards, stats: mergedStats };
}

// A card counts as "learned" once it has been recalled correctly at least
// twice in a row (repetitions >= 2). Mirrors the definition used in the
// exercise pages.
function countLearned(
  cards: Record<string, ReviewCard>,
  idPrefix: string
): number {
  return Object.values(cards).filter(
    (card) => card.id.startsWith(idPrefix) && card.repetitions >= 2
  ).length;
}

function mergeStringArrays(a: string[], b: string[]): string[] {
  return [...new Set([...a, ...b])];
}

function mergeNumberArrays(a: number[], b: number[]): number[] {
  return [...new Set([...a, ...b])].sort((x, y) => x - y);
}
