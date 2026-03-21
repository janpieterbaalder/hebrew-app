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

  const mergedStats = {
    totalReviewed: Math.max(
      local.stats.totalReviewed,
      remote.stats.totalReviewed
    ),
    streak: Math.max(local.stats.streak, remote.stats.streak),
    lastStudyDate:
      local.stats.lastStudyDate >= remote.stats.lastStudyDate
        ? local.stats.lastStudyDate
        : remote.stats.lastStudyDate,
    wordsLearned: Math.max(
      local.stats.wordsLearned,
      remote.stats.wordsLearned
    ),
    lettersLearned: Math.max(
      local.stats.lettersLearned,
      remote.stats.lettersLearned
    ),
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

function mergeStringArrays(a: string[], b: string[]): string[] {
  return [...new Set([...a, ...b])];
}

function mergeNumberArrays(a: number[], b: number[]): number[] {
  return [...new Set([...a, ...b])].sort((x, y) => x - y);
}
