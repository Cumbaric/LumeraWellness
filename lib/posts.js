import { createClient } from "@/lib/supabase/server";

export async function getPublishedPosts() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("id, title, slug, excerpt, cover_image_url, published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();
    return data || null;
  } catch {
    return null;
  }
}

export async function getAllPostsAdmin() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("id, title, slug, excerpt, cover_image_url, is_published, published_at, created_at")
      .order("created_at", { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

export async function getPostByIdAdmin(id) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();
    return data || null;
  } catch {
    return null;
  }
}
