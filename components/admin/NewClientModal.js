"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createAdminClient } from "@/app/admin/actions";

const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_PHONE = 40;
const MAX_NOTES = 1000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+()\d\s.-]{6,40}$/;

const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-muted";
const fieldClass =
  "w-full rounded-full border border-sage/20 bg-white px-5 py-3 text-sm text-charcoal outline-none transition placeholder:text-muted/60 focus:border-sage";
const fieldAreaClass =
  "w-full rounded-2xl border border-sage/20 bg-white px-5 py-3 text-sm text-charcoal outline-none transition placeholder:text-muted/60 focus:border-sage resize-none";
const errorClass = "mt-1.5 text-xs text-clay";

function validate({ name, email, phone, notes }) {
  if (!name.trim()) return "Name is required.";
  if (name.trim().length > MAX_NAME) return "Name is too long.";
  if (email && email.length > MAX_EMAIL) return "Email is too long.";
  if (email && !EMAIL_RE.test(email)) return "Please enter a valid email address.";
  if (phone && phone.length > MAX_PHONE) return "Phone number is too long.";
  if (phone && !PHONE_RE.test(phone)) return "Please enter a valid phone number.";
  if (notes.length > MAX_NOTES) return "Notes are too long.";
  return null;
}

export default function NewClientModal({ onClose }) {
  const router = useRouter();
  const overlayRef = useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();
    const trimmedNotes = notes.trim();

    const validationError = validate({
      name,
      email: trimmedEmail,
      phone: trimmedPhone,
      notes: trimmedNotes,
    });
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const result = await createAdminClient({
        name,
        email: trimmedEmail,
        phone: trimmedPhone,
        notes: trimmedNotes,
      });

      if (!result.ok) {
        setError(result.error || "Something went wrong.");
        return;
      }

      router.refresh();
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 p-4 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] bg-cream shadow-2xl">
        {/* Header */}
        <div className="border-b border-sage/15 px-8 py-6">
          <p className="text-xs uppercase tracking-[0.28em] text-sage-dark">Admin</p>
          <h2 className="mt-1 font-heading text-3xl text-charcoal">New Client</h2>
          <p className="mt-1 text-sm text-muted">Add a contact record without a booking.</p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6">
          <div className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="nc-name" className={labelClass}>
                Full name <span className="text-clay">*</span>
              </label>
              <input
                id="nc-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g. Ana Jovanović"
                maxLength={MAX_NAME}
                className={fieldClass}
                required
                autoFocus
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="nc-email" className={labelClass}>
                Email address
              </label>
              <input
                id="nc-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@example.com"
                maxLength={MAX_EMAIL}
                className={fieldClass}
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="nc-phone" className={labelClass}>
                Phone number
              </label>
              <input
                id="nc-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+381 60 123 4567"
                maxLength={MAX_PHONE}
                className={fieldClass}
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="nc-notes" className={labelClass}>
                Notes
              </label>
              <textarea
                id="nc-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Preferences, allergies, referral source…"
                maxLength={MAX_NOTES}
                rows={3}
                className={fieldAreaClass}
              />
            </div>
          </div>

          {error ? <p className={errorClass}>{error}</p> : null}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-white transition hover:bg-sage-dark disabled:opacity-60"
            >
              {loading ? "Saving…" : "Save client"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-sage/20 px-6 py-3 text-sm font-semibold text-charcoal transition hover:bg-sand"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
