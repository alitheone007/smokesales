-- Core Smoke Wholesale tables: customer applications, newsletter signups,
-- and the private storage bucket for resale-certificate uploads. Dedicated
-- Supabase project (jtktjxmntfwbmonvzsle) — not shared with any other app.

create table if not exists public.smoke_wholesale_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  business_name text not null,
  business_phone text not null,
  business_address text not null,
  tax_id text not null,
  certificate_paths text[] not null default '{}',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected'))
);

alter table public.smoke_wholesale_applications enable row level security;

drop policy if exists "applicants can insert their own application" on public.smoke_wholesale_applications;
create policy "applicants can insert their own application"
  on public.smoke_wholesale_applications for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "applicants can read their own application" on public.smoke_wholesale_applications;
create policy "applicants can read their own application"
  on public.smoke_wholesale_applications for select
  to authenticated
  using (auth.uid() = user_id);

create table if not exists public.smoke_wholesale_newsletter (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique
);

alter table public.smoke_wholesale_newsletter enable row level security;

drop policy if exists "anyone can subscribe" on public.smoke_wholesale_newsletter;
create policy "anyone can subscribe"
  on public.smoke_wholesale_newsletter for insert
  to anon, authenticated
  with check (true);

-- Private storage bucket for resale-certificate / licence uploads. Files are
-- stored under <user_id>/<filename>, and the policies below only let a user
-- read or write inside their own folder.
insert into storage.buckets (id, name, public)
values ('smoke-wholesale-licenses', 'smoke-wholesale-licenses', false)
on conflict (id) do nothing;

drop policy if exists "users can upload their own licence files" on storage.objects;
create policy "users can upload their own licence files"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'smoke-wholesale-licenses'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "users can read their own licence files" on storage.objects;
create policy "users can read their own licence files"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'smoke-wholesale-licenses'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
