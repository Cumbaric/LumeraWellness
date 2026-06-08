import Link from "next/link";
import { services, categories } from "@/data/services";
import { formatPrice, formatDuration } from "@/lib/format";
import SectionHeading from "@/components/ui/SectionHeading";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import { Reveal, RevealItem } from "@/components/ui/Reveal";

export const metadata = {
  title: "Treatments & Pricing",
  description:
    "Transparent pricing for every massage and wellness treatment at Lumera Wellness. Choose the duration that suits you.",
  openGraph: {
    title: "Treatments & Pricing | Lumera Wellness",
    description:
      "Transparent pricing for every massage and wellness treatment at Lumera Wellness. Choose the duration that suits you.",
    url: "https://lumerawellness.vercel.app/pricing",
  },
  twitter: {
    title: "Treatments & Pricing | Lumera Wellness",
    description:
      "Transparent pricing for every massage and wellness treatment at Lumera Wellness. Choose the duration that suits you.",
  },
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <>
      {/* Hero / intro */}
      <Section className="bg-sand">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <SectionHeading label="Pricing" title="Treatments & Pricing" />
            <p className="-mt-6 text-muted">
              Transparent pricing for every treatment. Choose the duration that
              suits you.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Pricing by category */}
      <Section className="bg-cream">
        <Container>
          {Object.entries(categories).map(([key, category]) => {
            const categoryServices = services.filter(
              (service) => service.category === key
            );

            if (categoryServices.length === 0) return null;

            return (
              <section key={key} className="mb-16 last:mb-0">
                <Reveal>
                  <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">
                    {category.label}
                  </h2>
                </Reveal>

                <Reveal
                  stagger
                  className="mt-6 divide-y divide-charcoal/10 rounded-2xl bg-cream ring-1 ring-charcoal/10"
                >
                  {categoryServices.map((service) => (
                    <RevealItem
                      key={service.id}
                      className="flex flex-col gap-3 p-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8"
                    >
                      {/* Left: name + description */}
                      <div className="sm:max-w-md">
                        <h3 className="font-medium text-charcoal">
                          {service.name}
                        </h3>
                        <p className="mt-1 text-sm text-muted">
                          {service.shortDescription}
                        </p>
                      </div>

                      {/* Right: duration/price options */}
                      <ul className="space-y-1 sm:text-right">
                        {service.durations.map((duration) => (
                          <li
                            key={duration.minutes}
                            className="text-sm text-charcoal"
                          >
                            <span className="text-muted">
                              {formatDuration(duration.minutes)}
                            </span>
                            <span className="mx-2 text-gold">—</span>
                            <span className="font-medium text-sage-dark">
                              {formatPrice(duration.price)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </RevealItem>
                  ))}
                </Reveal>
              </section>
            );
          })}

          {/* Gift voucher note */}
          <Reveal className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-gold/40 bg-sand p-8 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <h2 className="font-heading text-xl font-semibold text-charcoal">
                Looking for a gift?
              </h2>
              <p className="mt-1 text-sm text-muted">
                Lumera gift vouchers make a thoughtful present for any occasion.
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 rounded-full bg-sage px-7 py-3 text-sm font-medium text-cream transition-colors hover:bg-sage-dark"
            >
              Learn more
            </Link>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
