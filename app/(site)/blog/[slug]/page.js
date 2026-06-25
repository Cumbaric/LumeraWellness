import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getRelatedPosts } from "@/lib/posts";
import { getReadingTime } from "@/lib/format";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt || "",
    openGraph: {
      title: `${post.title} | Lumera Wellness`,
      description: post.excerpt || "",
      ...(post.cover_image_url ? { images: [{ url: post.cover_image_url }] } : {}),
    },
    alternates: { canonical: `/blog/${slug}` },
  };
}

function formatDate(str) {
  if (!str) return "";
  return new Date(str).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const [post, related] = await Promise.all([
    getPostBySlug(slug),
    getRelatedPosts(slug, 2),
  ]);
  if (!post) notFound();

  const readingTime = getReadingTime(post.content);

  return (
    <Section className="bg-cream">
      <Container className="max-w-3xl">
        {/* Back link */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-charcoal"
        >
          ← All posts
        </Link>

        {/* Cover image */}
        {post.cover_image_url && (
          <div className="mb-10 overflow-hidden rounded-2xl">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="max-h-[480px] w-full object-cover"
            />
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.25em] text-muted">
          {post.published_at && <span>{formatDate(post.published_at)}</span>}
          {post.published_at && readingTime && <span aria-hidden="true">·</span>}
          {readingTime && <span>{readingTime}</span>}
          {post.author_name && readingTime && <span aria-hidden="true">·</span>}
          {post.author_name && <span>By {post.author_name}</span>}
        </div>

        {/* Title */}
        <h1 className="mt-3 font-heading text-4xl font-semibold text-charcoal sm:text-5xl">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="mt-4 text-lg leading-relaxed text-muted">{post.excerpt}</p>
        )}

        <div className="mt-4 h-0.5 w-16 bg-gold" />

        {/* Content */}
        <div
          className="blog-content mt-8"
          dangerouslySetInnerHTML={{ __html: post.content || "" }}
        />

        {/* Booking CTA */}
        <div className="mt-16 border-t border-sage/15 pt-8 text-center">
          <p className="text-sm text-muted">
            Ready to experience Lumera?
          </p>
          <Link
            href="/booking"
            className="mt-4 inline-block rounded-full bg-sage px-8 py-3 text-sm font-medium text-cream transition hover:bg-sage-dark"
          >
            Book your treatment
          </Link>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-16">
            <p className="mb-6 text-xs uppercase tracking-[0.25em] text-muted">
              More from the blog
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-charcoal/8 bg-white shadow-sm transition hover:shadow-md"
                >
                  {r.cover_image_url ? (
                    <div className="h-40 overflow-hidden">
                      <img
                        src={r.cover_image_url}
                        alt={r.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex h-40 items-center justify-center bg-sand/60">
                      <span className="text-xs uppercase tracking-[0.3em] text-muted">
                        Lumera Wellness
                      </span>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    {r.published_at && (
                      <p className="mb-1 text-xs uppercase tracking-[0.2em] text-muted">
                        {formatDate(r.published_at)}
                      </p>
                    )}
                    <h3 className="font-heading text-lg font-semibold text-charcoal transition group-hover:text-sage-dark">
                      {r.title}
                    </h3>
                    {r.excerpt && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted">
                        {r.excerpt}
                      </p>
                    )}
                    <span className="mt-auto pt-3 text-sm font-medium text-sage-dark">
                      Read more →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
