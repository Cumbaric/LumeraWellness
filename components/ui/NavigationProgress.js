"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function NavigationProgress() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const [completing, setCompleting] = useState(false);
  const stepTimers = useRef([]);

  function clearStepTimers() {
    stepTimers.current.forEach(clearTimeout);
    stepTimers.current = [];
  }

  function start() {
    clearStepTimers();
    setCompleting(false);
    setVisible(true);
    setWidth(18);

    const steps = [
      [35, 250],
      [52, 600],
      [66, 1100],
      [76, 1800],
      [84, 3000],
      [90, 5000],
    ];
    stepTimers.current = steps.map(([w, delay]) =>
      setTimeout(() => setWidth(w), delay)
    );
  }

  function finish() {
    clearStepTimers();
    setCompleting(true);
    setWidth(100);
    // Fade out after bar reaches 100 %
    const t1 = setTimeout(() => setVisible(false), 500);
    const t2 = setTimeout(() => {
      setWidth(0);
      setCompleting(false);
    }, 550);
    stepTimers.current = [t1, t2];
  }

  // Detect navigation end
  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      finish();
    }
  }, [pathname]);

  // Intercept <a> clicks for internal routes
  useEffect(() => {
    const handleClick = (e) => {
      const anchor = e.composedPath().find((el) => el instanceof HTMLAnchorElement);
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("http") ||
        href.startsWith("mailto") ||
        anchor.target === "_blank"
      )
        return;
      // Only trigger if navigating to a different route
      if (href === pathname) return;
      start();
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      clearStepTimers();
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-[2px]"
      style={{
        width: `${width}%`,
        background: "linear-gradient(90deg, #c0a062, #d4b87a)",
        opacity: completing ? 0 : 1,
        transition: completing
          ? "opacity 250ms ease 200ms, width 200ms ease-out"
          : "width 500ms cubic-bezier(0.22, 1, 0.36, 1)",
        boxShadow: "0 0 8px rgba(192, 160, 98, 0.6)",
      }}
    />
  );
}
