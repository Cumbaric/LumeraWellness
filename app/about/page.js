import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import { Reveal, RevealItem } from "@/components/ui/Reveal";

export const metadata = {
  title: "About Us",
  description:
    "Learn about Lumera Wellness — our story, our values, and the calm, personalized care behind every treatment.",
  openGraph: {
    title: "About Us | Lumera Wellness",
    description:
      "Learn about Lumera Wellness — our story, our values, and the calm, personalized care behind every treatment.",
    url: "https://lumera-wellness.vercel.app/about",
  },
  twitter: {
    title: "About Us | Lumera Wellness",
    description:
      "Learn about Lumera Wellness — our story, our values, and the calm, personalized care behind every treatment.",
  },
  alternates: { canonical: "/about" },
};

const IMG = "auto=format&fit=crop&q=80";

const values = [
  {
    title: "Mindful Calm",
    description: "A peaceful space designed to quiet the mind.",
    icon: (
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z M2 21c0-3 1.85-5.36 5.08-6" />
    ),
  },
  {
    title: "Expert Care",
    description: "Experienced therapists who tailor every session.",
    icon: (
      <>
        <circle cx="12" cy="8" r="5" />
        <path d="M20 21a8 8 0 0 0-16 0" />
      </>
    ),
  },
  {
    title: "Personalized Touch",
    description: "Treatments adapted to your body and needs.",
    icon: (
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    ),
  },
  {
    title: "Pure Hygiene",
    description: "Spotless spaces and fresh linens, every visit.",
    icon: (
      <>
        <path d="M9 12l2 2 4-4" />
        <path d="M12 3 4 6v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V6l-8-3Z" />
      </>
    ),
  },
];

const gallery = [
  {
    src: `https://images.unsplash.com/photo-1554424518-336ec861b705?${IMG}&w=900`,
    alt: "Softly lit spa treatment room",
  },
  {
    src: `https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?${IMG}&w=900`,
    alt: "Calming wellness space with natural textures",
  },
  {
    src: `https://images.unsplash.com/photo-1488345979593-09db0f85545f?${IMG}&w=900`,
    alt: "Serene spa interior with soft daylight",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-cream">
      {/* 1. Intro */}
      <Section className="bg-sand">
        <Container>
          <Reveal className="mx-auto max-w-3xl text-center">
            <SectionHeading label="About Us" title="A calm escape in the city" />
            <p className="-mt-6 text-lg leading-relaxed text-muted">
              Lumera Wellness was created around a simple idea — that everyone
              deserves a moment of true calm. We blend skilled massage therapy
              with a serene environment to help you slow down, breathe, and feel
              restored.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* 2. Our Story */}
      <Section>
        <Container>
          <Reveal className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-heading text-3xl font-semibold text-charcoal sm:text-4xl">
              Our Story
            </h2>
            <div className="mt-3 h-0.5 w-20 bg-gold" aria-hidden="true" />
            <p className="mt-6 leading-relaxed text-muted">
              Lumera began with a small team of therapists who believed wellness
              should feel personal, never rushed. What started as a single
              treatment room has grown into a calm retreat in the heart of the
              city — but our approach has stayed exactly the same.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Every visit is built around you. We take the time to understand
              what your body needs, adapt each session accordingly, and create a
              quiet, welcoming space where you can truly switch off. That care is
              at the heart of everything we do.
            </p>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-charcoal/10">
            <Image
              src={`https://images.unsplash.com/photo-1583417267826-aebc4d1542e1?${IMG}&w=1200`}
              alt="Tranquil Lumera treatment space"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          </Reveal>
        </Container>
      </Section>

      {/* 3. Our Values */}
      <Section className="bg-sand">
        <Container>
          <Reveal>
            <SectionHeading label="Our Values" title="What we stand for" />
          </Reveal>
          <Reveal
            stagger
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {values.map((value) => (
              <RevealItem
                key={value.title}
                className="rounded-2xl bg-cream p-8 ring-1 ring-charcoal/10"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-sage"
                  aria-hidden="true"
                >
                  {value.icon}
                </svg>
                <h3 className="mt-5 font-heading text-xl font-semibold text-charcoal">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {value.description}
                </p>
              </RevealItem>
            ))}
          </Reveal>
        </Container>
      </Section>

      {/* 4. The Space */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeading label="The Space" title="Step inside Lumera" />
          </Reveal>
          <Reveal stagger className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {gallery.map((image) => (
            <RevealItem
              key={image.src}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-charcoal/10"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 640px) 33vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </RevealItem>
          ))}
          </Reveal>
        </Container>
      </Section>

      {/* 5. Closing CTA */}
      <Section className="bg-sage-dark text-cream">
        <Container className="flex flex-col items-center text-center">
          <Reveal className="flex w-full flex-col items-center">
          <h2 className="font-heading text-3xl font-semibold sm:text-4xl">
            Ready to unwind?
          </h2>
          <p className="mt-4 max-w-xl text-cream/80">
            Treat yourself to a moment of calm. Book your visit and let our
            therapists take care of the rest.
          </p>
          <Link
            href="/booking"
            className="mt-10 rounded-full bg-cream px-8 py-3 text-base font-medium text-sage-dark transition-colors hover:bg-sand"
          >
            Book Your Visit
          </Link>
          </Reveal>
        </Container>
      </Section>
    </div>
  );
}
