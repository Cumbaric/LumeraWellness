export default function FeaturedReview() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <figure className="rounded-3xl bg-sage px-8 py-14 text-center sm:px-16 sm:py-20">
        <span aria-hidden="true" className="font-heading text-5xl text-cream/60">
          “
        </span>
        <blockquote className="mx-auto mt-2 max-w-3xl font-heading text-2xl font-medium leading-relaxed text-cream sm:text-3xl">
          An hour at Lumera feels like a small holiday. I left completely
          renewed and already booked my next visit.
        </blockquote>
        <figcaption className="mt-8 text-sm font-medium uppercase tracking-[0.2em] text-cream/80">
          Marija J.
        </figcaption>
      </figure>
    </section>
  );
}
