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
  "w-full rounded-xl border border-sage/20 bg-sand/40 px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-muted/50 focus:border-sage focus:bg-white focus:ring-2 focus:ring-sage/15";
const fieldAreaClass =
  "w-full rounded-xl border border-sage/20 bg-sand/40 px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-muted/50 focus:border-sage focus:bg-white focus:ring-2 focus:ring-sage/15 resize-none";

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

    const validationError = validate({ name, email: trimmedEmail, phone: trimmedPhone, notes: trimmedNotes });
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    try {
      const result = await createAdminClient({ name, email: trimmedEmail, phone: trimmedPhone, notes: trimmedNotes });
      if (!result.ok) { setError(result.error || "Something went wrong."); return; }
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-charcoal/8">

        {/* Coloured top bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-sage to-sage-dark" />

        {/* Header */}
        <div className="flex items-start justify-between px-7 pt-6 pb-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-sage-dark">
              New client
            </p>
            <h2 className="mt-1 font-heading text-2xl text-charcoal">
              Add contact
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-muted transition hover:bg-sand hover:text-charcoal"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-7 pb-7">
          <div className="space-y-4">
            <div>
              <label htmlFor="nc-name" className={labelClass}>
                Full name <span className="text-clay normal-case font-normal">*</span>
              </label>
              <input
                id="nc-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ana Jovanović"
                maxLength={MAX_NAME}
                className={fieldClass}
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="nc-email" className={labelClass}>Email</label>
                <input
                  id="nc-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ana@example.com"
                  maxLength={MAX_EMAIL}
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="nc-phone" className={labelClass}>Phone</label>
                <input
                  id="nc-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+381 60 123 456"
                  maxLength={MAX_PHONE}
                  className={fieldClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="nc-notes" className={labelClass}>Notes</label>
              <textarea
                id="nc-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Allergies, preferences, referral source…"
                maxLength={MAX_NOTES}
                rows={3}
                className={fieldAreaClass}
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-xl bg-clay/8 px-4 py-3 text-xs text-clay ring-1 ring-clay/20">
              {error}
            </p>
          )}

          <div className="mt-6 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-5 py-2.5 text-sm font-medium text-muted transition hover:text-charcoal"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-sage px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sage-dark disabled:opacity-60"
            >
              {loading ? "Saving…" : "Save client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
