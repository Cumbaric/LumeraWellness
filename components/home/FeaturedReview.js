"use client";

import { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const reviews = [
  {
    name: "Marija J.",
    rating: 5,
    quote:
      "An hour at Lumera feels like a small holiday. I left completely renewed and already booked my next visit.",
  },
  {
    name: "Stefan K.",
    rating: 5,
    quote:
      "The deep tissue session worked out months of tension. Professional, calming, and genuinely effective.",
  },
  {
    name: "Ana P.",
    rating: 5,
    quote:
      "Beautiful space, warm staff, and the most relaxing massage I have had in years. Highly recommended.",
  },
];

function StarRating({ rating }) {
  return (
    <div
      className="flex gap-0.5"
      role="img"
      aria-label={`Rated ${rating} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`h-4 w-4 ${i < rating ? "text-gold" : "text-muted/40"}`}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="m12 2 2.92 6.26 6.88.58-5.23 4.52 1.6 6.74L12 16.9l-6.17 3.7 1.6-6.74L2.2 8.84l6.88-.58L12 2Z" />
        </svg>
      ))}
    </div>
  );
}

function Chevron({ direction = "left" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      {direction === "left" ? (
        <path d="m15 18-6-6 6-6" />
      ) : (
        <path d="m9 18 6-6-6-6" />
      )}
    </svg>
  );
}

export default function FeaturedReview() {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = reviews.length;

  const goTo = (index) => setActiveIndex((index + total) % total);
  const prev = () => goTo(activeIndex - 1);
  const next = () => goTo(activeIndex + 1);

  const review = reviews[activeIndex];
  const initial = review.name.charAt(0);

  return (
    <Section className="bg-cream">
      <Container>
        <Reveal>
        <SectionHeading label="Testimonials" title="What our guests say" />

        <div className="flex items-center justify-center gap-3 sm:gap-6">
          {/* Prev arrow */}
          <button
            type="button"
            onClick={prev}
            aria-label="Previous review"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-sand text-sage transition-colors hover:bg-sage hover:text-cream"
          >
            <Chevron direction="left" />
          </button>

          {/* Review card */}
          <figure className="w-full max-w-[640px] rounded-3xl bg-sand p-8 shadow-md sm:p-10">
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage font-heading text-xl font-semibold text-cream"
              >
                {initial}
              </span>
              <div>
                <figcaption className="font-medium text-charcoal">
                  {review.name}
                </figcaption>
                <StarRating rating={review.rating} />
              </div>
            </div>

            <blockquote className="mt-6 text-lg leading-relaxed text-charcoal/90">
              “{review.quote}”
            </blockquote>
          </figure>

          {/* Next arrow */}
          <button
            type="button"
            onClick={next}
            aria-label="Next review"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-sand text-sage transition-colors hover:bg-sage hover:text-cream"
          >
            <Chevron direction="right" />
          </button>
        </div>

        {/* Dots */}
        <div className="mt-8 flex justify-center gap-3">
          {reviews.map((item, index) => (
            <button
              key={item.name}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Go to review ${index + 1}`}
              aria-current={index === activeIndex}
              className={`h-2.5 rounded-full transition-all ${
                index === activeIndex
                  ? "w-6 bg-gold"
                  : "w-2.5 bg-muted/40 hover:bg-muted"
              }`}
            />
          ))}
        </div>
        </Reveal>
      </Container>
    </Section>
  );
}
