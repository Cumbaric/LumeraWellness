/**
 * Server-side data-access layer for Lumera Wellness services.
 *
 * Queries Supabase and returns data shaped exactly as the UI components
 * already expect (matching the field names from /data/services.js), so
 * no presentational component needs changing.
 *
 * All functions must be called from Server Components, Route Handlers, or
 * Server Actions only — they use the server Supabase client.
 */
import { createClient } from "@/lib/supabase/server";

// ---------------------------------------------------------------------------
// Internal transform
// ---------------------------------------------------------------------------

/**
 * Maps a raw Supabase `services` row (with joined relations) to the UI shape.
 *
 * DB column → UI field:
 *   short_description  → shortDescription
 *   long_description   → longDescription
 *   image_url          → image
 *   service_categories → category (slug string)
 *   service_durations  → durations [{ minutes, price }]
 */
function transformService(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.service_categories?.slug ?? "",
    categoryLabel: row.service_categories?.label ?? "",
    shortDescription: row.short_description,
    longDescription: row.long_description,
    benefits: row.benefits ?? [],
    durations: (row.service_durations ?? [])
      .sort(
        (a, b) =>
          (a.sort_order ?? a.minutes) - (b.sort_order ?? b.minutes)
      )
      .map((d) => ({ minutes: d.minutes, price: d.price })),
    image: row.image_url,
    featured: row.featured,
  };
}

// The select string used by every service query.
const SERVICE_SELECT =
  "*, service_categories(slug, label), service_durations(minutes, price, sort_order)";

// ---------------------------------------------------------------------------
// Exported functions
// ---------------------------------------------------------------------------

/**
 * All active services ordered by sort_order, each with category + durations.
 */
export async function getServices() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select(SERVICE_SELECT)
    .eq("is_active", true)
    .order("sort_order");

  if (error) {
    console.error("[getServices]", error.message);
    return [];
  }

  return (data ?? []).map(transformService);
}

/**
 * Active + featured services ordered by sort_order.
 * Used by the Home page "Our Treatments" section.
 */
export async function getFeaturedServices() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select(SERVICE_SELECT)
    .eq("is_active", true)
    .eq("featured", true)
    .order("sort_order");

  if (error) {
    console.error("[getFeaturedServices]", error.message);
    return [];
  }

  return (data ?? []).map(transformService);
}

/**
 * A single service by slug (with category + durations), or null if not found.
 */
export async function getServiceBySlug(slug) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select(SERVICE_SELECT)
    .eq("slug", slug)
    .single();

  if (error) {
    // PGRST116 = "no rows returned" — not a real error
    if (error.code !== "PGRST116") {
      console.error("[getServiceBySlug]", error.message);
    }
    return null;
  }

  return data ? transformService(data) : null;
}

/**
 * Categories ordered by sort_order, returned as a map keyed by slug:
 *   { relaxation: { label: 'Relaxation' }, ... }
 *
 * Object.entries() on this map preserves insertion order, matching
 * the sort_order from the DB (relaxation → therapeutic → body → couples).
 */
export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("service_categories")
    .select("slug, label, sort_order")
    .order("sort_order");

  if (error) {
    console.error("[getCategories]", error.message);
    // Fallback so pages never crash if the query fails
    return {
      relaxation: { label: "Relaxation" },
      therapeutic: { label: "Therapeutic" },
      body: { label: "Body Treatments" },
      couples: { label: "Couples & Special" },
    };
  }

  const map = {};
  (data ?? []).forEach((cat) => {
    map[cat.slug] = { label: cat.label };
  });
  return map;
}

/**
 * All active service slugs — used by generateStaticParams on the detail page.
 */
export async function getServiceSlugs() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("slug")
    .eq("is_active", true);

  if (error) {
    console.error("[getServiceSlugs]", error.message);
    return [];
  }

  return (data ?? []).map((row) => row.slug);
}
