import Link from "next/link";

export default function Home() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center sm:py-32">
      <h1 className="font-heading text-5xl font-semibold text-charcoal sm:text-6xl">
        Lumera Wellness
      </h1>

      <p className="mt-6 max-w-xl text-lg text-muted">
        A calm, premium space for massage &amp; wellness. This is the foundation
        of our experience — design system, fonts, and layout, all in place.
      </p>

      <Link
        href="/contact"
        className="mt-10 rounded-full bg-sage px-8 py-3 text-base font-medium text-cream transition-colors hover:bg-sage-dark"
      >
        Book Now
      </Link>
    </section>
  );
}
