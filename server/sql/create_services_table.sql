-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query)
-- Adds the services table used by the admin "Manage Services" section.
-- These are ADDITIONAL services shown on the public /services page —
-- they never touch or replace the hardcoded services already defined in
-- src/components/Services.jsx (which power the Home page carousel and the
-- first set of cards on the Services page).

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  tag text not null default '',
  description text not null,
  image_url text,
  icon text not null default 'Code2',      -- name of a lucide-react icon, see ICON_OPTIONS in src/components/Services.jsx
  stats jsonb not null default '[]'::jsonb, -- e.g. [{"label":"Uptime","value":"99.9%","highlight":"#6ffbbe"}, ...]
  status text not null default 'draft',     -- draft | published
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists services_status_idx on public.services (status);

-- Row Level Security: same pattern as every other table in this project.
-- The backend talks to Supabase using the service_role key, which bypasses
-- RLS, so this stays fully closed to the public/anon key. All reads/writes
-- happen only through the Express /api/services and /api/admin/services
-- endpoints.
alter table public.services enable row level security;

-- (No policies are created on purpose — anon/public has zero access.
--  Only the service_role key, used exclusively by the Express server, can read/write.)

-- Keeps updated_at current on every edit.
create or replace function public.set_services_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at
  before update on public.services
  for each row
  execute function public.set_services_updated_at();