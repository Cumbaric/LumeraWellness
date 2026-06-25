import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAllPostsAdmin } from "@/lib/posts";
import AdminShell from "@/components/admin/AdminShell";
import DeletePostButton from "@/components/admin/DeletePostButton";

export const metadata = {
  title: "Blog | Lumera Wellness Admin",
};

export const dynamic = "force-dynamic";

function formatDate(str) {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) redirect("/admin/login");

  const posts = await getAllPostsAdmin();

  const published = posts.filter((p) => p.is_published).length;
  const drafts = posts.length - published;

  return (
    <AdminShell activePage="blog" title="Blog" userEmail={user.email}>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-sage-dark">Lumera Admin</p>
          <h1 className="mt-1 font-heading text-5xl text-charcoal">Blog</h1>
          <p className="mt-2 text-sm text-muted">
            {published} published · {drafts} draft{drafts !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-white transition hover:bg-sage-dark"
        >
          + New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-[2rem] border border-sage/15 bg-white p-12 text-center shadow-sm">
          <h2 className="font-heading text-3xl text-charcoal">No posts yet</h2>
          <p className="mt-3 text-sm text-muted">Create your first blog post to get started.</p>
          <Link href="/admin/blog/new" className="mt-6 inline-block rounded-full bg-sage px-8 py-3 text-sm font-semibold text-cream transition hover:bg-sage-dark">
            Write a post
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-[2rem] border border-sage/15 bg-white shadow-sm lg:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-sand/40 text-xs uppercase tracking-[0.18em] text-muted">
                <tr>
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Published</th>
                  <th className="px-6 py-4 font-medium">Created</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage/10">
                {posts.map((post) => (
                  <tr key={post.id} className="align-middle transition hover:bg-sand/20">
                    <td className="px-6 py-4">
                      <p className="font-medium text-charcoal">{post.title}</p>
                      <p className="mt-0.5 text-xs text-muted">/blog/{post.slug}</p>
                    </td>
                    <td className="px-6 py-4">
                      {post.is_published ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-sage/20 bg-sage/10 px-3 py-1 text-xs font-medium text-sage-dark">
                          <span className="h-1.5 w-1.5 rounded-full bg-sage" />Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/10 bg-sand px-3 py-1 text-xs font-medium text-muted">
                          <span className="h-1.5 w-1.5 rounded-full bg-muted/40" />Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted">{formatDate(post.published_at)}</td>
                    <td className="px-6 py-4 text-muted">{formatDate(post.created_at)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="rounded-full border border-sage/20 px-4 py-1.5 text-xs font-semibold text-charcoal transition hover:bg-sand"
                        >
                          Edit
                        </Link>
                        {post.is_published && (
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="rounded-full border border-sage/20 px-4 py-1.5 text-xs font-semibold text-muted transition hover:bg-sand hover:text-charcoal"
                          >
                            View →
                          </Link>
                        )}
                        <DeletePostButton id={post.id} title={post.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="grid gap-4 lg:hidden">
            {posts.map((post) => (
              <div
                key={post.id}
                className="rounded-[2rem] border border-sage/15 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-heading text-lg font-semibold text-charcoal leading-snug">
                      {post.title}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted">/blog/{post.slug}</p>
                  </div>
                  {post.is_published ? (
                    <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-sage/20 bg-sage/10 px-3 py-1 text-xs font-medium text-sage-dark">
                      <span className="h-1.5 w-1.5 rounded-full bg-sage" />Published
                    </span>
                  ) : (
                    <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-charcoal/10 bg-sand px-3 py-1 text-xs font-medium text-muted">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted/40" />Draft
                    </span>
                  )}
                </div>

                <div className="mt-4 flex gap-6 text-xs text-muted">
                  <div>
                    <p className="uppercase tracking-[0.15em]">Published</p>
                    <p className="mt-0.5 text-charcoal">{formatDate(post.published_at)}</p>
                  </div>
                  <div>
                    <p className="uppercase tracking-[0.15em]">Created</p>
                    <p className="mt-0.5 text-charcoal">{formatDate(post.created_at)}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/blog/${post.id}/edit`}
                    className="rounded-full border border-sage/20 px-4 py-2 text-xs font-semibold text-charcoal transition hover:bg-sand"
                  >
                    Edit
                  </Link>
                  {post.is_published && (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="rounded-full border border-sage/20 px-4 py-2 text-xs font-semibold text-muted transition hover:bg-sand hover:text-charcoal"
                    >
                      View →
                    </Link>
                  )}
                  <DeletePostButton id={post.id} title={post.title} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </AdminShell>
  );
}
