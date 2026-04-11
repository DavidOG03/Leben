-- Migration: create ai_usage and ai_cache tables for server-side rate limiting and caching
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- ── ai_usage ──────────────────────────────────────────────────────────────────
-- Tracks every AI call per user per day so we can enforce a daily usage cap.

create table if not exists public.ai_usage (
  id         bigint generated always as identity primary key,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  date       date        not null default current_date,
  feature    text        not null, -- e.g. 'morning_brief' | 'daily_plan'
  created_at timestamptz not null default now()
);

-- Index to make the "count calls today" query fast
create index if not exists ai_usage_user_date_idx
  on public.ai_usage (user_id, date);

-- RLS: users can only read/insert their own rows
alter table public.ai_usage enable row level security;

create policy "Users can insert own ai_usage"
  on public.ai_usage for insert
  with check (auth.uid() = user_id);

create policy "Users can view own ai_usage"
  on public.ai_usage for select
  using (auth.uid() = user_id);


-- ── ai_cache ──────────────────────────────────────────────────────────────────
-- Stores the last AI result per user per feature per day.
-- On cache hit the server returns the stored result without calling Gemini.

create table if not exists public.ai_cache (
  id         bigint generated always as identity primary key,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  feature    text        not null, -- e.g. 'morning_brief' | 'daily_plan'
  date       date        not null default current_date,
  result     text        not null, -- raw JSON string returned by Gemini
  created_at timestamptz not null default now(),

  -- One cached result per user/feature/day
  unique (user_id, feature, date)
);

-- Index to make cache lookups fast
create index if not exists ai_cache_user_feature_date_idx
  on public.ai_cache (user_id, feature, date);

-- RLS: users can only read/write their own cached results
alter table public.ai_cache enable row level security;

create policy "Users can upsert own ai_cache"
  on public.ai_cache for insert
  with check (auth.uid() = user_id);

create policy "Users can update own ai_cache"
  on public.ai_cache for update
  using (auth.uid() = user_id);

create policy "Users can view own ai_cache"
  on public.ai_cache for select
  using (auth.uid() = user_id);
