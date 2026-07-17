-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query)
-- Adds the case_studies table used by the admin "Manage Case Studies" section.
--
-- Each row is linked to one of the EXISTING project cards via `project_id`,
-- which matches the `id` field of an entry in the `projects` array in
-- src/components/FeaturedProjects.jsx (e.g. 'analytics', 'blockchain',
-- 'zenith', 'velocity', 'app-dev', 'crm-system', 'hubspot'). This table does
-- NOT store the project cards themselves — those stay exactly as they are
-- in the frontend code. This table only stores the extra case-study content
-- shown on that project's dedicated /projects/:projectId/case-study page.

create table if not exists public.case_studies (
  id uuid primary key default gen_random_uuid(),
  project_id text not null unique,          -- matches an id in the static `projects` array
  client_type text not null default '',
  region text not null default '',
  tech_stack text not null default '',      -- e.g. "Tally + Custom Web Platform"
  summary text not null default '',         -- main intro paragraph
  challenges jsonb not null default '[]',   -- [{ "title": "...", "description": "..." }, ...]
  solutions jsonb not null default '[]',    -- [{ "title": "...", "description": "..." }, ...]
  process_steps jsonb not null default '[]',-- ["Step one text", "Step two text", ...]
  outcomes jsonb not null default '[]',     -- [{ "title": "...", "description": "..." }, ...]
  pdf_url text,                             -- link used by the "Download Case Study Report" button
  status text not null default 'draft',     -- draft | published
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists case_studies_project_id_idx on public.case_studies (project_id);
create index if not exists case_studies_status_idx on public.case_studies (status);

-- Row Level Security: same pattern as every other table in this project.
-- The backend talks to Supabase using the service_role key, which bypasses
-- RLS, so this stays fully closed to the public/anon key. All reads/writes
-- happen only through the Express /api/case-studies and
-- /api/admin/case-studies endpoints.
alter table public.case_studies enable row level security;

-- (No policies are created on purpose — anon/public has zero access.
--  Only the service_role key, used exclusively by the Express server, can read/write.)

-- Keeps updated_at current on every edit.
create or replace function public.set_case_studies_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists case_studies_set_updated_at on public.case_studies;
create trigger case_studies_set_updated_at
  before update on public.case_studies
  for each row
  execute function public.set_case_studies_updated_at();