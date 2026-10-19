-- ==============================================================================
-- QUDWA 2026 - COMPLETE SUPABASE DATABASE SCHEMA & REALTIME CONFIGURATION
-- ==============================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Go to "SQL Editor" -> Click "New Query"
-- 3. Paste this entire script and click "Run" (green button)
-- ==============================================================================

-- 1. BRAND & THEME SETTINGS
CREATE TABLE IF NOT EXISTS public.fest_brand (
  id TEXT PRIMARY KEY DEFAULT 'active',
  brand_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  theme_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 2. PROGRAM MASTER DEFINITIONS
CREATE TABLE IF NOT EXISTS public.fest_programs (
  id TEXT PRIMARY KEY,
  code TEXT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL,
  stage_type TEXT NOT NULL DEFAULT 'Stage',
  max_score NUMERIC DEFAULT 100,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 3. CATEGORIES
CREATE TABLE IF NOT EXISTS public.fest_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 4. COMPETITION RESULTS & WINNERS
CREATE TABLE IF NOT EXISTS public.fest_competitions (
  id TEXT PRIMARY KEY,
  result_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL,
  stage_type TEXT DEFAULT 'Stage',
  stage TEXT,
  status TEXT NOT NULL DEFAULT 'Upcoming',
  winners JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 5. TEAM STANDINGS & LEADERBOARD
CREATE TABLE IF NOT EXISTS public.fest_standings (
  id TEXT PRIMARY KEY,
  rank INTEGER NOT NULL DEFAULT 1,
  name TEXT NOT NULL UNIQUE,
  points NUMERIC NOT NULL DEFAULT 0,
  gold INTEGER NOT NULL DEFAULT 0,
  silver INTEGER NOT NULL DEFAULT 0,
  bronze INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 6. CANDIDATE PARTICIPANTS
CREATE TABLE IF NOT EXISTS public.fest_participants (
  id TEXT PRIMARY KEY,
  chest_no TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  team TEXT NOT NULL,
  category TEXT NOT NULL,
  dob TEXT,
  events JSONB DEFAULT '[]'::jsonb,
  photo TEXT,
  sector TEXT,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 7. PROGRAM ENTRIES (TEAM REGISTRATIONS)
CREATE TABLE IF NOT EXISTS public.fest_program_entries (
  id TEXT PRIMARY KEY,
  program_id TEXT NOT NULL,
  team TEXT NOT NULL,
  candidate_chest_no TEXT,
  candidate_name TEXT,
  candidate_category TEXT,
  group_members JSONB DEFAULT '[]'::jsonb,
  set_number INTEGER DEFAULT 1,
  submitted_at TEXT,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 8. BULLETINS & ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.fest_notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  time TEXT,
  timestamp BIGINT,
  type TEXT DEFAULT 'announcement',
  tag TEXT DEFAULT 'Official',
  is_pinned BOOLEAN DEFAULT false,
  link TEXT,
  attachment_url TEXT,
  attachment_name TEXT,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 9. SCHEDULE & TIMELINE
CREATE TABLE IF NOT EXISTS public.fest_schedule (
  id TEXT PRIMARY KEY,
  day INTEGER DEFAULT 1,
  date TEXT,
  time TEXT,
  title TEXT NOT NULL,
  category TEXT,
  stage TEXT,
  status TEXT DEFAULT 'Upcoming',
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 10. PHOTO GALLERY
CREATE TABLE IF NOT EXISTS public.fest_gallery (
  id TEXT PRIMARY KEY,
  title TEXT,
  image TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 11. VIDEO HUB
CREATE TABLE IF NOT EXISTS public.fest_videos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  speaker TEXT,
  thumbnail TEXT,
  platform TEXT DEFAULT 'youtube',
  youtube_id TEXT,
  instagram_url TEXT,
  video_url TEXT,
  duration TEXT,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 12. OFFICIAL DOWNLOADS
CREATE TABLE IF NOT EXISTS public.fest_downloads (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  category TEXT DEFAULT 'General',
  file_type TEXT DEFAULT 'PDF',
  url TEXT NOT NULL,
  date TEXT,
  color TEXT DEFAULT 'amber',
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 13. TEAM PORTAL ACCOUNTS
CREATE TABLE IF NOT EXISTS public.fest_team_accounts (
  id TEXT PRIMARY KEY,
  team_name TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 14. ADMIN & REGISTRATION SETTINGS
CREATE TABLE IF NOT EXISTS public.fest_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  registration JSONB DEFAULT '{"isLocked": false, "lockMessage": "Registration is closed", "maxStagePerCandidate": 4, "maxNonStagePerCandidate": 4}'::jsonb,
  admin JSONB DEFAULT '{"username": "admin", "password": "admin@2026"}'::jsonb,
  program_limits JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC/ANON ACCESS POLICIES
-- ==============================================================================
DO $$
DECLARE
  tbl text;
  tbls text[] := ARRAY[
    'fest_brand', 'fest_programs', 'fest_categories', 'fest_competitions',
    'fest_standings', 'fest_participants', 'fest_program_entries',
    'fest_notifications', 'fest_schedule', 'fest_gallery', 'fest_videos',
    'fest_downloads', 'fest_team_accounts', 'fest_settings'
  ];
BEGIN
  FOREACH tbl IN ARRAY tbls LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Public Full Access" ON public.%I;', tbl);
    EXECUTE format('CREATE POLICY "Public Full Access" ON public.%I FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);', tbl);
  END LOOP;
END $$;

-- ==============================================================================
-- ENABLE REALTIME ON CRITICAL FESTIVAL TABLES FOR ARENA TV & LIVE CLIENTS
-- ==============================================================================
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;

ALTER PUBLICATION supabase_realtime ADD TABLE public.fest_competitions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.fest_standings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.fest_notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.fest_brand;
ALTER PUBLICATION supabase_realtime ADD TABLE public.fest_schedule;
ALTER PUBLICATION supabase_realtime ADD TABLE public.fest_downloads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.fest_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.fest_program_entries;
