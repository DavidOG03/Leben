-- ==============================================================================
-- Supabase Schema & Row-Level Security (RLS) for User Notes
-- ==============================================================================

-- 1. Helper trigger function for automatically updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the notes table
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled note',
  content TEXT NOT NULL DEFAULT '',
  notebook TEXT NOT NULL DEFAULT 'General',
  tags TEXT[] NOT NULL DEFAULT '{}',
  pinned BOOLEAN NOT NULL DEFAULT FALSE,
  archived BOOLEAN NOT NULL DEFAULT FALSE,
  trashed BOOLEAN NOT NULL DEFAULT FALSE,
  is_locked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Indexes for Performance & RLS Query Speed
-- Index on user_id ensures RLS policy checks are fast indexed lookups
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON public.notes(user_id);

-- Composite index for listing notes ordered by last modified date
CREATE INDEX IF NOT EXISTS idx_notes_user_updated ON public.notes(user_id, updated_at DESC);

-- Composite index for filter queries (active, trash, archive, pinned)
CREATE INDEX IF NOT EXISTS idx_notes_user_filter ON public.notes(user_id, trashed, archived, pinned);

-- GIN index for fast array searches on tags (e.g. tags @> ARRAY['#Work'])
CREATE INDEX IF NOT EXISTS idx_notes_tags ON public.notes USING GIN (tags);

-- Full-text search index for searching note titles and content
CREATE INDEX IF NOT EXISTS idx_notes_fts ON public.notes USING GIN (
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, ''))
);

-- 4. Trigger to maintain updated_at timestamp
DROP TRIGGER IF EXISTS set_notes_updated_at ON public.notes;
CREATE TRIGGER set_notes_updated_at
  BEFORE UPDATE ON public.notes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 5. Enable and Force Row Level Security (RLS)
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes FORCE ROW LEVEL SECURITY;

-- 6. RLS Policies
-- Using `(SELECT auth.uid())` caches the function call once per statement,
-- adhering to Supabase high-performance RLS best practices.

-- SELECT: Users can only read their own notes
DROP POLICY IF EXISTS "Users can view their own notes" ON public.notes;
CREATE POLICY "Users can view their own notes"
ON public.notes
FOR SELECT
TO authenticated
USING (user_id = (SELECT auth.uid()));

-- INSERT: Users can only insert notes assigned to their own user_id
DROP POLICY IF EXISTS "Users can create their own notes" ON public.notes;
CREATE POLICY "Users can create their own notes"
ON public.notes
FOR INSERT
TO authenticated
WITH CHECK (user_id = (SELECT auth.uid()));

-- UPDATE: Users can only update their own notes
DROP POLICY IF EXISTS "Users can update their own notes" ON public.notes;
CREATE POLICY "Users can update their own notes"
ON public.notes
FOR UPDATE
TO authenticated
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));

-- DELETE: Users can only delete their own notes
DROP POLICY IF EXISTS "Users can delete their own notes" ON public.notes;
CREATE POLICY "Users can delete their own notes"
ON public.notes
FOR DELETE
TO authenticated
USING (user_id = (SELECT auth.uid()));
