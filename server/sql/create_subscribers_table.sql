-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query)
-- Adds newsletter subscribers + a log of broadcasts sent to them.

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  status text not null default 'active',      -- active | unsubscribed
  source text not null default 'blog',        -- where they signed up (blog page, footer, etc.)
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create index if not exists subscribers_status_idx on public.subscribers (status);

-- Row Level Security: keep the table locked down from the browser, same
-- pattern as the enquiries table. The backend talks to Supabase using the
-- service_role key, which bypasses RLS, so this stays fully closed to the
-- public/anon key. Inserts happen only through the Express /api/newsletter
-- endpoint, never directly from the client.
alter table public.subscribers enable row level security;

-- (No policies are created on purpose — anon/public has zero access.
--  Only the service_role key, used exclusively by the Express server, can read/write.)

create table if not exists public.broadcasts (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  message text not null,
  recipient_count int not null default 0,
  sent_count int not null default 0,
  failed_count int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.broadcasts enable row level security;
-- (No policies on purpose — only the service_role key can read/write.)