import Link from "next/link";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const socials = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M14 9h3V6h-3a4 4 0 0 0-4 4v2H7v3h3v6h3v-6h2.5l.5-3h-3v-1.5A1.5 1.5 0 0 1 14 9Z" />
      </svg>
    ),
  },
];

// Small inline icons for the contact rows.
const MailIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 shrink-0 text-gold"
    aria-hidden="true"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 shrink-0 text-gold"
    aria-hidden="true"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
  </svg>
);

const PinIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 shrink-0 text-gold"
    aria-hidden="true"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const hours = [
  { label: "Mon – Fri", value: "9:00 – 21:00" },
  { label: "Saturday", value: "10:00 – 18:00" },
  { label: "Sunday", value: "Closed" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-sage-dark text-cream">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1 — Brand */}
          <div>
            <span className="font-heading text-2xl font-semibold text-cream">
              Lumera Wellness
            </span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/80">
              Restorative massage &amp; mindful wellness, crafted for moments of
              calm.
            </p>
            <div className="mt-6 flex gap-4">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="text-cream transition-colors hover:text-gold"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-gold">
              Explore
            </h2>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream/90 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Contact */}
          <div>
            <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-gold">
              Contact
            </h2>
            <ul className="mt-5 space-y-4 text-sm text-cream/90">
              <li>
                <a
                  href="mailto:hello@lumerawellness.com"
                  className="flex items-start gap-3 transition-colors hover:text-gold"
                >
                  <MailIcon />
                  <span>hello@lumerawellness.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+381112345678"
                  className="flex items-start gap-3 transition-colors hover:text-gold"
                >
                  <PhoneIcon />
                  <span>+381 11 234 5678</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <PinIcon />
                <span>14 Riverside Walk, Belgrade</span>
              </li>
            </ul>
          </div>

          {/* Column 4 — Opening Hours */}
          <div>
            <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-gold">
              Opening Hours
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {hours.map((row) => (
                <li key={row.label} className="flex justify-between gap-4">
                  <span className="text-cream/70">{row.label}</span>
                  <span className="text-cream/90">{row.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center gap-2 border-t border-cream/20 pt-6 text-xs text-cream/70 sm:flex-row sm:justify-between">
          <p>&copy; {year} Lumera Wellness. All rights reserved.</p>
          <p className="text-cream/50">Crafted with care.</p>
        </div>
      </div>
    </footer>
  );
}
