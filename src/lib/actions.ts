"use server";

import { sql } from "@/lib/db";
import { createSession, getSession, deleteSession } from "@/lib/auth";
import { hash, compare } from "bcryptjs";
import type { ProgressData, ReviewCard } from "@/lib/spaced-repetition";

// ─── Auth Actions ───

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

// Normalise emails so logins are case-insensitive and free of stray
// whitespace, preventing accidental duplicate accounts (e.g. "A@x.nl"
// vs "a@x.nl").
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function registerAction(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const normalizedEmail = normalizeEmail(email);

  if (!EMAIL_REGEX.test(normalizedEmail)) {
    return { success: false, error: "Voer een geldig e-mailadres in." };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      success: false,
      error: `Wachtwoord moet minimaal ${MIN_PASSWORD_LENGTH} tekens bevatten.`,
    };
  }

  try {
    const existing = await sql`SELECT id FROM users WHERE email = ${normalizedEmail}`;
    if (existing.length > 0) {
      return { success: false, error: "Dit e-mailadres is al geregistreerd." };
    }

    const passwordHash = await hash(password, 12);
    const result = await sql`
      INSERT INTO users (email, password_hash)
      VALUES (${normalizedEmail}, ${passwordHash})
      RETURNING id
    `;

    await createSession(result[0].id, normalizedEmail);
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
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password) {
    return { success: false, error: "Vul je e-mailadres en wachtwoord in." };
  }

  try {
    const rows = await sql`
      SELECT id, password_hash FROM users WHERE email = ${normalizedEmail}
    `;
    if (rows.length === 0) {
      return { success: false, error: "Ongeldig e-mailadres of wachtwoord." };
    }

    const valid = await compare(password, rows[0].password_hash);
    if (!valid) {
      return { success: false, error: "Ongeldig e-mailadres of wachtwoord." };
    }

    await createSession(rows[0].id, normalizedEmail);
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
  const s = progress.stats;

  // Build all card upserts plus the stats upsert and send them as a single
  // batched HTTP transaction. Previously each card was a separate round-trip,
  // so one study session could fire hundreds of sequential queries.
  const queries = Object.values(progress.cards).map(
    (card) => sql`
      INSERT INTO user_progress (user_id, card_id, ease_factor, interval_days, repetitions, next_review, last_review)
      VALUES (${userId}, ${card.id}, ${card.easeFactor}, ${card.interval}, ${card.repetitions}, ${card.nextReview}, ${card.lastReview ?? null})
      ON CONFLICT (user_id, card_id)
      DO UPDATE SET
        ease_factor = ${card.easeFactor},
        interval_days = ${card.interval},
        repetitions = ${card.repetitions},
        next_review = ${card.nextReview},
        last_review = ${card.lastReview ?? null}
    `
  );

  queries.push(sql`
    INSERT INTO user_stats (user_id, total_reviewed, streak, last_study_date, words_learned, letters_learned, grammar_completed, completed_stacks)
    VALUES (${userId}, ${s.totalReviewed}, ${s.streak}, ${s.lastStudyDate || null}, ${s.wordsLearned}, ${s.lettersLearned}, ${JSON.stringify(s.grammarCompleted ?? [])}, ${JSON.stringify(s.completedStacks ?? [])})
    ON CONFLICT (user_id)
    DO UPDATE SET
      total_reviewed = ${s.totalReviewed},
      streak = ${s.streak},
      last_study_date = ${s.lastStudyDate || null},
      words_learned = ${s.wordsLearned},
      letters_learned = ${s.lettersLearned},
      grammar_completed = ${JSON.stringify(s.grammarCompleted ?? [])},
      completed_stacks = ${JSON.stringify(s.completedStacks ?? [])}
  `);

  await sql.transaction(queries);
}

// Clear all vocabulary progress for the signed-in user, both the per-word
// review cards and the words-learned counter. Used by the reset page so the
// reset actually sticks across devices (otherwise the server would re-merge
// the cleared cards back on next load).
export async function resetVocabAction(): Promise<{ success: boolean }> {
  const session = await getSession();
  if (!session) return { success: false };

  await sql`
    DELETE FROM user_progress
    WHERE user_id = ${session.userId} AND card_id LIKE 'vocab-%'
  `;
  await sql`
    UPDATE user_stats SET words_learned = 0, completed_stacks = ${JSON.stringify([])}
    WHERE user_id = ${session.userId}
  `;
  return { success: true };
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
        completedStacks: [],
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
    SELECT total_reviewed, streak, last_study_date, words_learned, letters_learned, grammar_completed, completed_stacks
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
        completedStacks: statsRow.completed_stacks ?? [],
      }
    : {
        totalReviewed: 0,
        streak: 0,
        lastStudyDate: "",
        wordsLearned: 0,
        lettersLearned: 0,
        grammarCompleted: [] as string[],
        completedStacks: [] as number[],
      };

  return { cards, stats };
}
