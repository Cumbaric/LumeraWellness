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
  const [hero, ...rest] = posts;

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
            <div className="py-20 text-center">
              <p className="text-muted">No posts yet — check back soon.</p>
              <Link
                href="/services"
                className="mt-6 inline-block rounded-full bg-sage px-8 py-3 text-sm font-medium text-cream transition hover:bg-sage-dark"
              >
                Explore our treatments
              </Link>
            </div>
          ) : (
            <>
              {/* Hero — latest post */}
              <Reveal>
                <Link
                  href={`/blog/${hero.slug}`}
                  className="group mb-12 flex flex-col overflow-hidden rounded-3xl border border-charcoal/8 bg-white shadow-sm transition hover:shadow-md lg:flex-row"
                >
                  <div className="h-64 shrink-0 overflow-hidden lg:h-auto lg:w-1/2">
                    {hero.cover_image_url ? (
                      <img
                        src={hero.cover_image_url}
                        alt={hero.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-sand/60">
                        <span className="text-xs uppercase tracking-[0.3em] text-muted">
                          Lumera Wellness
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-center p-8 lg:p-12">
                    <p className="text-xs uppercase tracking-[0.25em] text-sage-dark">
                      Latest post
                    </p>
                    {hero.published_at && (
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">
                        {formatDate(hero.published_at)}
                      </p>
                    )}
                    <h2 className="mt-3 font-heading text-3xl font-semibold text-charcoal transition group-hover:text-sage-dark lg:text-4xl">
                      {hero.title}
                    </h2>
                    {hero.excerpt && (
                      <p className="mt-3 line-clamp-3 text-muted">
                        {hero.excerpt}
                      </p>
                    )}
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-sm font-medium text-sage-dark">Read more →</span>
                      {hero.author_name && (
                        <span className="text-xs text-muted">By {hero.author_name}</span>
                      )}
                    </div>
                  </div>
                </Link>
              </Reveal>

              {/* Rest of posts */}
              {rest.length > 0 && (
                <Reveal stagger className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
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
                          <div className="mt-auto flex items-center justify-between pt-4">
                            <span className="text-sm font-medium text-sage-dark">Read more →</span>
                            {post.author_name && (
                              <span className="text-xs text-muted">By {post.author_name}</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </RevealItem>
                  ))}
                </Reveal>
              )}
            </>
          )}
        </Container>
      </Section>
    </>
  );
}
