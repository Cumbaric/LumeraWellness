"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // A link is active on an exact match; non-home links also stay active on
  // nested routes (e.g. "/services" is active on "/services/[slug]").
  const isActive = (href) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  // Lock body scroll and close on Escape while the menu is open.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-sand bg-cream/80 backdrop-blur md:static">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" onClick={close} className="flex items-baseline gap-2">
            <span className="font-heading text-2xl font-semibold text-charcoal">
              Lumera
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
              Wellness
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-sm transition-colors ${
                    active
                      ? "font-medium text-gold"
                      : "text-muted hover:text-charcoal"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <Link
            href="/booking"
            className="hidden rounded-full bg-sage px-5 py-2 text-sm font-medium text-cream transition-colors hover:bg-sage-dark md:inline-block"
          >
            Book Now
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="relative z-50 text-charcoal md:hidden"
          >
            {isOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </header>

      {/* Mobile menu overlay — rendered OUTSIDE the header so its `fixed`
          positioning resolves against the viewport. (A `backdrop-filter`
          ancestor would otherwise become the containing block, collapsing the
          overlay to the header's height.) */}
      {isOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Main menu"
          className="fixed inset-0 z-40 flex flex-col overscroll-contain bg-sage-dark px-6 pb-10 pt-24 md:hidden"
        >
          <nav className="flex flex-col gap-6">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={close}
                  aria-current={active ? "page" : undefined}
                  className={`text-2xl font-medium transition-colors ${
                    active
                      ? "border-l-2 border-gold pl-4 text-gold"
                      : "text-cream hover:text-gold"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/booking"
            onClick={close}
            className="mt-auto rounded-full bg-cream px-8 py-3 text-center text-base font-medium text-charcoal transition-colors hover:bg-sand"
          >
            Book Now
          </Link>
        </div>
      )}
    </>
  );
}
