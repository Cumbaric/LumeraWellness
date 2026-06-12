"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import { createClient } from "@/lib/supabase/client";

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
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const lastScrollY = useRef(0);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const isActive = (href) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (isMounted) {
        setUser(user ?? null);
        setIsAuthLoading(false);
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    let ticking = false;

    const updateHeader = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY.current;

      setHasScrolled(currentScrollY > 10);

      if (isOpen || currentScrollY < 80) {
        setIsHeaderHidden(false);
      } else {
        setIsHeaderHidden(isScrollingDown);
      }

      lastScrollY.current = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    updateHeader();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsOpen(false);
    router.refresh();
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b backdrop-blur transition-[transform,opacity,box-shadow,background-color] duration-300 ease-out will-change-transform ${
          isHeaderHidden
            ? "pointer-events-none -translate-y-full opacity-0"
            : "translate-y-0 opacity-100"
        } ${
          hasScrolled
            ? "border-sage/15 bg-cream/90 shadow-sm"
            : "border-sand bg-cream/80"
        }`}
      >
        <Container className="flex items-center justify-between py-4">
          <Link href="/" onClick={close} className="flex items-baseline gap-2">
            <span className="font-heading text-2xl font-semibold text-charcoal">
              Lumera
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
              Wellness
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`link-underline text-sm transition-colors ${
                    active
                      ? "link-underline-active font-medium text-gold"
                      : "text-muted hover:text-charcoal"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            {!isAuthLoading && user ? (
              <>
                <Link
                  href="/account/bookings"
                  className="text-sm font-medium text-muted transition-colors hover:text-charcoal"
                >
                  My Bookings
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-sm font-medium text-muted transition-colors hover:text-charcoal"
                >
                  Logout
                </button>
              </>
            ) : null}

            {!isAuthLoading && !user ? (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-muted transition-colors hover:text-charcoal"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="text-sm font-medium text-muted transition-colors hover:text-charcoal"
                >
                  Register
                </Link>
              </>
            ) : null}

            <Link
              href="/booking"
              className="rounded-full bg-sage px-5 py-2 text-sm font-medium text-cream transition-colors hover:bg-sage-dark"
            >
              Book Now
            </Link>
          </div>

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
        </Container>
      </header>

      {isOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Main menu"
          className="fixed inset-0 z-40 flex flex-col overscroll-contain bg-sage-dark px-4 pb-10 pt-24 sm:px-6 md:hidden"
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

          <div className="mt-10 flex flex-col gap-4 border-t border-cream/15 pt-6">
            {!isAuthLoading && user ? (
              <>
                <Link
                  href="/account/bookings"
                  onClick={close}
                  className="text-xl font-medium text-cream transition-colors hover:text-gold"
                >
                  My Bookings
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-left text-xl font-medium text-cream transition-colors hover:text-gold"
                >
                  Logout
                </button>
              </>
            ) : null}

            {!isAuthLoading && !user ? (
              <>
                <Link
                  href="/login"
                  onClick={close}
                  className="text-xl font-medium text-cream transition-colors hover:text-gold"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={close}
                  className="text-xl font-medium text-cream transition-colors hover:text-gold"
                >
                  Register
                </Link>
              </>
            ) : null}
          </div>

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