import { services, categories } from "@/data/services";
import ServiceCard from "@/components/services/ServiceCard";
import SectionHeading from "@/components/ui/SectionHeading";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

export const metadata = {
  title: "Treatments | Lumera Wellness",
  description:
    "Explore our full range of massage and wellness treatments — from relaxing aromatherapy to deep tissue therapy, hot stone rituals, and couples experiences.",
};

export default function ServicesPage() {
  return (
    <div>
      {/* Page header */}
      <Section className="bg-sand">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <SectionHeading title="Our Treatments" />
            <p className="-mt-6 text-muted">
              A curated menu of massage and wellness rituals, each designed to
              help you slow down, recover, and feel restored. Choose the
              experience that fits your moment.
            </p>
          </div>
        </Container>
      </Section>

      {/* Categories */}
      <Section>
        <Container>
          {Object.entries(categories).map(([key, category]) => {
            const categoryServices = services.filter(
              (service) => service.category === key
            );

            if (categoryServices.length === 0) return null;

            return (
              <section key={key} className="mb-16 last:mb-0">
                <h2 className="text-center font-heading text-2xl font-semibold text-charcoal sm:text-3xl">
                  {category.label}
                </h2>
                <div className="mt-8 flex flex-wrap justify-center gap-6">
                  {categoryServices.map((service) => (
                    <div
                      key={service.id}
                      className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
                    >
                      <ServiceCard service={service} />
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </Container>
      </Section>
    </div>
  );
}
