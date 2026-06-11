import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateBookingStatus } from "./actions";

export const metadata = {
  title: "Reservations | Lumera Wellness Admin",
  description: "Manage Lumera Wellness booking requests.",
};

export const dynamic = "force-dynamic";

export default async function AdminReservationsPage() {
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

  const { data: bookings, error: bookingsError } = await supabase
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
    .order("booking_date", { ascending: true })
    .order("booking_time", { ascending: true });

  return (
    <section className="min-h-screen bg-cream px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-sage-dark">
              Lumera Admin
            </p>
            <h1 className="font-heading text-5xl text-charcoal">
              Reservations
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              Review incoming booking requests, client details, selected
              treatments, appointment dates and current reservation status.
            </p>
          </div>

          <div className="rounded-full bg-white px-5 py-3 text-sm text-muted shadow-sm">
            {bookings?.length || 0} total bookings
          </div>
        </div>

        {bookingsError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            Failed to load reservations. Please try again.
          </div>
        ) : null}

        {!bookingsError && (!bookings || bookings.length === 0) ? (
          <div className="rounded-[2rem] border border-sage/15 bg-white p-10 text-center shadow-sm">
            <h2 className="font-heading text-3xl text-charcoal">
              No reservations yet
            </h2>
            <p className="mt-3 text-sm text-muted">
              New booking requests will appear here.
            </p>
          </div>
        ) : null}

        {!bookingsError && bookings?.length ? (
          <div className="overflow-hidden rounded-[2rem] border border-sage/15 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1250px] border-collapse text-left text-sm">
                <thead className="bg-sand/40 text-xs uppercase tracking-[0.18em] text-muted">
                  <tr>
                    <th className="px-5 py-4 font-medium">Client</th>
                    <th className="px-5 py-4 font-medium">Contact</th>
                    <th className="px-5 py-4 font-medium">Treatment</th>
                    <th className="px-5 py-4 font-medium">Date</th>
                    <th className="px-5 py-4 font-medium">Time</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                    <th className="w-[220px] px-5 py-4 font-medium">Actions</th>
                    <th className="px-5 py-4 font-medium">Notes</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-sage/10">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="align-top">
                      <td className="px-5 py-5">
                        <p className="font-medium text-charcoal">
                          {booking.guest_name}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          Created:{" "}
                          {new Date(booking.created_at).toLocaleDateString(
                            "en-GB"
                          )}
                        </p>
                      </td>

                      <td className="px-5 py-5 text-muted">
                        <p>{booking.guest_email}</p>
                        <p className="mt-1">{booking.guest_phone}</p>
                      </td>

                      <td className="px-5 py-5">
                        <p className="font-medium text-charcoal">
                          {booking.services?.name || "Unknown service"}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          {booking.service_durations?.minutes || "-"} min
                          {booking.service_durations?.price
                            ? ` · €${booking.service_durations.price}`
                            : ""}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-5 text-charcoal">
  {booking.booking_date}
</td>

<td className="whitespace-nowrap px-5 py-5 text-charcoal">
  {String(booking.booking_time).slice(0, 5)}
</td>

                      <td className="px-5 py-5">
                        <span className="rounded-full bg-sand px-3 py-1 text-xs font-medium capitalize text-charcoal">
                          {booking.status}
                        </span>
                      </td>

                      <td className="w-[220px] px-5 py-5">
  <div className="flex items-center gap-2 whitespace-nowrap">
    {booking.status === "pending" ? (
      <>
        <form
          action={updateBookingStatus.bind(
            null,
            booking.id,
            "confirmed"
          )}
        >
          <button
            type="submit"
            className="rounded-full bg-sage px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-sage-dark"
          >
            Confirm
          </button>
        </form>

        <form
          action={updateBookingStatus.bind(
            null,
            booking.id,
            "cancelled"
          )}
        >
          <button
            type="submit"
            className="rounded-full bg-clay px-4 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
          >
            Cancel
          </button>
        </form>
      </>
    ) : null}

    {booking.status === "confirmed" ? (
      <>
        <form
          action={updateBookingStatus.bind(
            null,
            booking.id,
            "completed"
          )}
        >
          <button
            type="submit"
            className="rounded-full bg-charcoal px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-sage-dark"
          >
            Complete
          </button>
        </form>

        <form
          action={updateBookingStatus.bind(
            null,
            booking.id,
            "cancelled"
          )}
        >
          <button
            type="submit"
            className="rounded-full bg-clay px-4 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
          >
            Cancel
          </button>
        </form>
      </>
    ) : null}

    {booking.status === "completed" || booking.status === "cancelled" ? (
      <span className="text-xs text-muted">No actions</span>
    ) : null}
  </div>
</td>

                      <td className="max-w-[240px] px-5 py-5 text-muted">
                        {booking.notes || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}