import Link from "next/link";
import { getServices, getCategories } from "@/lib/services";
import ServicesGrid from "@/components/services/ServicesGrid";
import SectionHeading from "@/components/ui/SectionHeading";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export const metadata = {
  title: "Massage & Wellness Treatments",
  description:
    "Explore our full menu of massage and wellness treatments — relaxation, therapeutic, body, and couples rituals tailored to your needs.",
  openGraph: {
    title: "Massage & Wellness Treatments | Lumera Wellness",
    description:
      "Explore our full menu of massage and wellness treatments — relaxation, therapeutic, body, and couples rituals tailored to your needs.",
    url: "https://lumerawellness.vercel.app/services",
  },
  twitter: {
    title: "Massage & Wellness Treatments | Lumera Wellness",
    description:
      "Explore our full menu of massage and wellness treatments — relaxation, therapeutic, body, and couples rituals tailored to your needs.",
  },
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const [services, categories] = await Promise.all([
    getServices(),
    getCategories(),
  ]);

  return (
    <div>
      {/* Page header */}
      <Section className="bg-sand">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <SectionHeading title="Our Treatments" />
            <p className="-mt-6 text-muted">
              A curated menu of massage and wellness rituals, each designed to
              help you slow down, recover, and feel restored. Choose the
              experience that fits your moment.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Categories + filter */}
      <Section>
        <Container>
          <ServicesGrid services={services} categories={categories} />
        </Container>
      </Section>

      {/* Bottom CTA */}
      <Section className="bg-sand">
        <Container>
          <Reveal className="mx-auto max-w-xl text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-sage-dark">
              Ready to begin
            </p>
            <h2 className="mt-3 font-heading text-3xl text-charcoal sm:text-4xl">
              Not sure which treatment is right for you?
            </h2>
            <p className="mt-4 text-muted">
              Our team is happy to help you choose. Reach out and we'll guide
              you to the perfect treatment for your needs.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/booking"
                className="rounded-full bg-sage px-8 py-3 text-sm font-medium text-cream transition hover:bg-sage-dark"
              >
                Book a treatment
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-charcoal/20 px-8 py-3 text-sm font-medium text-charcoal transition hover:bg-white"
              >
                Get in touch
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>
    </div>
  );
}
