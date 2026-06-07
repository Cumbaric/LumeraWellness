import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[70vh] items-center overflow-hidden lg:min-h-[85vh]">
      {/* Background image */}
      <Image
        src="https://images.unsplash.com/photo-1488345979593-09db0f85545f?auto=format&fit=crop&w=2000&q=80"
        alt="Calm spa interior with soft natural light"
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      {/* Warm dark overlay for legibility */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-charcoal/70 via-charcoal/50 to-sage-dark/70" />

      <Container className="flex flex-col items-center py-24 text-center sm:py-32">
        <span className="text-sm font-medium uppercase tracking-[0.35em] text-cream/90">
          Welcome to
        </span>
        <h1 className="mt-4 font-heading text-4xl font-semibold uppercase tracking-wide text-cream sm:text-6xl lg:text-7xl">
          Lumera Wellness
        </h1>
        <p className="mt-6 text-lg text-cream/80 sm:text-xl">
          Restore. Renew. Rebalance.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/booking"
            className="rounded-full bg-cream px-8 py-3 text-center text-base font-medium text-charcoal transition-colors hover:bg-sand"
          >
            Book Now
          </Link>
          <Link
            href="/pricing"
            className="rounded-full border border-cream/70 px-8 py-3 text-center text-base font-medium text-cream transition-colors hover:bg-cream hover:text-charcoal"
          >
            View Pricing
          </Link>
        </div>
      </Container>
    </section>
  );
}
