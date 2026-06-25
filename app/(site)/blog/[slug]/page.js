import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug } from "@/lib/posts";
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
  const post = await getPostBySlug(slug);
  if (!post) notFound();

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
        {post.published_at && (
          <p className="text-xs uppercase tracking-[0.25em] text-muted">
            {formatDate(post.published_at)}
          </p>
        )}

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

        {/* Footer */}
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
      </Container>
    </Section>
  );
}
