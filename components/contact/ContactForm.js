"use client";

import { useState } from "react";

const initialValues = { name: "", email: "", phone: "", message: "" };

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!values.email.trim()) {
    errors.email = "Please enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (!values.message.trim()) errors.message = "Please enter a message.";
  return errors;
}

export default function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    // TODO: connect to Supabase / email service
    // No network call yet — this is a demo form. We only update local state.
    setSubmitted(true);
    setValues(initialValues);
  };

  const fieldClasses =
    "mt-1.5 w-full rounded-xl border border-charcoal/15 bg-cream px-4 py-2.5 text-charcoal placeholder:text-muted/60 focus:border-sage focus:outline-none focus:ring-2 focus:ring-gold/50";

  return (
    <div className="rounded-2xl bg-sand p-8 ring-1 ring-charcoal/10 sm:p-10">
      {submitted && (
        <div
          role="status"
          className="mb-6 rounded-xl border border-gold/50 bg-cream p-4 text-sm text-charcoal"
        >
          Thanks for reaching out! This is a demo form — message sending will be
          connected soon.
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Name */}
        <div className="mb-5">
          <label htmlFor="name" className="text-sm font-medium text-charcoal">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            placeholder="Your name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={fieldClasses}
          />
          {errors.name && (
            <p id="name-error" className="mt-1.5 text-sm text-clay">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="mb-5">
          <label htmlFor="email" className="text-sm font-medium text-charcoal">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={fieldClasses}
          />
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-sm text-clay">
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone (optional) */}
        <div className="mb-5">
          <label htmlFor="phone" className="text-sm font-medium text-charcoal">
            Phone <span className="text-muted">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={handleChange}
            placeholder="+381 ..."
            className={fieldClasses}
          />
        </div>

        {/* Message */}
        <div className="mb-6">
          <label
            htmlFor="message"
            className="text-sm font-medium text-charcoal"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={values.message}
            onChange={handleChange}
            placeholder="How can we help you?"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
            className={`${fieldClasses} resize-y`}
          />
          {errors.message && (
            <p id="message-error" className="mt-1.5 text-sm text-clay">
              {errors.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="rounded-full bg-sage px-8 py-3 text-base font-medium text-cream transition-colors hover:bg-sage-dark"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
