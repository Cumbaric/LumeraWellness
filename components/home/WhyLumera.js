import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";

const values = [
  {
    title: "Expert Therapists",
    description:
      "Skilled hands and years of dedicated experience in massage therapy.",
    // Award / medal
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-8"
        aria-hidden="true"
      >
        <circle cx="12" cy="9" r="6" />
        <path d="M8.5 13.5 7 22l5-3 5 3-1.5-8.5" />
      </svg>
    ),
  },
  {
    title: "Calming Atmosphere",
    description:
      "A serene, welcoming space designed to help you fully switch off.",
    // Leaf
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-8"
        aria-hidden="true"
      >
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6" />
      </svg>
    ),
  },
  {
    title: "Personalized Care",
    description: "Every treatment is tailored to your body and your needs.",
    // Heart in hand
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-8"
        aria-hidden="true"
      >
        <path d="M11 14h2a2 2 0 0 0 2-2 2 2 0 0 0-2-2H9.5a2.5 2.5 0 0 0-1.77.73L2 16" />
        <path d="m6 20 1.73-1.27A2.5 2.5 0 0 1 9.5 18H14a2 2 0 0 0 1.79-1.11l3.41-5.05a1.5 1.5 0 0 0-2.36-1.79L14.5 12" />
        <path d="M18 7.5a2 2 0 0 0-3-2.63A2 2 0 0 0 12 6a2 2 0 0 0-3-1.13A2 2 0 0 0 6 7.5C6 9.5 9 11 12 13c3-2 6-3.5 6-5.5Z" />
      </svg>
    ),
  },
];

export default function WhyLumera() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background image */}
      <Image
        src="https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?auto=format&fit=crop&w=2000&q=80"
        alt="Tranquil spa setting with soft natural light"
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />
      {/* Dark warm overlay for legibility */}
      <div className="absolute inset-0 -z-10 bg-charcoal/70" />

      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-28">
        <SectionHeading title="Why Lumera" light />

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="text-center text-cream">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/50 text-gold">
                {value.icon}
              </span>
              <h3 className="mt-6 font-heading text-xl font-semibold text-cream">
                {value.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-cream/80">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
