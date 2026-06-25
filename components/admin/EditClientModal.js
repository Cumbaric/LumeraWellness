"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { updateAdminClient, saveClientFromBooking } from "@/app/admin/actions";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+()\d\s.-]{6,40}$/;

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-sage/20 bg-white px-3 py-2 text-sm text-charcoal outline-none transition focus:border-sage focus:ring-2 focus:ring-sage/20";
const labelClass = "text-xs font-medium uppercase tracking-wide text-muted";
const errorClass = "mt-1 text-xs text-clay";

export default function EditClientModal({ client, onClose }) {
  const router = useRouter();
  const titleId = useId();
  const firstFieldRef = useRef(null);
  const isNew = !client.id;

  const [name, setName] = useState(client.guest_name || "");
  const [email, setEmail] = useState(client.guest_email || "");
  const [phone, setPhone] = useState(client.guest_phone || "");
  const [notes, setNotes] = useState(client.notes || "");

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    firstFieldRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function validate() {
    const next = {};
    if (!name.trim()) next.name = "Name is required.";
    if (email.trim() && !EMAIL_RE.test(email.trim())) next.email = "Enter a valid email address.";
    if (phone.trim() && !PHONE_RE.test(phone.trim())) next.phone = "Enter a valid phone number.";
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);

    const payload = { name, email, phone, notes };
    const result = isNew
      ? await saveClientFromBooking(payload).catch(() => null)
      : await updateAdminClient({ id: client.id, ...payload }).catch(() => null);

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
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-sage-dark">
              {isNew ? "Save as contact" : "Edit client"}
            </p>
            <h2 id={titleId} className="mt-1 font-heading text-3xl text-charcoal">
              {isNew ? "Save contact" : "Edit client"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-muted transition hover:bg-sand hover:text-charcoal"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="grid gap-4">
          <div>
            <label className={labelClass}>Name <span className="text-clay normal-case">*</span></label>
            <input
              ref={firstFieldRef}
              type="text"
              value={name}
              maxLength={120}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass}
            />
            {errors.name && <p className={errorClass}>{errors.name}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={email}
                maxLength={254}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldClass}
              />
              {errors.email && <p className={errorClass}>{errors.email}</p>}
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input
                type="tel"
                value={phone}
                maxLength={40}
                onChange={(e) => setPhone(e.target.value)}
                className={fieldClass}
              />
              {errors.phone && <p className={errorClass}>{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Notes <span className="normal-case text-muted/70">(optional)</span>
            </label>
            <textarea
              value={notes}
              maxLength={1000}
              rows={4}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Allergies, preferences, special requests…"
              className={`${fieldClass} resize-none`}
            />
          </div>

          {formError && (
            <p role="alert" className="rounded-xl bg-clay/10 px-4 py-3 text-sm text-clay ring-1 ring-clay/20">
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
              {submitting ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
