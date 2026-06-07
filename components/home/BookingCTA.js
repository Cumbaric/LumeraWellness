import Link from "next/link";

export default function BookingCTA() {
  return (
    <section className="bg-sage-dark text-cream">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-20 text-center sm:py-24">
        <h2 className="font-heading text-3xl font-semibold sm:text-4xl">
          Ready to unwind?
        </h2>
        <p className="mt-4 max-w-xl text-cream/80">
          Reserve your moment of calm. Our therapists are ready to help you
          relax, recover, and rebalance.
        </p>
        <Link
          href="/booking"
          className="mt-10 rounded-full bg-cream px-8 py-3 text-base font-medium text-sage-dark transition-colors hover:bg-sand"
        >
          Book Your Visit
        </Link>
      </div>
    </section>
  );
}
