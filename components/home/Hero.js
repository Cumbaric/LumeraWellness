"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Hero() {
  const reduceMotion = useReducedMotion();

  // When reduced motion is preferred, drop all animation props so content shows
  // immediately.
  const containerMotion = reduceMotion
    ? {}
    : { initial: "hidden", animate: "visible", variants: containerVariants };
  const itemMotion = reduceMotion ? {} : { variants: itemVariants };

  return (
    <section className="relative isolate flex min-h-[70vh] items-center overflow-hidden lg:min-h-[85vh]">
      {/* Background image (static) */}
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

      <Container className="py-24 text-center sm:py-32">
        <motion.div
          {...containerMotion}
          className="flex flex-col items-center"
        >
          <motion.span
            {...itemMotion}
            className="text-sm font-medium uppercase tracking-[0.35em] text-cream/90"
          >
            Welcome to
          </motion.span>
          <motion.h1
            {...itemMotion}
            className="mt-4 font-heading text-4xl font-semibold uppercase tracking-wide text-cream sm:text-6xl lg:text-7xl"
          >
            Lumera Wellness
          </motion.h1>
          <motion.p
            {...itemMotion}
            className="mt-6 text-lg text-cream/80 sm:text-xl"
          >
            Restore. Renew. Rebalance.
          </motion.p>

          <motion.div
            {...itemMotion}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
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
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
