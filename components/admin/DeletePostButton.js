"use client";

import { useRouter } from "next/navigation";
import { deletePost } from "@/app/admin/blog/actions";

export default function DeletePostButton({ id, title }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Delete "${title}"?`)) return;
    const result = await deletePost(id).catch(() => null);
    if (result?.ok) router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="rounded-full px-4 py-1.5 text-xs font-semibold text-clay transition hover:bg-clay/10"
    >
      Delete
    </button>
  );
}
