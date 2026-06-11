"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Server Action — insert a new booking row into Supabase.
 *
 * Accepts a plain object (NOT FormData). Called directly from the BookingFlow
 * client component. Service and duration are re-verified server-side; no price
 * data is trusted from the client.
 *
 * Returns { ok: true } on success, or { ok: false, error: string } on failure.
 */
export async function createBooking({
  serviceId,
  serviceDurationId,
  date,
  time,
  name,
  email,
  phone,
  notes,
}) {
  // ── 1. Basic server-side validation ──────────────────────────────────────
  if (
    !serviceId ||
    !serviceDurationId ||
    !date ||
    !time ||
    !name?.trim() ||
    !email?.trim() ||
    !phone?.trim()
  ) {
    return { ok: false, error: "Please fill in all required fields." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const today = new Date().toISOString().split("T")[0];
  if (date < today) {
    return { ok: false, error: "Please choose a date today or in the future." };
  }

  const allowedTimes = Array.from({ length: 11 }, (_, i) => {
  const hour = 9 + i;
  return `${String(hour).padStart(2, "0")}:00`;
});

if (!allowedTimes.includes(time)) {
  return { ok: false, error: "Please choose a valid time slot." };
}

  const supabase = await createClient();

  // ── 2. Verify service exists and is active ────────────────────────────────
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("id, is_active")
    .eq("id", serviceId)
    .single();

  if (serviceError || !service || !service.is_active) {
    return {
      ok: false,
      error: "The selected treatment is not available. Please choose another.",
    };
  }

  // ── 3. Verify duration exists and belongs to this service ─────────────────
  const { data: duration, error: durationError } = await supabase
    .from("service_durations")
    .select("id, service_id")
    .eq("id", serviceDurationId)
    .single();

  if (
    durationError ||
    !duration ||
    duration.service_id !== serviceId
  ) {
    return {
      ok: false,
      error: "The selected duration is not valid for this treatment.",
    };
  }

  const { data: existingBooking, error: existingError } = await supabase
  .from("bookings")
  .select("id")
  .eq("booking_date", date)
  .eq("booking_time", time)
  .in("status", ["pending", "confirmed"])
  .maybeSingle();

if (existingError) {
  console.error("[createBooking] availability check error:", existingError.message);
  return {
    ok: false,
    error: "We could not check availability. Please try again.",
  };
}

if (existingBooking) {
  return {
    ok: false,
    error: "This time slot is no longer available. Please choose another time.",
  };
}

  // ── 4. Insert the booking ─────────────────────────────────────────────────
  const { data: booking, error: insertError } = await supabase
    .from("bookings")
    .insert({
      user_id: null, // guest booking; auth wiring comes later
      service_id: serviceId,
      service_duration_id: serviceDurationId,
      booking_date: date,
      booking_time: time,
      guest_name: name.trim(),
      guest_email: email.trim().toLowerCase(),
      guest_phone: phone.trim(),
      notes: notes?.trim() || null,
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("[createBooking] insert error:", insertError.message);
    return {
      ok: false,
      error: "Something went wrong saving your booking. Please try again.",
    };
  }

  return { ok: true, bookingId: booking.id };
}
