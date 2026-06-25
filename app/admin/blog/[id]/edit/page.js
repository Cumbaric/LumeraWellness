import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPostByIdAdmin } from "@/lib/posts";
import AdminShell from "@/components/admin/AdminShell";
import PostForm from "@/components/admin/PostForm";

export const metadata = { title: "Edit Post | Lumera Wellness Admin" };

export default async function EditPostPage({ params }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) redirect("/admin/login");

  const post = await getPostByIdAdmin(id);
  if (!post) notFound();

  return (
    <AdminShell activePage="blog" title="Edit post" userEmail={user.email}>
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-sage-dark">Blog</p>
        <h1 className="mt-1 font-heading text-5xl text-charcoal">Edit post</h1>
        <p className="mt-2 text-sm text-muted truncate max-w-lg">{post.title}</p>
      </div>
      <PostForm post={post} />
    </AdminShell>
  );
}
