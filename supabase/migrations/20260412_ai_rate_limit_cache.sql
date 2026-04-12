-- Migration: create ai_usage and ai_cache tables for server-side rate limiting and caching
-- This version is IDEMPOTENT (safe to run multiple times)

-- ── 1. ai_usage ──────────────────────────────────────────────────────────────
-- Tracks every AI call per user per day so we can enforce a daily usage cap.

create table if not exists public.ai_usage (
  id         bigint generated always as identity primary key,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  date       date        not null default current_date,
  feature    text        not null,
  tokens     integer     not null default 0,
  created_at timestamptz not null default now()
);

-- Ensure 'tokens' column exists if the table was created previously without it
do $$ 
begin
  if not exists (select 1 from information_schema.columns where table_name='ai_usage' and column_name='tokens') then
    alter table public.ai_usage add column tokens integer not null default 0;
  end if;
end $$;

-- Index
create index if not exists ai_usage_user_date_idx on public.ai_usage (user_id, date);

-- RLS
alter table public.ai_usage enable row level security;

drop policy if exists "Users can insert own ai_usage" on public.ai_usage;
create policy "Users can insert own ai_usage"
  on public.ai_usage for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can view own ai_usage" on public.ai_usage;
create policy "Users can view own ai_usage"
  on public.ai_usage for select
  using (auth.uid() = user_id);


-- ── 2. ai_cache ──────────────────────────────────────────────────────────────
-- Stores the last AI result per user per feature per day.

create table if not exists public.ai_cache (
  id         bigint generated always as identity primary key,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  feature    text        not null,
  date       date        not null default current_date,
  result     text        not null,
  created_at timestamptz not null default now(),
  unique (user_id, feature, date)
);

-- Index
create index if not exists ai_cache_user_feature_date_idx on public.ai_cache (user_id, feature, date);

-- RLS
alter table public.ai_cache enable row level security;

drop policy if exists "Users can upsert own ai_cache" on public.ai_cache;
create policy "Users can upsert own ai_cache"
  on public.ai_cache for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own ai_cache" on public.ai_cache;
create policy "Users can update own ai_cache"
  on public.ai_cache for update
  using (auth.uid() = user_id);

drop policy if exists "Users can view own ai_cache" on public.ai_cache;
create policy "Users can view own ai_cache"
  on public.ai_cache for select
  using (auth.uid() = user_id);
