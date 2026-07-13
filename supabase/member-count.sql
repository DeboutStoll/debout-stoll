-- ============================================================================
-- Live member counter for the STATIC site (GitHub Pages)
-- ----------------------------------------------------------------------------
-- Run this in Supabase → SQL Editor (after schema.sql). It exposes ONLY an
-- integer count to the public anon key — never the member rows themselves —
-- so the static site can display a live figure safely from the browser.
-- ============================================================================

create or replace function public.member_count()
returns integer
language sql
security definer
set search_path = public
as $$
  select count(*)::int from public.members;
$$;

-- Let the public (anon) key call it. RLS still hides the rows; this returns
-- only the number.
grant execute on function public.member_count() to anon;

-- ============================================================================
-- Verify:  select public.member_count();
-- The site calls it via  POST {SUPABASE_URL}/rest/v1/rpc/member_count
-- ============================================================================
