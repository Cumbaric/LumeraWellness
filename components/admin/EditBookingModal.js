"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { updateAdminBooking } from "@/app/admin/reservations/actions";
import { formatDuration, formatPrice } from "@/lib/format";

const TIME_SLOTS = Array.from({ length: 11 }, (_, i) => {
  const hour = 9 + i;
  return `${String(hour).padStart(2, "0")}:00`;
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+()\d\s.-]{6,40}$/;

function getTodayBelgrade() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Belgrade",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const get = (type) => parts.find((part) => part.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-sage/20 bg-white px-3 py-2 text-sm text-charcoal outline-none transition focus:border-sage focus:ring-2 focus:ring-sage/20 disabled:bg-sand/40 disabled:text-muted";
const labelClass = "text-xs font-medium uppercase tracking-wide text-muted";
const errorClass = "mt-1 text-xs text-clay";

export default function EditBookingModal({ booking, services, onClose }) {
  const router = useRouter();
  const today = useMemo(() => getTodayBelgrade(), []);
  const titleId = useId();

  const [serviceId, setServiceId] = useState(booking.service_id || "");
  const [durationId, setDurationId] = useState(booking.service_duration_id || "");
  const [date, setDate] = useState(booking.booking_date || today);
  const [time, setTime] = useState(
    String(booking.booking_time || "").slice(0, 5)
  );
  const [name, setName] = useState(booking.guest_name || "");
  const [phone, setPhone] = useState(booking.guest_phone || "");
  const [email, setEmail] = useState(booking.guest_email || "");
  const [notes, setNotes] = useState(booking.notes || "");

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const firstFieldRef = useRef(null);

  const selectedService = useMemo(
    () => services.find((service) => service.id === serviceId) || null,
    [services, serviceId]
  );
  const durations = selectedService?.durations ?? [];

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    firstFieldRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function handleServiceChange(value) {
    setServiceId(value);
    setDurationId("");
  }

  function validate() {
    const next = {};

    if (!serviceId) next.serviceId = "Please choose a treatment.";
    if (!durationId) next.durationId = "Please choose a duration.";

    if (!date) {
      next.date = "Please choose a date.";
    } else if (date < today) {
      next.date = "Date can't be in the past.";
    }

    if (!time) next.time = "Please choose a time.";

    if (!name.trim()) {
      next.name = "Name is required.";
    }

    if (!phone.trim()) {
      next.phone = "Phone is required.";
    } else if (!PHONE_RE.test(phone.trim())) {
      next.phone = "Enter a valid phone number.";
    }

    if (!email.trim()) {
      next.email = "Email is required.";
    } else if (!EMAIL_RE.test(email.trim())) {
      next.email = "Enter a valid email address.";
    }

    return next;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    const result = await updateAdminBooking({
      bookingId: booking.id,
      serviceId,
      serviceDurationId: durationId,
      date,
      time,
      name,
      email,
      phone,
      notes,
    }).catch(() => null);

    if (result?.ok) {
      router.refresh();
      onClose();
      return;
    }

    setFormError(result?.error || "Something went wrong. Please try again.");
    setSubmitting(false);
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-charcoal/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-cream p-6 shadow-xl ring-1 ring-charcoal/10"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-sage-dark">
              Edit reservation
            </p>
            <h2
              id={titleId}
              className="mt-1 font-heading text-3xl text-charcoal"
            >
              Edit Booking
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-muted transition hover:bg-sand hover:text-charcoal"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="grid gap-4">
          <div>
            <label htmlFor="eb-service" className={labelClass}>
              Treatment
            </label>
            <select
              id="eb-service"
              ref={firstFieldRef}
              value={serviceId}
              onChange={(event) => handleServiceChange(event.target.value)}
              className={fieldClass}
            >
              <option value="">Select a treatment…</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
            {errors.serviceId && <p className={errorClass}>{errors.serviceId}</p>}
          </div>

          <div>
            <label htmlFor="eb-duration" className={labelClass}>
              Duration
            </label>
            <select
              id="eb-duration"
              value={durationId}
              onChange={(event) => setDurationId(event.target.value)}
              disabled={!selectedService}
              className={fieldClass}
            >
              <option value="">
                {selectedService
                  ? "Select a duration…"
                  : "Choose a treatment first"}
              </option>
              {durations.map((duration) => (
                <option key={duration.id} value={duration.id}>
                  {formatDuration(duration.minutes)} · {formatPrice(duration.price)}
                </option>
              ))}
            </select>
            {errors.durationId && (
              <p className={errorClass}>{errors.durationId}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="eb-date" className={labelClass}>
                Date
              </label>
              <input
                id="eb-date"
                type="date"
                value={date}
                min={today}
                onChange={(event) => setDate(event.target.value)}
                className={fieldClass}
              />
              {errors.date && <p className={errorClass}>{errors.date}</p>}
            </div>

            <div>
              <label htmlFor="eb-time" className={labelClass}>
                Time
              </label>
              <select
                id="eb-time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                className={fieldClass}
              >
                <option value="">Select a time…</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {errors.time && <p className={errorClass}>{errors.time}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="eb-name" className={labelClass}>
              Guest name
            </label>
            <input
              id="eb-name"
              type="text"
              value={name}
              maxLength={120}
              onChange={(event) => setName(event.target.value)}
              className={fieldClass}
            />
            {errors.name && <p className={errorClass}>{errors.name}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="eb-phone" className={labelClass}>
                Guest phone
              </label>
              <input
                id="eb-phone"
                type="tel"
                value={phone}
                maxLength={40}
                onChange={(event) => setPhone(event.target.value)}
                className={fieldClass}
              />
              {errors.phone && <p className={errorClass}>{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="eb-email" className={labelClass}>
                Guest email
              </label>
              <input
                id="eb-email"
                type="email"
                value={email}
                maxLength={254}
                onChange={(event) => setEmail(event.target.value)}
                className={fieldClass}
              />
              {errors.email && <p className={errorClass}>{errors.email}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="eb-notes" className={labelClass}>
              Notes <span className="normal-case text-muted/70">(optional)</span>
            </label>
            <textarea
              id="eb-notes"
              value={notes}
              maxLength={1000}
              rows={3}
              onChange={(event) => setNotes(event.target.value)}
              className={`${fieldClass} resize-none`}
            />
          </div>

          {formError && (
            <p
              role="alert"
              className="rounded-xl bg-clay/10 px-4 py-3 text-sm text-clay ring-1 ring-clay/20"
            >
              {formError}
            </p>
          )}

          <div className="mt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-muted transition hover:text-charcoal"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-sage px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-sage-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
