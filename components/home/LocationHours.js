import Link from "next/link";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import { Reveal, RevealItem } from "@/components/ui/Reveal";

const hours = [
  { day: "Monday",    open: "09:00", close: "20:00" },
  { day: "Tuesday",   open: "09:00", close: "20:00" },
  { day: "Wednesday", open: "09:00", close: "20:00" },
  { day: "Thursday",  open: "09:00", close: "20:00" },
  { day: "Friday",    open: "09:00", close: "20:00" },
  { day: "Saturday",  open: "09:00", close: "18:00" },
  { day: "Sunday",    open: null,    close: null     },
];

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0 text-gold" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0 text-gold" aria-hidden="true">
      <path d="M20 10c0 6-8 13-8 13S4 16 4 10a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0 text-gold" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function getTodayName() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: "Europe/Belgrade",
  }).format(new Date());
}

export default function LocationHours() {
  const todayName = getTodayName();

  return (
    <Section className="bg-cream">
      <Container>
        <Reveal stagger className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-start">

          {/* Left — Working hours */}
          <RevealItem>
            <div className="flex items-center gap-2 mb-6">
              <ClockIcon />
              <span className="text-sm font-medium uppercase tracking-[0.25em] text-clay">
                Working hours
              </span>
            </div>

            <h2 className="font-heading text-3xl font-semibold text-charcoal sm:text-4xl">
              When you can find us
            </h2>
            <div className="mt-2 h-0.5 w-20 bg-gold" aria-hidden="true" />

            <ul className="mt-8 divide-y divide-sage/10">
              {hours.map(({ day, open, close }) => {
                const isToday = day === todayName;
                return (
                  <li
                    key={day}
                    className={`flex items-center justify-between py-3 text-sm ${
                      isToday ? "font-semibold text-charcoal" : "text-muted"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {isToday && (
                        <span className="h-1.5 w-1.5 rounded-full bg-sage" aria-hidden="true" />
                      )}
                      {day}
                    </span>
                    <span>
                      {open ? `${open} – ${close}` : "Closed"}
                    </span>
                  </li>
                );
              })}
            </ul>

            <Link
              href="/booking"
              className="mt-8 inline-block rounded-full bg-sage px-7 py-3 text-sm font-medium text-cream transition-colors hover:bg-sage-dark"
            >
              Book an appointment
            </Link>
          </RevealItem>

          {/* Right — Location & contact */}
          <RevealItem>
            <div className="flex items-center gap-2 mb-6">
              <PinIcon />
              <span className="text-sm font-medium uppercase tracking-[0.25em] text-clay">
                Find us
              </span>
            </div>

            <h2 className="font-heading text-3xl font-semibold text-charcoal sm:text-4xl">
              Come visit us
            </h2>
            <div className="mt-2 h-0.5 w-20 bg-gold" aria-hidden="true" />

            <div className="mt-8 space-y-5">
              <div className="flex items-start gap-3">
                <PinIcon />
                <div>
                  <p className="text-sm font-semibold text-charcoal">Address</p>
                  {/* TODO: replace with real address */}
                  <p className="mt-0.5 text-sm text-muted">
                    Knez Mihailova 15<br />
                    11000 Belgrade, Serbia
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <PhoneIcon />
                <div>
                  <p className="text-sm font-semibold text-charcoal">Phone</p>
                  {/* TODO: replace with real phone */}
                  <a
                    href="tel:+381601234567"
                    className="mt-0.5 text-sm text-muted transition-colors hover:text-sage-dark"
                  >
                    +381 60 123 4567
                  </a>
                </div>
              </div>
            </div>

            {/* Map embed placeholder — replace src with real embed URL */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-sage/15 shadow-sm">
              <iframe
                title="Lumera Wellness location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2830.123456789!2d20.4612!3d44.8178!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDQ5JzA0LjEiTiAyMMKwMjcnNDEuOSJF!5e0!3m2!1sen!2srs!4v1234567890"
                width="100%"
                height="240"
                style={{ border: 0, display: "block" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <a
              href="https://maps.google.com/?q=Knez+Mihailova+15+Belgrade"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-sage-dark transition-colors hover:text-charcoal"
            >
              Open in Google Maps
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M7 7h10v10M7 17 17 7" />
              </svg>
            </a>
          </RevealItem>

        </Reveal>
      </Container>
    </Section>
  );
}
