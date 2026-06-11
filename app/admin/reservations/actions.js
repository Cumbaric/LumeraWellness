"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_STATUSES = ["pending", "confirmed", "cancelled", "completed"];

export async function updateBookingStatus(bookingId, status) {
  if (!bookingId || !ALLOWED_STATUSES.includes(status)) {
    return {
      ok: false,
      error: "Invalid booking update.",
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");

  if (adminError || !isAdmin) {
    redirect("/admin/login");
  }

  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", bookingId);

  if (error) {
    console.error("[updateBookingStatus] error:", error.message);

    return {
      ok: false,
      error: "Failed to update booking status.",
    };
  }

  revalidatePath("/admin/reservations");

  return {
    ok: true,
  };
}