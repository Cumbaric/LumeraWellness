"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function signOutAdmin() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Manual (admin-entered) booking
//
// Mirrors the public createBooking validation + re-verification, but forces
// user_id null (guest booking taken by phone) and verifies the caller is an
// admin. Plain insert with NO .select() read-back so RLS never rejects it.
// ---------------------------------------------------------------------------

const BUSINESS_START_MINUTES = 9 * 60;
const BUSINESS_END_MINUTES = 20 * 60;
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_PHONE_LENGTH = 40;
const MAX_NOTES_LENGTH = 1000;
const TIME_SLOTS = Array.from({ length: 11 }, (_, i) => {
  const hour = 9 + i;
  return `${String(hour).padStart(2, "0")}:00`;
});

function getTodayDateString() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Belgrade",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

function timeToMinutes(time) {
  const [hours, minutes] = String(time || "")
    .slice(0, 5)
    .split(":")
    .map(Number);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return null;
  }

  return hours * 60 + minutes;
}

function rangesOverlap(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}

function bookingOverlapsSlot(booking, slotStart, slotEnd) {
  const bookingStart = timeToMinutes(booking.booking_time);
  const bookingDuration = Number(booking.service_durations?.minutes || 60);

  if (bookingStart === null || !Number.isFinite(bookingDuration)) {
    return true;
  }

  return rangesOverlap(
    slotStart,
    slotEnd,
    bookingStart,
    bookingStart + bookingDuration
  );
}

export async function createAdminBooking({
  serviceId,
  serviceDurationId,
  date,
  time,
  name,
  email,
  phone,
  notes,
}) {
  const supabase = await createClient();

  // Only an authenticated admin may create manual bookings.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "You must be signed in." };
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");

  if (adminError || !isAdmin) {
    return { ok: false, error: "You are not authorized to do this." };
  }

  const trimmedName = name?.trim() || "";
  const trimmedEmail = email?.trim().toLowerCase() || "";
  const trimmedPhone = phone?.trim() || "";
  const trimmedNotes = notes?.trim() || "";

  if (
    !serviceId ||
    !serviceDurationId ||
    !date ||
    !time ||
    !trimmedName ||
    !trimmedEmail ||
    !trimmedPhone
  ) {
    return { ok: false, error: "Please fill in all required fields." };
  }

  if (trimmedName.length > MAX_NAME_LENGTH) {
    return { ok: false, error: "Name is too long." };
  }

  if (trimmedEmail.length > MAX_EMAIL_LENGTH) {
    return { ok: false, error: "Email is too long." };
  }

  if (trimmedPhone.length > MAX_PHONE_LENGTH) {
    return { ok: false, error: "Phone number is too long." };
  }

  if (trimmedNotes.length > MAX_NOTES_LENGTH) {
    return { ok: false, error: "Notes are too long." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  if (!/^[+()\d\s.-]{6,40}$/.test(trimmedPhone)) {
    return { ok: false, error: "Please enter a valid phone number." };
  }

  const today = getTodayDateString();
  if (date < today) {
    return { ok: false, error: "Please choose a date today or in the future." };
  }

  if (!TIME_SLOTS.includes(time)) {
    return { ok: false, error: "Please choose a valid time slot." };
  }

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

  const { data: duration, error: durationError } = await supabase
    .from("service_durations")
    .select("id, service_id, minutes")
    .eq("id", serviceDurationId)
    .single();

  if (durationError || !duration || duration.service_id !== serviceId) {
    return {
      ok: false,
      error: "The selected duration is not valid for this treatment.",
    };
  }

  const requestedStart = timeToMinutes(time);
  const requestedEnd = requestedStart + duration.minutes;

  if (
    requestedStart < BUSINESS_START_MINUTES ||
    requestedEnd > BUSINESS_END_MINUTES
  ) {
    return {
      ok: false,
      error: "Please choose a time slot within business hours.",
    };
  }

  const { data: existingBookings, error: existingError } = await supabase
    .from("bookings")
    .select("id, booking_time, service_durations(minutes)")
    .eq("booking_date", date)
    .in("status", ["pending", "confirmed"]);

  if (existingError) {
    console.error("[createAdminBooking] availability check error:", existingError.message);
    return {
      ok: false,
      error: "We could not check availability. Please try again.",
    };
  }

  const conflictingBooking = (existingBookings || []).find((booking) =>
    bookingOverlapsSlot(booking, requestedStart, requestedEnd)
  );

  if (conflictingBooking) {
    return {
      ok: false,
      error: "This time slot is no longer available. Please choose another time.",
    };
  }

  // Guest booking: user_id null, status pending, no read-back.
  const { error: insertError } = await supabase.from("bookings").insert({
    user_id: null,
    service_id: serviceId,
    service_duration_id: serviceDurationId,
    booking_date: date,
    booking_time: time,
    guest_name: trimmedName,
    guest_email: trimmedEmail,
    guest_phone: trimmedPhone,
    notes: trimmedNotes || null,
    status: "pending",
  });

  if (insertError) {
    console.error("[createAdminBooking] insert error:", insertError.message);

    if (
      insertError.code === "23505" ||
      insertError.message?.includes("unique_active_booking_slot")
    ) {
      return {
        ok: false,
        error: "This time slot is no longer available. Please choose another time.",
      };
    }

    return {
      ok: false,
      error: "Something went wrong saving the booking. Please try again.",
    };
  }

  return { ok: true };
}

export async function createAdminClient({ name, email, phone, notes }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "You must be signed in." };

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
  if (adminError || !isAdmin) return { ok: false, error: "You are not authorized." };

  const trimmedName = name?.trim() || "";
  const trimmedEmail = email?.trim().toLowerCase() || "";
  const trimmedPhone = phone?.trim() || "";
  const trimmedNotes = notes?.trim() || "";

  if (!trimmedName) return { ok: false, error: "Name is required." };
  if (trimmedName.length > MAX_NAME_LENGTH) return { ok: false, error: "Name is too long." };
  if (trimmedEmail && trimmedEmail.length > MAX_EMAIL_LENGTH) return { ok: false, error: "Email is too long." };
  if (trimmedPhone && trimmedPhone.length > MAX_PHONE_LENGTH) return { ok: false, error: "Phone number is too long." };
  if (trimmedNotes.length > MAX_NOTES_LENGTH) return { ok: false, error: "Notes are too long." };

  if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  if (trimmedPhone && !/^[+()\d\s.-]{6,40}$/.test(trimmedPhone)) {
    return { ok: false, error: "Please enter a valid phone number." };
  }

  const { error: insertError } = await supabase.from("clients").insert({
    guest_name: trimmedName,
    guest_email: trimmedEmail || null,
    guest_phone: trimmedPhone || null,
    notes: trimmedNotes || null,
  });

  if (insertError) {
    console.error("[createAdminClient] insert error:", insertError.message);
    return { ok: false, error: "Something went wrong saving the client. Please try again." };
  }

  revalidatePath("/admin/clients");
  return { ok: true };
}
