import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background image */}
      <Image
        src="https://images.unsplash.com/photo-1488345979593-09db0f85545f?auto=format&fit=crop&w=2000&q=80"
        alt="Calm spa interior with soft natural light"
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      {/* Soft overlay for legibility */}
      <div className="absolute inset-0 -z-10 bg-charcoal/45" />

      <div className="mx-auto flex max-w-6xl flex-col items-start px-6 py-28 sm:py-36 lg:py-44">
        <h1 className="max-w-2xl font-heading text-4xl font-semibold leading-tight text-cream sm:text-5xl lg:text-6xl">
          Restore. Renew. Rebalance.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-cream/90">
          Premium massage &amp; wellness in the heart of the city.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/contact"
            className="rounded-full bg-sage px-8 py-3 text-center text-base font-medium text-cream transition-colors hover:bg-sage-dark"
          >
            Book Now
          </Link>
          <Link
            href="/services"
            className="rounded-full border border-cream/70 px-8 py-3 text-center text-base font-medium text-cream transition-colors hover:bg-cream hover:text-charcoal"
          >
            View Services
          </Link>
        </div>
      </div>
    </section>
  );
}
