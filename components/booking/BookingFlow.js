"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatPrice, formatDuration } from "@/lib/format";
import {
  createBooking,
  getUnavailableSlotsByDate,
} from "@/app/(site)/booking/actions";

const STEPS = ["Service", "Date", "Time", "Details"];

// Mock time slots, 09:00–19:00 hourly.
const TIME_SLOTS = Array.from({ length: 11 }, (_, i) => {
  const hour = 9 + i;
  return `${String(hour).padStart(2, "0")}:00`;
});
function todayString() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function CheckIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function Stepper({ current }) {
  return (
    <ol className="mb-10 flex items-center justify-center gap-2 sm:gap-4">
      {STEPS.map((label, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === current;
        const isComplete = stepNum < current;
        return (
          <li key={label} className="flex items-center gap-2 sm:gap-4">
            <div className="flex flex-col items-center gap-2">
              <span
                className={[
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  isComplete
                    ? "bg-gold text-charcoal"
                    : isActive
                      ? "bg-sage text-cream"
                      : "bg-sand text-muted",
                ].join(" ")}
              >
                {isComplete ? <CheckIcon className="h-4 w-4" /> : stepNum}
              </span>
              <span
                className={[
                  "hidden text-xs font-medium sm:block",
                  isActive ? "text-charcoal" : "text-muted",
                ].join(" ")}
              >
                {label}
              </span>
            </div>
            {stepNum < STEPS.length && (
              <span
                className={[
                  "h-0.5 w-6 sm:w-12",
                  isComplete ? "bg-gold" : "bg-sand",
                ].join(" ")}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

const fieldClasses =
  "mt-1.5 w-full rounded-xl border border-charcoal/15 bg-cream px-4 py-2.5 text-charcoal placeholder:text-muted/60 focus:border-sage focus:outline-none focus:ring-2 focus:ring-gold/50";

const emptyDetails = { name: "", email: "", phone: "", notes: "" };
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_PHONE_LENGTH = 40;
const MAX_NOTES_LENGTH = 1000;

export default function BookingFlow({ services, initialDetails = emptyDetails }) {
  const searchParams = useSearchParams();
  const presetSlug = searchParams.get("service");
  const validPreset = services.some((s) => s.slug === presetSlug)
    ? presetSlug
    : "";
  const startingDetails = { ...emptyDetails, ...initialDetails };

  const [step, setStep] = useState(1);
  const [serviceSlug, setServiceSlug] = useState(validPreset);
  const [durationMinutes, setDurationMinutes] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [unavailableSlots, setUnavailableSlots] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState(null);
  const [details, setDetails] = useState(startingDetails);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const selectedService = services.find((s) => s.slug === serviceSlug) || null;
  const selectedDuration =
    selectedService?.durations.find((d) => d.minutes === durationMinutes) ||
    null;
  const selectedDurationId = selectedDuration?.id;

  useEffect(() => {
    let ignore = false;

    async function loadAvailability() {
      if (!date || !selectedDurationId) {
        setUnavailableSlots([]);
        setAvailabilityError(null);
        return;
      }

      setAvailabilityLoading(true);
      setAvailabilityError(null);

      try {
        const result = await getUnavailableSlotsByDate(date, selectedDurationId);

        if (ignore) {
          return;
        }

        if (result.ok) {
          setUnavailableSlots(result.slots || []);
        } else {
          setUnavailableSlots([]);
          setAvailabilityError(result.error || "Could not load availability.");
        }
      } catch (error) {
        console.error("[BookingFlow] availability error:", error);

        if (!ignore) {
          setUnavailableSlots([]);
          setAvailabilityError(
            "Could not load availability. Please try again.",
          );
        }
      } finally {
        if (!ignore) {
          setAvailabilityLoading(false);
        }
      }
    }

    loadAvailability();

    return () => {
      ignore = true;
    };
  }, [date, selectedDurationId]);

  useEffect(() => {
    if (time && unavailableSlots.includes(time)) {
      setTime("");
    }
  }, [time, unavailableSlots]);

  const handleSelectService = (slug) => {
    setServiceSlug(slug);
    setDurationMinutes(null); // durations differ per service
    setTime("");
    setUnavailableSlots([]);
    setAvailabilityError(null);
  };

  const handleSelectDuration = (minutes) => {
    setDurationMinutes(minutes);
    setTime("");
    setUnavailableSlots([]);
    setAvailabilityError(null);
  };

  const handleDetailChange = (event) => {
    const { name, value } = event.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const canContinue = () => {
    if (step === 1) return Boolean(serviceSlug && durationMinutes);
    if (step === 2) return Boolean(date);
    if (step === 3) return Boolean(time) && !availabilityLoading;
    return true;
  };

  const validateDetails = () => {
    const next = {};
    const name = details.name.trim();
    const email = details.email.trim();
    const phone = details.phone.trim();
    const notes = details.notes.trim();

    if (!name) {
      next.name = "Please enter your name.";
    } else if (name.length > MAX_NAME_LENGTH) {
      next.name = "Name is too long.";
    }

    if (!email) {
      next.email = "Please enter your email.";
    } else if (email.length > MAX_EMAIL_LENGTH) {
      next.email = "Email is too long.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Please enter a valid email address.";
    }

    if (!phone) {
      next.phone = "Please enter your phone number.";
    } else if (phone.length > MAX_PHONE_LENGTH) {
      next.phone = "Phone number is too long.";
    } else if (!/^[+()\d\s.-]{6,40}$/.test(phone)) {
      next.phone = "Please enter a valid phone number.";
    }

    if (notes.length > MAX_NOTES_LENGTH) {
      next.notes = "Notes are too long.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleConfirm = async () => {
    if (!validateDetails()) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const result = await createBooking({
        serviceId: selectedService.id,
        serviceDurationId: selectedDuration.id,
        date,
        time,
        name: details.name,
        email: details.email,
        phone: details.phone,
        notes: details.notes,
      });

      if (result.ok) {
        setSubmitted(true);
      } else {
        setSubmitError(result.error);
      }
    } catch (err) {
      console.error("[BookingFlow] unexpected error:", err);
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setStep(1);
    setServiceSlug("");
    setDurationMinutes(null);
    setDate("");
    setTime("");
    setDetails(startingDetails);
    setErrors({});
    setSubmitError(null);
  };

  const goBack = () => setStep((s) => Math.max(1, s - 1));
  const goNext = () => setStep((s) => Math.min(STEPS.length, s + 1));

  /* ---------- Confirmation ---------- */
  if (submitted) {
    return (
      <div className="rounded-2xl bg-sand p-8 text-center ring-1 ring-charcoal/10 sm:p-12">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage text-cream">
          <CheckIcon className="h-8 w-8" />
        </span>
        <h2 className="mt-6 font-heading text-3xl font-semibold text-charcoal">
          Booking Request Received
        </h2>
        <p className="mt-2 text-sm text-muted">
          We&apos;ll be in touch to confirm your appointment.
        </p>

        <div className="mx-auto mt-8 max-w-md rounded-xl bg-cream p-6 text-left ring-1 ring-charcoal/10">
          <dl className="space-y-3 text-sm">
            <SummaryRow label="Treatment" value={selectedService?.name} />
            <SummaryRow
              label="Duration"
              value={formatDuration(selectedDuration.minutes)}
            />
            <SummaryRow
              label="Price"
              value={formatPrice(selectedDuration.price)}
            />
            <SummaryRow label="Date" value={date} />
            <SummaryRow label="Time" value={time} />
            <div className="border-t border-charcoal/10 pt-3" />
            <SummaryRow label="Name" value={details.name} />
            <SummaryRow label="Email" value={details.email} />
            <SummaryRow label="Phone" value={details.phone} />
            {details.notes.trim() && (
              <SummaryRow label="Notes" value={details.notes} />
            )}
          </dl>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="mt-8 text-sm font-medium text-sage transition-colors hover:text-sage-dark"
        >
          Make another booking
        </button>
      </div>
    );
  }

  /* ---------- Wizard ---------- */
  return (
    <div>
      <Stepper current={step} />

      <div className="rounded-2xl bg-sand p-6 ring-1 ring-charcoal/10 sm:p-8">
        {/* Step 1 — Service & duration */}
        {step === 1 && (
          <div>
            <h2 className="font-heading text-2xl font-semibold text-charcoal">
              Choose your treatment
            </h2>
            <div className="mt-6 space-y-3">
              {services.map((service) => {
                const isSelected = service.slug === serviceSlug;
                const lowest = Math.min(
                  ...service.durations.map((d) => d.price),
                );
                return (
                  <div
                    key={service.id}
                    className={[
                      "rounded-xl border bg-cream p-5 transition-colors",
                      isSelected
                        ? "border-sage ring-1 ring-sage"
                        : "border-charcoal/10",
                    ].join(" ")}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectService(service.slug)}
                      className="flex w-full items-start justify-between gap-4 text-left"
                      aria-pressed={isSelected}
                    >
                      <span>
                        <span className="block font-medium text-charcoal">
                          {service.name}
                        </span>
                        <span className="mt-1 block text-sm text-muted">
                          {service.shortDescription}
                        </span>
                      </span>
                      <span className="shrink-0 text-sm text-muted">
                        from{" "}
                        <span className="font-medium text-sage-dark">
                          {formatPrice(lowest)}
                        </span>
                      </span>
                    </button>

                    {isSelected && (
                      <div className="mt-4 flex flex-wrap gap-2 border-t border-charcoal/10 pt-4">
                        {service.durations.map((d) => {
                          const active = d.minutes === durationMinutes;
                          return (
                            <button
                              key={d.minutes}
                              type="button"
                              onClick={() => handleSelectDuration(d.minutes)}
                              aria-pressed={active}
                              className={[
                                "rounded-full px-4 py-2 text-sm transition-colors",
                                active
                                  ? "bg-sage text-cream"
                                  : "bg-sand text-charcoal hover:bg-sand/70",
                              ].join(" ")}
                            >
                              {formatDuration(d.minutes)} —{" "}
                              {formatPrice(d.price)}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2 — Date */}
        {step === 2 && (
          <div>
            <h2 className="font-heading text-2xl font-semibold text-charcoal">
              Pick a date
            </h2>
            <div className="mt-6 max-w-xs">
              <label
                htmlFor="date"
                className="text-sm font-medium text-charcoal"
              >
                Preferred date
              </label>
              <input
                id="date"
                type="date"
                min={todayString()}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setTime("");
                  setUnavailableSlots([]);
                  setAvailabilityError(null);
                }}
                className={fieldClasses}
              />
            </div>
          </div>
        )}

        {/* Step 3 — Time slot */}
        {step === 3 && (
          <div>
            <h2 className="font-heading text-2xl font-semibold text-charcoal">
              Choose a time
            </h2>
            <p className="mt-2 text-sm text-muted">
              Greyed-out times are already booked or waiting for confirmation.
            </p>

            {availabilityLoading ? (
              <p className="mt-3 text-sm text-sage-dark">
                Checking latest availability…
              </p>
            ) : null}

            {availabilityError ? (
              <p role="alert" className="mt-3 text-sm text-clay">
                {availabilityError}
              </p>
            ) : null}

            <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {TIME_SLOTS.map((slot) => {
                const unavailable = unavailableSlots.includes(slot);
                const active = slot === time;
                const disabled = availabilityLoading || unavailable;

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={disabled}
                    onClick={() => setTime(slot)}
                    aria-pressed={active}
                    className={[
                      "rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      availabilityLoading
                        ? "cursor-wait bg-sand/50 text-muted/50"
                        : unavailable
                          ? "cursor-not-allowed bg-sand/50 text-muted/50 line-through"
                          : active
                            ? "bg-sage text-cream"
                            : "bg-cream text-charcoal ring-1 ring-charcoal/10 hover:ring-sage",
                    ].join(" ")}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4 — Details */}
        {step === 4 && (
          <div>
            <h2 className="font-heading text-2xl font-semibold text-charcoal">
              Your details
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-charcoal"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  maxLength={MAX_NAME_LENGTH}
                  value={details.name}
                  onChange={handleDetailChange}
                  placeholder="Your name"
                  aria-invalid={Boolean(errors.name)}
                  className={fieldClasses}
                />
                {errors.name && (
                  <p className="mt-1.5 text-sm text-clay">{errors.name}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-charcoal"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  maxLength={MAX_EMAIL_LENGTH}
                  value={details.email}
                  onChange={handleDetailChange}
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                  className={fieldClasses}
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-clay">{errors.email}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-charcoal"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  maxLength={MAX_PHONE_LENGTH}
                  value={details.phone}
                  onChange={handleDetailChange}
                  placeholder="+381 ..."
                  aria-invalid={Boolean(errors.phone)}
                  className={fieldClasses}
                />
                {errors.phone && (
                  <p className="mt-1.5 text-sm text-clay">{errors.phone}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="notes"
                  className="text-sm font-medium text-charcoal"
                >
                  Notes <span className="text-muted">(optional)</span>
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  maxLength={MAX_NOTES_LENGTH}
                  value={details.notes}
                  onChange={handleDetailChange}
                  placeholder="Anything we should know?"
                  className={`${fieldClasses} resize-y`}
                />
                {errors.notes && (
                  <p className="mt-1.5 text-sm text-clay">{errors.notes}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Nav buttons */}
        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1 || submitting}
            className="rounded-full px-6 py-2.5 text-sm font-medium text-charcoal transition-colors enabled:hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
          >
            Back
          </button>

          {step < STEPS.length ? (
            <button
              type="button"
              onClick={goNext}
              disabled={!canContinue()}
              className="rounded-full bg-sage px-8 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-sage-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirm}
              disabled={submitting}
              className="rounded-full bg-sage px-8 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-sage-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? "Saving…" : "Confirm Booking"}
            </button>
          )}
        </div>

        {/* Submission error — only shown after a failed confirm attempt */}
        {submitError && (
          <p
            role="alert"
            aria-live="assertive"
            className="mt-4 text-center text-sm text-clay"
          >
            {submitError}
          </p>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium text-charcoal">{value}</dd>
    </div>
  );
}
