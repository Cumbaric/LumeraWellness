"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function checkAdmin(supabase) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: isAdmin } = await supabase.rpc("is_admin");
  return !!isAdmin;
}

export async function createPost({ title, slug, excerpt, content, coverImageUrl, isPublished }) {
  const supabase = await createClient();
  if (!(await checkAdmin(supabase))) return { ok: false, error: "Unauthorized." };

  if (!title?.trim()) return { ok: false, error: "Title is required." };

  const finalSlug = slug?.trim() || slugify(title);
  if (!finalSlug) return { ok: false, error: "Could not generate a valid slug." };

  const now = isPublished ? new Date().toISOString() : null;

  const { data, error } = await supabase
    .from("posts")
    .insert({
      title: title.trim(),
      slug: finalSlug,
      excerpt: excerpt?.trim() || null,
      content: content || null,
      cover_image_url: coverImageUrl || null,
      is_published: !!isPublished,
      published_at: now,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[createPost] error:", error.code, error.message, error.details, error.hint);
    if (error.code === "23505") return { ok: false, error: "A post with this slug already exists." };
    return { ok: false, error: `Failed to create post: ${error.message}` };
  }

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return { ok: true, id: data.id };
}

export async function updatePost({ id, title, slug, excerpt, content, coverImageUrl, isPublished }) {
  const supabase = await createClient();
  if (!(await checkAdmin(supabase))) return { ok: false, error: "Unauthorized." };

  if (!title?.trim()) return { ok: false, error: "Title is required." };

  const { data: current } = await supabase
    .from("posts")
    .select("is_published, published_at, slug")
    .eq("id", id)
    .single();

  const publishedAt =
    isPublished && !current?.is_published
      ? new Date().toISOString()
      : current?.published_at || null;

  const finalSlug = slug?.trim() || slugify(title);

  const { error } = await supabase
    .from("posts")
    .update({
      title: title.trim(),
      slug: finalSlug,
      excerpt: excerpt?.trim() || null,
      content: content || null,
      cover_image_url: coverImageUrl || null,
      is_published: !!isPublished,
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") return { ok: false, error: "A post with this slug already exists." };
    return { ok: false, error: "Failed to update post." };
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${current?.slug}`);
  revalidatePath(`/blog/${finalSlug}`);
  revalidatePath("/admin/blog");
  return { ok: true };
}

export async function deletePost(id) {
  const supabase = await createClient();
  if (!(await checkAdmin(supabase))) return { ok: false, error: "Unauthorized." };

  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) return { ok: false, error: "Failed to delete post." };

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return { ok: true };
}

export async function uploadBlogImage(formData) {
  const supabase = await createClient();
  if (!(await checkAdmin(supabase))) return { ok: false, error: "Unauthorized." };

  const file = formData.get("file");
  if (!file || !file.name) return { ok: false, error: "No file provided." };

  const ext = file.name.split(".").pop().toLowerCase();
  if (!["jpg", "jpeg", "png", "webp", "gif"].includes(ext))
    return { ok: false, error: "Only jpg, png, webp or gif allowed." };

  if (file.size > 5 * 1024 * 1024)
    return { ok: false, error: "Image must be under 5 MB." };

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("blog-images")
    .upload(filename, file, { contentType: file.type, upsert: false });

  if (error) return { ok: false, error: "Upload failed: " + error.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from("blog-images").getPublicUrl(filename);

  return { ok: true, url: publicUrl };
}
