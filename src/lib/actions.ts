"use server";

import { sql } from "@/lib/db";
import { createSession, getSession, deleteSession } from "@/lib/auth";
import { hash, compare } from "bcryptjs";
import type { ProgressData, ReviewCard } from "@/lib/spaced-repetition";

// ─── Auth Actions ───

export async function registerAction(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return { success: false, error: "Dit e-mailadres is al geregistreerd." };
    }

    const passwordHash = await hash(password, 12);
    const result = await sql`
      INSERT INTO users (email, password_hash)
      VALUES (${email}, ${passwordHash})
      RETURNING id
    `;

    await createSession(result[0].id, email);
    return { success: true };
  } catch (err) {
    console.error("Register error:", err);
    return { success: false, error: "Registratie mislukt. Probeer het opnieuw." };
  }
}

export async function loginAction(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const rows = await sql`
      SELECT id, password_hash FROM users WHERE email = ${email}
    `;
    if (rows.length === 0) {
      return { success: false, error: "Ongeldig e-mailadres of wachtwoord." };
    }

    const valid = await compare(password, rows[0].password_hash);
    if (!valid) {
      return { success: false, error: "Ongeldig e-mailadres of wachtwoord." };
    }

    await createSession(rows[0].id, email);
    return { success: true };
  } catch (err) {
    console.error("Login error:", err);
    return { success: false, error: "Inloggen mislukt. Probeer het opnieuw." };
  }
}

export async function logoutAction(): Promise<void> {
  await deleteSession();
}

export async function getSessionAction(): Promise<{
  userId: string;
  email: string;
} | null> {
  return getSession();
}

// ─── Sync Actions ───

export async function syncProgressAction(
  progress: ProgressData
): Promise<void> {
  const session = await getSession();
  if (!session) return;

  const userId = session.userId;

  // Sync cards using INSERT ... ON CONFLICT DO UPDATE (real upsert)
  const cards = Object.values(progress.cards);
  for (const card of cards) {
    await sql`
      INSERT INTO user_progress (user_id, card_id, ease_factor, interval_days, repetitions, next_review, last_review)
      VALUES (${userId}, ${card.id}, ${card.easeFactor}, ${card.interval}, ${card.repetitions}, ${card.nextReview}, ${card.lastReview ?? null})
      ON CONFLICT (user_id, card_id)
      DO UPDATE SET
        ease_factor = ${card.easeFactor},
        interval_days = ${card.interval},
        repetitions = ${card.repetitions},
        next_review = ${card.nextReview},
        last_review = ${card.lastReview ?? null}
    `;
  }

  // Sync stats
  const s = progress.stats;
  await sql`
    INSERT INTO user_stats (user_id, total_reviewed, streak, last_study_date, words_learned, letters_learned, grammar_completed)
    VALUES (${userId}, ${s.totalReviewed}, ${s.streak}, ${s.lastStudyDate || null}, ${s.wordsLearned}, ${s.lettersLearned}, ${JSON.stringify(s.grammarCompleted ?? [])})
    ON CONFLICT (user_id)
    DO UPDATE SET
      total_reviewed = ${s.totalReviewed},
      streak = ${s.streak},
      last_study_date = ${s.lastStudyDate || null},
      words_learned = ${s.wordsLearned},
      letters_learned = ${s.lettersLearned},
      grammar_completed = ${JSON.stringify(s.grammarCompleted ?? [])}
  `;
}

export async function loadProgressAction(): Promise<ProgressData> {
  const session = await getSession();
  if (!session) {
    return {
      cards: {},
      stats: {
        totalReviewed: 0,
        streak: 0,
        lastStudyDate: "",
        wordsLearned: 0,
        lettersLearned: 0,
        grammarCompleted: [],
      },
    };
  }

  const userId = session.userId;

  // Load cards
  const cardRows = await sql`
    SELECT card_id, ease_factor, interval_days, repetitions, next_review, last_review
    FROM user_progress WHERE user_id = ${userId}
  `;

  const cards: Record<string, ReviewCard> = {};
  for (const row of cardRows) {
    cards[row.card_id] = {
      id: row.card_id,
      easeFactor: Number(row.ease_factor),
      interval: row.interval_days,
      repetitions: row.repetitions,
      nextReview: row.next_review,
      lastReview: row.last_review ?? undefined,
    };
  }

  // Load stats
  const statsRows = await sql`
    SELECT total_reviewed, streak, last_study_date, words_learned, letters_learned, grammar_completed
    FROM user_stats WHERE user_id = ${userId}
  `;

  const statsRow = statsRows[0];
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
