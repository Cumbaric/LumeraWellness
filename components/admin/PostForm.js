"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { createPost, updatePost, uploadBlogImage } from "@/app/admin/blog/actions";

const BlogEditor = dynamic(() => import("@/components/admin/BlogEditor"), { ssr: false });

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-sage/20 bg-white px-3 py-2 text-sm text-charcoal outline-none transition focus:border-sage focus:ring-2 focus:ring-sage/20";
const labelClass = "text-xs font-medium uppercase tracking-wide text-muted";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function PostForm({ post }) {
  const router = useRouter();
  const isEditing = !!post;
  const coverFileRef = useRef(null);

  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState(post?.content || "");
  const [coverImageUrl, setCoverImageUrl] = useState(post?.cover_image_url || "");
  const [coverUploading, setCoverUploading] = useState(false);

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleTitleChange(value) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function handleSlugChange(value) {
    setSlug(value);
    setSlugTouched(true);
  }

  async function handleCoverUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const result = await uploadBlogImage(fd).catch(() => null);
    if (result?.ok) setCoverImageUrl(result.url);
    else setError(result?.error || "Cover upload failed.");
    setCoverUploading(false);
    e.target.value = "";
  }

  async function handleSave(isPublished) {
    setError("");
    if (!title.trim()) { setError("Title is required."); return; }
    setSaving(true);

    const payload = { title, slug, excerpt, content, coverImageUrl, isPublished };
    const result = isEditing
      ? await updatePost({ id: post.id, ...payload }).catch(() => null)
      : await createPost(payload).catch(() => null);

    if (result?.ok) {
      router.push("/admin/blog");
      router.refresh();
    } else {
      setError(result?.error || "Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
      {/* Main column */}
      <div className="grid gap-5">
        <div>
          <label className={labelClass}>Title <span className="text-clay normal-case">*</span></label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Post title…"
            maxLength={200}
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass}>Slug (URL)</label>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-sm text-muted">/blog/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="auto-generated-from-title"
              maxLength={200}
              className="w-full rounded-xl border border-sage/20 bg-white px-3 py-2 text-sm text-charcoal outline-none transition focus:border-sage focus:ring-2 focus:ring-sage/20"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Short summary shown on the blog list…"
            rows={2}
            maxLength={500}
            className={`${fieldClass} resize-none`}
          />
        </div>

        <div>
          <label className={labelClass}>Content</label>
          <div className="mt-1.5">
            <BlogEditor content={content} onChange={setContent} />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="grid gap-5">
        {/* Cover image */}
        <div className="rounded-2xl border border-sage/15 bg-white p-5 shadow-sm">
          <p className={labelClass}>Cover image</p>
          {coverImageUrl ? (
            <div className="mt-3">
              <img src={coverImageUrl} alt="Cover" className="w-full rounded-xl object-cover max-h-48" />
              <button
                type="button"
                onClick={() => setCoverImageUrl("")}
                className="mt-2 text-xs text-clay hover:underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="mt-3 flex h-36 items-center justify-center rounded-xl border-2 border-dashed border-sage/20 bg-cream text-sm text-muted">
              No cover image
            </div>
          )}
          <button
            type="button"
            onClick={() => coverFileRef.current?.click()}
            disabled={coverUploading}
            className="mt-3 w-full rounded-full border border-sage/20 py-2 text-sm font-medium text-charcoal transition hover:bg-sand disabled:opacity-60"
          >
            {coverUploading ? "Uploading…" : "Upload cover image"}
          </button>
          <input ref={coverFileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleCoverUpload} />
        </div>

        {/* Actions */}
        <div className="rounded-2xl border border-sage/15 bg-white p-5 shadow-sm">
          <p className={labelClass}>Publish</p>

          {error && (
            <p className="mt-3 rounded-xl bg-clay/10 px-4 py-3 text-sm text-clay ring-1 ring-clay/20">
              {error}
            </p>
          )}

          <div className="mt-4 grid gap-2">
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={saving}
              className="w-full rounded-full bg-sage py-3 text-sm font-semibold text-cream transition hover:bg-sage-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving…" : isEditing ? "Save & publish" : "Publish post"}
            </button>
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={saving}
              className="w-full rounded-full border border-sage/20 py-3 text-sm font-semibold text-charcoal transition hover:bg-sand disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save as draft"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/blog")}
              className="w-full rounded-full py-2 text-sm text-muted transition hover:text-charcoal"
            >
              Cancel
            </button>
          </div>
        </div>

        {isEditing && (
          <div className="rounded-2xl border border-sage/15 bg-white p-5 shadow-sm text-sm text-muted">
            <p className={labelClass}>Status</p>
            <p className="mt-2">
              {post.is_published ? (
                <span className="inline-flex items-center gap-1.5 text-sage-dark font-medium">
                  <span className="h-2 w-2 rounded-full bg-sage" /> Published
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-muted">
                  <span className="h-2 w-2 rounded-full bg-sand border border-sage/30" /> Draft
                </span>
              )}
            </p>
            {post.published_at && (
              <p className="mt-1 text-xs">
                {new Date(post.published_at).toLocaleDateString("en-GB", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
