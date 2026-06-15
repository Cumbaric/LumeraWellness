/**
 * Server-side Supabase client.
 *
 * Use this helper inside Server Components, Route Handlers, and Server Actions.
 * Reads and writes cookies via next/headers so Supabase Auth sessions are
 * correctly propagated on the server.
 *
 * Must be called with `await` because cookies() is async in Next.js App Router.
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseConfig } from "@/lib/supabase/env";

export async function createClient() {
  const cookieStore = await cookies();
  const { anonKey, url } = getSupabaseConfig();

  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll was called from a Server Component where cookies are
            // read-only. Safe to ignore — middleware will refresh the session.
          }
        },
      },
    }
  );
}
