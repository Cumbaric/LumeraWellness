"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Reveal — subtle scroll-in reveal (fade + slight rise), built on Framer Motion.
 *
 * Props:
 *   - children
 *   - className?: string
 *   - delay?: number          seconds before the animation starts (default 0)
 *   - as?: string             motion element tag (default 'div')
 *   - stagger?: boolean        when true, acts as a container that cascades its
 *                              <RevealItem> children one after another
 *
 * Accessibility: when the user prefers reduced motion, content is rendered
 * immediately with no movement or fade.
 *
 * Usage:
 *   <Reveal>…</Reveal>
 *   <Reveal stagger className="grid …">
 *     <RevealItem>…</RevealItem>
 *     <RevealItem>…</RevealItem>
 *   </Reveal>
 */

const VIEWPORT = { once: true, amount: 0.2 };
const EASE = "easeOut";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  stagger = false,
}) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as] ?? motion.div;

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  if (stagger) {
    return (
      <MotionTag
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.12, delayChildren: delay },
          },
        }}
      >
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.5, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * RevealItem — a child of a <Reveal stagger> container. Inherits the parent's
 * animation orchestration so siblings cascade in sequence.
 */
export function RevealItem({ children, className, as = "div" }) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as] ?? motion.div;

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag className={className} variants={itemVariants}>
      {children}
    </MotionTag>
  );
}
