# Lumera Wellness Security Notes

## Environment variables

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are safe to expose to the browser.
- Never add a Supabase `service_role` key to client code, `NEXT_PUBLIC_*` variables, commits, screenshots, or chat.
- Keep `.env.local` local only. It is already ignored by `.gitignore`.

## Required Supabase protections

The app uses the public anon key, so Supabase Row Level Security must be enabled on tables that contain user or booking data.

Run `supabase/security.sql` in the Supabase SQL Editor after confirming the table names match the production schema.
Run `supabase/constraints.sql` afterwards to add database-level validation for booking status, email, phone, notes, and time format.

Minimum expected rules:

- `bookings`: users can read/update only rows where `user_id = auth.uid()`.
- `bookings`: guests may insert booking requests only through allowed columns, if guest booking stays enabled.
- `bookings`: admins can read/update all rows through an admin policy based on the `is_admin()` RPC.
- `services`, `service_categories`, `service_durations`: public read access should expose only active public data.
- Admin detection must stay server-side through `is_admin()`; do not trust client-side flags.

## Adding an admin user

1. Create/sign in with the user account in Supabase Auth.
2. Copy that user's UUID from Authentication > Users.
3. Insert it into `public.admin_users`:

```sql
insert into public.admin_users (user_id)
values ('00000000-0000-0000-0000-000000000000');
```

Replace the UUID with the real admin user's ID.

## Current app protections

- Middleware refreshes Supabase sessions and blocks unauthenticated access to `/account/*` and admin routes except `/admin/login`.
- Admin pages and admin server actions still verify `is_admin()` server-side.
- Security headers are configured in `next.config.js`.
- Dependency audit currently reports zero vulnerabilities.
- Booking inputs are validated on the client, server action, and optionally at database constraint level.

## Follow-up hardening

- Add rate limiting for booking creation, login, registration, and future contact/newsletter endpoints.
- Add email confirmation and stronger password requirements in Supabase Auth settings.
- Keep Supabase leaked password protection and MFA available for admin accounts.
- Add database migrations or SQL policy files to version-control RLS and RPC definitions.
