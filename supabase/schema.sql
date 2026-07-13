-- ============================================================================
-- Debout, Stoll !  —  Supabase schema (ready to run)
-- ----------------------------------------------------------------------------
-- HOW TO RUN
--   Supabase dashboard → SQL Editor → New query → paste this whole file → Run.
--   Safe to run more than once: every statement is idempotent (IF NOT EXISTS /
--   ON CONFLICT), so re-running never errors and never drops your data.
--
-- WHAT IT CREATES
--   • table  members          — alumni network sign-ups        (lib/db.ts)
--   • table  contributions     — moderated memory submissions   (lib/db.ts)
--   • storage bucket "contributions" (private) for uploaded files
--   • Row Level Security ON, with NO public policy → the tables are writable
--     only by the server-side service_role key. The public/anon key cannot read
--     or write them. This is the intended security model.
-- ============================================================================

-- gen_random_uuid() lives in pgcrypto (already enabled on Supabase, but make
-- sure so this file also works on a bare Postgres).
create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- 1. Members  —  the alumni network sign-ups
-- ----------------------------------------------------------------------------
create table if not exists public.members (
  id          uuid primary key default gen_random_uuid(),
  name        text        not null,
  promotion   text,
  city        text,
  email       text        not null,
  message     text,
  locale      text        not null default 'fr',
  created_at  timestamptz not null default now()
);

-- One membership per email address (case-insensitive). Enforced at the DB level
-- so duplicates are impossible regardless of app instances or race conditions.
create unique index if not exists members_email_uidx
  on public.members (lower(email));

-- Fast "most recent first" listing / CSV export.
create index if not exists members_created_at_idx
  on public.members (created_at desc);

-- ----------------------------------------------------------------------------
-- 2. Contributions  —  the memory submissions moderation queue
-- ----------------------------------------------------------------------------
create table if not exists public.contributions (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  email       text        not null,
  kind        text        not null default 'photo',
  title       text        not null,
  story       text,
  file_url    text,
  status      text        not null default 'pending',   -- pending | published | rejected
  locale      text        not null default 'fr',
  created_at  timestamptz not null default now(),
  constraint contributions_status_chk
    check (status in ('pending', 'published', 'rejected'))
);

-- Moderation view: pull the pending queue quickly, newest first.
create index if not exists contributions_status_created_idx
  on public.contributions (status, created_at desc);

-- ----------------------------------------------------------------------------
-- 3. Row Level Security
-- ----------------------------------------------------------------------------
-- Enable RLS and deliberately create NO policy. With RLS on and no policy, the
-- anon/public key is fully denied. The service_role key used by the server
-- (app/api/*, lib/db.ts) BYPASSES RLS, so the app keeps full access while the
-- browser has none. Never expose the service_role key to the client.
alter table public.members       enable row level security;
alter table public.contributions enable row level security;

-- ----------------------------------------------------------------------------
-- 4. Storage bucket for uploaded contribution files (private)
-- ----------------------------------------------------------------------------
-- Uploads land here (under a pending/ prefix). Files stay private until you
-- moderate them (see DEPLOIEMENT.md §13). Must match SUPABASE_BUCKET.
insert into storage.buckets (id, name, public)
values ('contributions', 'contributions', false)
on conflict (id) do nothing;

-- ============================================================================
-- Done. Verify:  select count(*) from public.members;
-- Export CSV:    Table Editor → members → Export → CSV
-- ============================================================================
