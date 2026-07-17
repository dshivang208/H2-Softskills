-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query)
-- Adds the blogs table that powers the public /blog page and the
-- admin blog manager at /admin/blogs.

create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  category text not null default 'Web Development',
  image_url text,
  author text not null default 'H2 Softskills Team',
  read_time text not null default '5 min read',
  status text not null default 'draft',       -- draft | published
  is_popular boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blogs_status_idx on public.blogs (status);
create index if not exists blogs_category_idx on public.blogs (category);
create index if not exists blogs_slug_idx on public.blogs (slug);

-- Row Level Security: same pattern as every other table in this project.
-- The backend talks to Supabase using the service_role key, which bypasses
-- RLS, so this stays fully closed to the public/anon key. All reads/writes
-- happen only through the Express /api/blog and /api/admin/blogs endpoints.
alter table public.blogs enable row level security;

-- (No policies are created on purpose — anon/public has zero access.
--  Only the service_role key, used exclusively by the Express server, can read/write.)

-- Keeps updated_at current on every edit.
create or replace function public.set_blogs_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists blogs_set_updated_at on public.blogs;
create trigger blogs_set_updated_at
  before update on public.blogs
  for each row
  execute function public.set_blogs_updated_at();