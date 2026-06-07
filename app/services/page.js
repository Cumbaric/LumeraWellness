import { services, categories } from "@/data/services";
import ServiceCard from "@/components/services/ServiceCard";

export const metadata = {
  title: "Treatments | Lumera Wellness",
  description:
    "Explore our full range of massage and wellness treatments — from relaxing aromatherapy to deep tissue therapy, hot stone rituals, and couples experiences.",
};

export default function ServicesPage() {
  return (
    <div>
      {/* Page header */}
      <section className="bg-sand">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h1 className="font-heading text-4xl font-semibold text-charcoal sm:text-5xl">
            Our Treatments
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            A curated menu of massage and wellness rituals, each designed to help
            you slow down, recover, and feel restored. Choose the experience
            that fits your moment.
          </p>
        </div>
      </section>

      {/* Categories */}
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        {Object.entries(categories).map(([key, category]) => {
          const categoryServices = services.filter(
            (service) => service.category === key
          );

          if (categoryServices.length === 0) return null;

          return (
            <section key={key} className="mb-16 last:mb-0">
              <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">
                {category.label}
              </h2>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {categoryServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
