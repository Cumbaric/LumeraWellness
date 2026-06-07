import Link from "next/link";
import { services } from "@/data/services";
import ServiceCard from "@/components/services/ServiceCard";
import SectionHeading from "@/components/ui/SectionHeading";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

export default function FeaturedServices() {
  const featured = services.filter((service) => service.featured);

  return (
    <Section>
      <Container>
        <SectionHeading
          label="Our Treatments"
          title="Treatments tailored to you"
        />
        <p className="mx-auto -mt-6 mb-12 max-w-2xl text-center text-muted">
          A curated selection of our most-loved massage and wellness rituals,
          crafted to help you slow down and feel restored.
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
      </Container>
    </Section>
  );
}
