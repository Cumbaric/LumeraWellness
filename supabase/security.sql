-- Lumera Wellness Supabase security baseline.
-- Run this in Supabase SQL Editor after confirming the table names match the app.

-- Admin users are stored separately from auth.users. Add your own user_id here
-- after creating/signing in with the admin account.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "Admins can read admin users" on public.admin_users;
create policy "Admins can read admin users"
on public.admin_users
for select
to authenticated
using (public.is_admin());

-- Public catalogue data.
alter table public.service_categories enable row level security;
alter table public.services enable row level security;
alter table public.service_durations enable row level security;

drop policy if exists "Anyone can read service categories" on public.service_categories;
create policy "Anyone can read service categories"
on public.service_categories
for select
to anon, authenticated
using (true);

drop policy if exists "Anyone can read active services" on public.services;
create policy "Anyone can read active services"
on public.services
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Anyone can read durations for active services" on public.service_durations;
create policy "Anyone can read durations for active services"
on public.service_durations
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.services
    where services.id = service_durations.service_id
      and services.is_active = true
  )
);

-- Booking data contains personal information and must be protected.
alter table public.bookings enable row level security;

drop policy if exists "Guests can create booking requests" on public.bookings;
create policy "Guests can create booking requests"
on public.bookings
for insert
to anon, authenticated
with check (
  status = 'pending'
  and guest_name is not null
  and guest_email is not null
  and guest_phone is not null
  and exists (
    select 1
    from public.services
    where services.id = bookings.service_id
      and services.is_active = true
  )
  and exists (
    select 1
    from public.service_durations
    where service_durations.id = bookings.service_duration_id
      and service_durations.service_id = bookings.service_id
  )
  and (
    auth.uid() is null
    or user_id = auth.uid()
    or user_id is null
  )
);

drop policy if exists "Users can read own bookings" on public.bookings;
create policy "Users can read own bookings"
on public.bookings
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can cancel own active bookings" on public.bookings;
create policy "Users can cancel own active bookings"
on public.bookings
for update
to authenticated
using (
  user_id = auth.uid()
  and status in ('pending', 'confirmed')
)
with check (
  user_id = auth.uid()
  and status = 'cancelled'
);

drop policy if exists "Admins can read all bookings" on public.bookings;
create policy "Admins can read all bookings"
on public.bookings
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can update booking status" on public.bookings;
create policy "Admins can update booking status"
on public.bookings
for update
to authenticated
using (public.is_admin())
with check (
  public.is_admin()
  and status in ('pending', 'confirmed', 'cancelled', 'completed')
);

-- Column-level grants reduce damage if someone calls Supabase directly.
-- Clients can insert booking requests, but only the app/admin status workflow
-- should update rows after creation.
revoke update on public.bookings from anon, authenticated;
grant update(status) on public.bookings to authenticated;
