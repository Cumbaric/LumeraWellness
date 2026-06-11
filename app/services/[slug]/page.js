import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceBySlug, getCategories } from "@/lib/services";
import { formatPrice, formatDuration } from "@/lib/format";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import { Reveal, RevealItem } from "@/components/ui/Reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return { title: "Treatment not found" };
  }

  return {
    title: service.name,
    description: service.shortDescription,
    openGraph: {
      title: `${service.name} | Lumera Wellness`,
      description: service.shortDescription,
      url: `https://lumera-wellness.vercel.app/services/${service.slug}`,
      images: [{ url: service.image, width: 1200, height: 900, alt: service.name }],
    },
    twitter: {
      title: `${service.name} | Lumera Wellness`,
      description: service.shortDescription,
    },
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const [service, categories] = await Promise.all([
    getServiceBySlug(slug),
    getCategories(),
  ]);

  if (!service) {
    notFound();
  }

  const category = categories[service.category];

  return (
    <Section as="article">
      <Container>
        {/* Hero: image + intro */}
        <Reveal className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl ring-1 ring-sand">
            <Image
              src={service.image}
              alt={service.name}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <span className="text-sm font-medium uppercase tracking-[0.2em] text-sage">
              {category?.label}
            </span>
            <h1 className="mt-3 font-heading text-4xl font-semibold text-charcoal sm:text-5xl">
              {service.name}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              {service.longDescription}
            </p>
          </div>
        </Reveal>

        {/* Benefits */}
        <section className="mt-16">
          <Reveal>
            <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">
              Benefits
            </h2>
          </Reveal>
          <Reveal
            stagger
            as="ul"
            className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {service.benefits.map((benefit) => (
              <RevealItem
                as="li"
                key={benefit}
                className="flex items-start gap-3 rounded-2xl bg-sand p-5 text-charcoal"
              >
                <span aria-hidden="true" className="mt-0.5 text-sage-dark">
                  ✦
                </span>
                <span className="text-sm">{benefit}</span>
              </RevealItem>
            ))}
          </Reveal>
        </section>

        {/* Duration & Pricing */}
        <Reveal as="section" className="mt-16">
          <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">
            Duration &amp; Pricing
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.durations.map((duration) => (
              <div
                key={duration.minutes}
                className="flex items-center justify-between rounded-2xl bg-cream p-6 ring-1 ring-sand"
              >
                <span className="text-charcoal">
                  {formatDuration(duration.minutes)}
                </span>
                <span className="font-heading text-2xl font-semibold text-sage-dark">
                  {formatPrice(duration.price)}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* CTA + back link */}
        <Reveal className="mt-16 flex flex-col items-start gap-6 border-t border-sand pt-10 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={`/booking?service=${service.slug}`}
            className="rounded-full bg-sage px-8 py-3 text-base font-medium text-cream transition-colors hover:bg-sage-dark"
          >
            Book this treatment
          </Link>
          <Link
            href="/services"
            className="text-sm font-medium text-sage transition-colors hover:text-sage-dark"
          >
            ← Back to all treatments
          </Link>
        </Reveal>
      </Container>
    </Section>
  );
}
