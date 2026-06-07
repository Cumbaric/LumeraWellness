import Link from "next/link";
import { services } from "@/data/services";
import ServiceCard from "@/components/services/ServiceCard";

export default function FeaturedServices() {
  const featured = services.filter((service) => service.featured);

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <div className="max-w-2xl">
        <h2 className="font-heading text-3xl font-semibold text-charcoal sm:text-4xl">
          Our Treatments
        </h2>
        <p className="mt-4 text-muted">
          A curated selection of our most-loved massage and wellness rituals,
          crafted to help you slow down and feel restored.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {featured.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      <div className="mt-12">
        <Link
          href="/services"
          className="inline-block rounded-full border border-sage px-7 py-3 text-sm font-medium text-sage-dark transition-colors hover:bg-sage hover:text-cream"
        >
          View all services
        </Link>
      </div>
    </section>
  );
}
