"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function cancelOwnBooking(bookingId) {
  if (!bookingId) {
    return {
      ok: false,
      error: "Invalid booking.",
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId)
    .eq("user_id", user.id)
    .in("status", ["pending", "confirmed"]);

  if (error) {
    console.error("[cancelOwnBooking] error:", error.message);

    return {
      ok: false,
      error: "We could not cancel this booking. Please try again.",
    };
  }

  revalidatePath("/account/bookings");
  revalidatePath("/admin/reservations");
  revalidatePath("/admin/clients");

  return {
    ok: true,
  };
}
