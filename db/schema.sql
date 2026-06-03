-- Neon (Postgres) schema for the Bijbels Hebreeuws app.
--
-- The app authenticates with its own `users` table + JWT session cookies
-- (see src/lib/auth.ts and src/lib/actions.ts); it does NOT use Supabase Auth
-- or row-level security. The older supabase/migrations file predates the
-- migration to Neon and references auth.users/RLS that do not exist here —
-- this file reflects the schema the application code actually expects.

CREATE EXTENSION IF NOT EXISTS pgcrypto; -- for gen_random_uuid()

-- Accounts
CREATE TABLE IF NOT EXISTS users (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Per-card spaced-repetition state (one row per user + card_id, e.g.
-- "vocab-12" or "letter-3").
CREATE TABLE IF NOT EXISTS user_progress (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  card_id       TEXT NOT NULL,
  ease_factor   NUMERIC(4,2) DEFAULT 2.50,
  interval_days INTEGER DEFAULT 0,
  repetitions   INTEGER DEFAULT 0,
  next_review   DATE DEFAULT CURRENT_DATE,
  last_review   DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, card_id)
);

CREATE INDEX IF NOT EXISTS user_progress_user_id_idx ON user_progress (user_id);

-- Aggregate statistics (one row per user).
CREATE TABLE IF NOT EXISTS user_stats (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  total_reviewed    INTEGER DEFAULT 0,
  streak            INTEGER DEFAULT 0,
  last_study_date   DATE,
  words_learned     INTEGER DEFAULT 0,
  letters_learned   INTEGER DEFAULT 0,
  grammar_completed JSONB DEFAULT '[]'::jsonb, -- array of lesson ids
  completed_stacks  JSONB DEFAULT '[]'::jsonb, -- array of stack numbers
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);
