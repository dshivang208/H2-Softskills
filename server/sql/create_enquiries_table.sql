-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query)

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'new',       -- new | read | replied
  email_sent boolean not null default false,
  created_at timestamptz not null default now()
);

-- Row Level Security: keep the table locked down from the browser.
-- The backend talks to Supabase using the service_role key, which bypasses RLS,
-- so the table can stay fully closed to the public/anon key.
alter table public.enquiries enable row level security;

-- (No policies are created on purpose — anon/public has zero access.
--  Only the service_role key, used exclusively by the Express server, can read/write.)
