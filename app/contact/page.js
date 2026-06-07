import SectionHeading from "@/components/ui/SectionHeading";
import ContactForm from "@/components/contact/ContactForm";

export const metadata = {
  title: "Contact | Lumera Wellness",
  description:
    "Get in touch with Lumera Wellness — find our address, opening hours, and send us a message to book your next treatment.",
};

const hours = [
  { label: "Mon – Fri", value: "9:00 – 21:00" },
  { label: "Saturday", value: "10:00 – 18:00" },
  { label: "Sunday", value: "Closed" },
];

/* Inline icons (consistent with the footer) */
const MailIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 shrink-0 text-gold"
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
    className="h-5 w-5 shrink-0 text-gold"
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
    className="h-5 w-5 shrink-0 text-gold"
    aria-hidden="true"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

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

export default function ContactPage() {
  return (
    <div className="bg-cream">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        {/* Header */}
        <div className="text-center">
          <SectionHeading label="Get in Touch" title="Contact Us" />
          <p className="-mt-6 mx-auto max-w-xl text-muted">
            Have a question or want to book a treatment? Send us a message and
            we&apos;ll get back to you shortly.
          </p>
        </div>

        {/* Two columns */}
        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Left: contact info */}
          <div>
            <h2 className="font-heading text-2xl font-semibold text-charcoal">
              Visit or reach us
            </h2>

            <ul className="mt-6 space-y-4 text-charcoal">
              <li>
                <a
                  href="mailto:hello@lumerawellness.com"
                  className="flex items-center gap-3 transition-colors hover:text-sage"
                >
                  <MailIcon />
                  <span>hello@lumerawellness.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+381112345678"
                  className="flex items-center gap-3 transition-colors hover:text-sage"
                >
                  <PhoneIcon />
                  <span>+381 11 234 5678</span>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <PinIcon />
                <span>14 Riverside Walk, Belgrade</span>
              </li>
            </ul>

            {/* Opening hours */}
            <div className="mt-8">
              <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-clay">
                Opening Hours
              </h3>
              <ul className="mt-4 max-w-xs space-y-2 text-sm">
                {hours.map((row) => (
                  <li key={row.label} className="flex justify-between gap-4">
                    <span className="text-muted">{row.label}</span>
                    <span className="text-charcoal">{row.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Socials */}
            <div className="mt-8">
              <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-clay">
                Follow Us
              </h3>
              <div className="mt-4 flex gap-4">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-sand text-charcoal transition-colors hover:bg-sage hover:text-cream"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: form */}
          <ContactForm />
        </div>

        {/* Map */}
        <div className="mt-14">
          <div className="overflow-hidden rounded-2xl ring-1 ring-charcoal/10">
            <iframe
              title="Lumera Wellness location on Google Maps"
              src="https://www.google.com/maps?q=Belgrade,Serbia&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[16/9] w-full border-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
