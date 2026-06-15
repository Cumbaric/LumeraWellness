/**
 * Browser (client-side) Supabase client.
 *
 * Use this helper inside Client Components ('use client').
 * Creates a fresh client on each call; safe to call at the top of a component
 * or inside a hook.
 */
import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "@/lib/supabase/env";

export function createClient() {
  const { anonKey, url } = getSupabaseConfig();

  return createBrowserClient(url, anonKey);
}
