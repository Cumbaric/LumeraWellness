"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

const SIZE = 12;
const INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, label, [role="button"], [data-cursor]';

/**
 * CustomCursor — a subtle, decorative gold dot that trails the pointer with a
 * gentle spring lag and grows over interactive elements.
 *
 * Additive: the real system cursor stays visible (we never set `cursor: none`).
 * Disabled entirely on touch / coarse-pointer devices and under
 * prefers-reduced-motion. Always `pointer-events: none`, so it can never block
 * clicks, typing, or text selection.
 */
export default function CustomCursor() {
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  // Raw pointer position, smoothed by a gentle spring for the trailing feel.
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    if (reduceMotion) return;
    // Only enable for fine pointers (mouse/trackpad), never on touch devices.
    if (!window.matchMedia("(pointer: fine)").matches) return;

    setEnabled(true);

    const handleMove = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };

    const handleOver = (event) => {
      const target = event.target;
      setHovering(
        Boolean(target?.closest && target.closest(INTERACTIVE_SELECTOR))
      );
    };

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseover", handleOver);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
    };
  }, [reduceMotion, x, y]);

  if (reduceMotion || !enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full bg-gold"
      style={{
        width: SIZE,
        height: SIZE,
        marginLeft: -SIZE / 2,
        marginTop: -SIZE / 2,
        x: springX,
        y: springY,
        boxShadow: "0 0 12px 2px rgba(192, 160, 98, 0.35)",
      }}
      animate={{
        scale: hovering ? 2.3 : 1,
        opacity: hovering ? 0.85 : 0.65,
      }}
      transition={{ type: "spring", damping: 25, stiffness: 250, mass: 0.5 }}
    />
  );
}
