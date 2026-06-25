import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";
import SectionHeading from "@/components/ui/SectionHeading";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import { Reveal, RevealItem } from "@/components/ui/Reveal";

export const metadata = {
  title: "Blog",
  description: "Wellness tips, stories and insights from Lumera Wellness.",
  openGraph: {
    title: "Blog | Lumera Wellness",
    description: "Wellness tips, stories and insights from Lumera Wellness.",
  },
  alternates: { canonical: "/blog" },
};

export const dynamic = "force-dynamic";

function formatDate(str) {
  if (!str) return "";
  return new Date(str).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <Section className="bg-sand">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <SectionHeading label="Blog" title="Wellness stories & tips" />
            <p className="-mt-6 text-muted">
              Insights, guides and thoughts from the Lumera team.
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section className="bg-cream">
        <Container>
          {posts.length === 0 ? (
            <p className="py-16 text-center text-muted">
              No posts yet — check back soon.
            </p>
          ) : (
            <Reveal stagger className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <RevealItem key={post.id}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-charcoal/8 bg-white shadow-sm transition hover:shadow-md"
                  >
                    {post.cover_image_url ? (
                      <div className="h-52 overflow-hidden">
                        <img
                          src={post.cover_image_url}
                          alt={post.title}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="flex h-52 items-center justify-center bg-sand/60">
                        <span className="text-xs uppercase tracking-[0.3em] text-muted">
                          Lumera Wellness
                        </span>
                      </div>
                    )}

                    <div className="flex flex-1 flex-col p-6">
                      {post.published_at && (
                        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted">
                          {formatDate(post.published_at)}
                        </p>
                      )}
                      <h2 className="font-heading text-xl font-semibold text-charcoal transition group-hover:text-sage-dark">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="mt-2 line-clamp-3 text-sm text-muted">
                          {post.excerpt}
                        </p>
                      )}
                      <span className="mt-auto pt-4 text-sm font-medium text-sage-dark">
                        Read more →
                      </span>
                    </div>
                  </Link>
                </RevealItem>
              ))}
            </Reveal>
          )}
        </Container>
      </Section>
    </>
  );
}
