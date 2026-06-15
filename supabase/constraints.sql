-- Lumera Wellness data integrity constraints.
-- Run after `supabase/security.sql`.

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'bookings_status_allowed'
  ) then
    alter table public.bookings
      add constraint bookings_status_allowed
      check (status in ('pending', 'confirmed', 'cancelled', 'completed'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'bookings_guest_name_length'
  ) then
    alter table public.bookings
      add constraint bookings_guest_name_length
      check (char_length(trim(guest_name)) between 1 and 120);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'bookings_guest_email_length'
  ) then
    alter table public.bookings
      add constraint bookings_guest_email_length
      check (char_length(trim(guest_email)) between 3 and 254);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'bookings_guest_email_format'
  ) then
    alter table public.bookings
      add constraint bookings_guest_email_format
      check (guest_email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$');
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'bookings_guest_phone_length'
  ) then
    alter table public.bookings
      add constraint bookings_guest_phone_length
      check (char_length(trim(guest_phone)) between 6 and 40);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'bookings_guest_phone_format'
  ) then
    alter table public.bookings
      add constraint bookings_guest_phone_format
      check (guest_phone ~ '^[+()0-9 .-]{6,40}$');
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'bookings_notes_length'
  ) then
    alter table public.bookings
      add constraint bookings_notes_length
      check (notes is null or char_length(trim(notes)) <= 1000);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'bookings_time_on_the_hour'
  ) then
    alter table public.bookings
      add constraint bookings_time_on_the_hour
      check (
        date_part('minute', booking_time) = 0
        and date_part('second', booking_time) = 0
      );
  end if;
end $$;
