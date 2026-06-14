import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDuration, formatPrice } from "@/lib/format";
import { cancelOwnBooking } from "./actions";

export const metadata = {
  title: "My Bookings | Lumera Wellness",
  description: "View your Lumera Wellness booking requests.",
};

function StatusBadge({ status }) {
  const classes = {
    pending: "bg-gold/20 text-charcoal ring-gold/40",
    confirmed: "bg-sage/15 text-sage-dark ring-sage/30",
    cancelled: "bg-clay/10 text-clay ring-clay/20",
    completed: "bg-charcoal/10 text-charcoal ring-charcoal/20",
  };

  return (
    <span
      className={[
        "inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ring-1",
        classes[status] || "bg-sand text-muted ring-charcoal/10",
      ].join(" ")}
    >
      {status}
    </span>
  );
}

export default async function AccountBookingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(`
      id,
      booking_date,
      booking_time,
      guest_name,
      guest_email,
      guest_phone,
      notes,
      status,
      created_at,
      services (
        name
      ),
      service_durations (
        minutes,
        price
      )
    `)
    .eq("user_id", user.id)
    .order("booking_date", { ascending: true })
    .order("booking_time", { ascending: true });

  if (error) {
    console.error("[AccountBookingsPage] bookings error:", error.message);
  }

  return (
    <section className="bg-cream py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-sage">
            Account
          </p>
          <h1 className="mt-4 font-heading text-4xl font-semibold text-charcoal sm:text-5xl">
            My Bookings
          </h1>
          <p className="mt-4 text-muted">
            View your current and previous Lumera Wellness booking requests.
          </p>
        </div>

        {error && (
          <div className="mt-10 rounded-2xl bg-clay/10 p-6 text-sm text-clay ring-1 ring-clay/20">
            We could not load your bookings right now. Please try again later.
          </div>
        )}

        {!error && (!bookings || bookings.length === 0) && (
          <div className="mt-10 rounded-2xl bg-sand p-8 text-center ring-1 ring-charcoal/10">
            <h2 className="font-heading text-2xl font-semibold text-charcoal">
              No bookings yet
            </h2>
            <p className="mt-2 text-sm text-muted">
              Once you request an appointment, it will appear here.
            </p>
          </div>
        )}

        {!error && bookings?.length > 0 && (
          <div className="mt-10 overflow-hidden rounded-2xl bg-sand ring-1 ring-charcoal/10">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-cream/70 text-xs uppercase tracking-[0.18em] text-muted">
                  <tr>
                    <th className="px-5 py-4 font-medium">Treatment</th>
                    <th className="px-5 py-4 font-medium">Date</th>
                    <th className="px-5 py-4 font-medium">Time</th>
                    <th className="px-5 py-4 font-medium">Duration</th>
                    <th className="px-5 py-4 font-medium">Price</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 font-medium">Actions</th>
                    <th className="px-5 py-4 font-medium">Notes</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-charcoal/10">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="bg-sand">
                      <td className="px-5 py-5 font-medium text-charcoal">
                        {booking.services?.name || "Treatment"}
                      </td>
                      <td className="whitespace-nowrap px-5 py-5 text-charcoal">
                        {booking.booking_date}
                      </td>
                      <td className="whitespace-nowrap px-5 py-5 text-charcoal">
                        {booking.booking_time?.slice(0, 5)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-5 text-muted">
                        {booking.service_durations?.minutes
                          ? formatDuration(booking.service_durations.minutes)
                          : "—"}
                      </td>
                      <td className="whitespace-nowrap px-5 py-5 text-muted">
                        {booking.service_durations?.price
                          ? formatPrice(booking.service_durations.price)
                          : "—"}
                      </td>
                      <td className="px-5 py-5">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="px-5 py-5">
                        {["pending", "confirmed"].includes(booking.status) ? (
                          <form action={cancelOwnBooking.bind(null, booking.id)}>
                            <button
                              type="submit"
                              className="rounded-full border border-clay/25 px-4 py-1.5 text-xs font-semibold text-clay transition hover:bg-clay/10"
                            >
                              Cancel
                            </button>
                          </form>
                        ) : (
                          <span className="text-xs text-muted">No actions</span>
                        )}
                      </td>
                      <td className="max-w-xs px-5 py-5 text-muted">
                        {booking.notes || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
