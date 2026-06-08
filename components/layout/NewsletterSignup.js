"use client";

import { useState } from "react";

function validateEmail(email) {
  if (!email.trim()) return "Please enter your email address.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    return "Please enter a valid email address.";
  return null;
}

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationError = validateEmail(email);
    setError(validationError);
    if (validationError) return;

    // TODO: connect newsletter to Supabase or email service (Mailchimp/Brevo)
    // No network call — demo only.
    setSubscribed(true);
    setEmail("");
  };

  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      {/* Label + description */}
      <div className="md:max-w-xs">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
          Newsletter
        </p>
        <p className="mt-1 text-sm text-cream/80">
          Join our newsletter for offers and wellness tips.
        </p>
      </div>

      {/* Success confirmation or input form */}
      {subscribed ? (
        <p role="status" className="text-sm text-cream/80 md:max-w-sm">
          Thanks for subscribing! This is a demo — newsletter signup will be
          connected soon.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-1 flex-col gap-2 sm:flex-row md:max-w-md"
        >
          <div className="flex flex-1 flex-col gap-1.5">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="your@email.com"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "newsletter-email-error" : undefined}
              className="rounded-full border border-cream/20 bg-cream/10 px-4 py-2.5 text-sm text-cream placeholder:text-cream/40 focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
            {error && (
              <p id="newsletter-email-error" className="px-2 text-xs text-gold">
                {error}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="shrink-0 rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-charcoal transition-opacity hover:opacity-90"
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}
