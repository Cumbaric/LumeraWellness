import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  return (
    <header className="border-b border-sand bg-cream/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-heading text-2xl font-semibold text-charcoal">
            Lumera
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
            Wellness
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-charcoal"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link
          href="/booking"
          className="rounded-full bg-sage px-5 py-2 text-sm font-medium text-cream transition-colors hover:bg-sage-dark"
        >
          Book Now
        </Link>
      </div>
    </header>
  );
}
