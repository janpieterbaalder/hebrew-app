import { createClient } from "@/lib/supabase/client";
import type { ProgressData, ReviewCard } from "@/lib/spaced-repetition";

/**
 * Upsert all card progress and stats to Supabase for a given user.
 */
export async function syncProgressToSupabase(
  userId: string,
  progress: ProgressData
): Promise<void> {
  const supabase = createClient();

  // Upsert cards to user_progress
  const cards = Object.values(progress.cards);
  if (cards.length > 0) {
    const rows = cards.map((card) => ({
      user_id: userId,
      card_id: card.id,
      ease_factor: card.easeFactor,
      interval_days: card.interval,
      repetitions: card.repetitions,
      next_review: card.nextReview,
      last_review: card.lastReview ?? null,
    }));

    const { error: cardsError } = await supabase
      .from("user_progress")
      .upsert(rows, { onConflict: "user_id,card_id" });

    if (cardsError) {
      console.error("Failed to sync cards:", cardsError.message);
    }
  }

  // Upsert stats to user_stats
  const { error: statsError } = await supabase.from("user_stats").upsert(
    {
      user_id: userId,
      total_reviewed: progress.stats.totalReviewed,
      streak: progress.stats.streak,
      last_study_date: progress.stats.lastStudyDate || null,
      words_learned: progress.stats.wordsLearned,
      letters_learned: progress.stats.lettersLearned,
      grammar_completed: progress.stats.grammarCompleted ?? [],
    },
    { onConflict: "user_id" }
  );

  if (statsError) {
    console.error("Failed to sync stats:", statsError.message);
  }
}

/**
 * Load all progress data from Supabase for a given user.
 */
export async function loadProgressFromSupabase(
  userId: string
): Promise<ProgressData> {
  const supabase = createClient();

  // Load cards
  const { data: cardRows, error: cardsError } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId);

  if (cardsError) {
    console.error("Failed to load cards:", cardsError.message);
  }

  const cards: Record<string, ReviewCard> = {};
  if (cardRows) {
    for (const row of cardRows) {
      cards[row.card_id] = {
        id: row.card_id,
        easeFactor: row.ease_factor,
        interval: row.interval_days,
        repetitions: row.repetitions,
        nextReview: row.next_review,
        lastReview: row.last_review ?? undefined,
      };
    }
  }

  // Load stats
  const { data: statsRow, error: statsError } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (statsError && statsError.code !== "PGRST116") {
    // PGRST116 = no rows found, which is fine for new users
    console.error("Failed to load stats:", statsError.message);
  }

  const stats = statsRow
    ? {
        totalReviewed: statsRow.total_reviewed ?? 0,
        streak: statsRow.streak ?? 0,
        lastStudyDate: statsRow.last_study_date ?? "",
        wordsLearned: statsRow.words_learned ?? 0,
        lettersLearned: statsRow.letters_learned ?? 0,
        grammarCompleted: statsRow.grammar_completed ?? [],
      }
    : {
        totalReviewed: 0,
        streak: 0,
        lastStudyDate: "",
        wordsLearned: 0,
        lettersLearned: 0,
        grammarCompleted: [] as string[],
      };

  return { cards, stats };
}

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
      // Card only exists locally
      mergedCards[cardId] = localCard;
    } else {
      // Both exist: keep the one with the most recent lastReview
      const localDate = localCard.lastReview ?? "";
      const remoteDate = remoteCard.lastReview ?? "";

      if (localDate >= remoteDate) {
        mergedCards[cardId] = localCard;
      }
      // else keep remoteCard (already in mergedCards)
    }
  }

  // Merge stats: pick whichever has more progress
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
  };

  return { cards: mergedCards, stats: mergedStats };
}

/**
 * Merge two string arrays, returning unique values.
 */
function mergeStringArrays(a: string[], b: string[]): string[] {
  return [...new Set([...a, ...b])];
}
