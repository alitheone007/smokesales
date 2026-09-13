-- Admin role table + orders, for the mock checkout/payment flow and the
-- admin review screen. Everything here is additive to
-- 20260910000000_smoke_wholesale_core.sql.

-- Membership table for "who can see every application/order, not just
-- their own." RLS stays on so a normal user can only ever see whether
-- *they themselves* are a row in here (nobody can enumerate admins) — that
-- one-row visibility is exactly what the EXISTS(...) checks below need.
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

drop policy if exists "a user can check their own admin membership" on public.admins;
create policy "a user can check their own admin membership"
  on public.admins for select
  to authenticated
  using (user_id = auth.uid());

-- Let admins see and update every application, on top of the
-- applicant-only policies already in place.
drop policy if exists "admins can read every application" on public.smoke_wholesale_applications;
create policy "admins can read every application"
  on public.smoke_wholesale_applications for select
  to authenticated
  using (exists (select 1 from public.admins where user_id = auth.uid()));

drop policy if exists "admins can update every application" on public.smoke_wholesale_applications;
create policy "admins can update every application"
  on public.smoke_wholesale_applications for update
  to authenticated
  using (exists (select 1 from public.admins where user_id = auth.uid()));

-- Orders for the mock checkout / test-payment flow. No real money moves
-- through this table — payment_method is always a mock/test rail.
create table if not exists public.smoke_wholesale_orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  items jsonb not null,
  subtotal numeric(10, 2) not null,
  payment_method text not null check (payment_method in ('mock_card', 'qr_test')),
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  paid_at timestamptz
);

alter table public.smoke_wholesale_orders enable row level security;

drop policy if exists "customers can create their own order" on public.smoke_wholesale_orders;
create policy "customers can create their own order"
  on public.smoke_wholesale_orders for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "customers can read their own orders" on public.smoke_wholesale_orders;
create policy "customers can read their own orders"
  on public.smoke_wholesale_orders for select
  to authenticated
  using (auth.uid() = user_id);

-- The mock/test payment step (card or QR) flips status -> paid from the
-- client itself, since there's no real payment gateway sending a webhook
-- here. That's fine for a demo, but is the one thing in this schema that
-- would need to move server-side (e.g. a webhook handler using the
-- service-role key) before this were ever a real payment flow.
drop policy if exists "customers can mark their own pending order paid" on public.smoke_wholesale_orders;
create policy "customers can mark their own pending order paid"
  on public.smoke_wholesale_orders for update
  to authenticated
  using (auth.uid() = user_id and status = 'pending');

drop policy if exists "admins can read every order" on public.smoke_wholesale_orders;
create policy "admins can read every order"
  on public.smoke_wholesale_orders for select
  to authenticated
  using (exists (select 1 from public.admins where user_id = auth.uid()));
