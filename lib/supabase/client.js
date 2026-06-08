/**
 * Browser (client-side) Supabase client.
 *
 * Use this helper inside Client Components ('use client').
 * Creates a fresh client on each call; safe to call at the top of a component
 * or inside a hook.
 */
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
