import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Client Details | Lumera Wellness Admin",
  description: "Review a Lumera Wellness client booking history.",
};

export const dynamic = "force-dynamic";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  confirmed: "bg-sage/10 text-sage-dark border-sage/20",
  completed: "bg-charcoal/10 text-charcoal border-charcoal/10",
  cancelled: "bg-clay/10 text-clay border-clay/20",
};

function safeDecodeURIComponent(value) {
  try {
    return decodeURIComponent(value || "");
  } catch {
    return value || "";
  }
}

function formatDate(date) {
  if (!date) {
    return "-";
  }

  return new Date(date).toLocaleDateString("en-GB");
}

function formatMoney(value) {
  return `€${Number(value || 0).toLocaleString("en-GB")}`;
}

function getBookingDateTimeValue(booking) {
  return `${booking.booking_date || ""} ${String(
    booking.booking_time || ""
  ).slice(0, 8)}`;
}

function getClientKeyFromBooking(booking) {
  const email = String(booking.guest_email || "").trim().toLowerCase();
  const phone = String(booking.guest_phone || "").trim();

  return email || phone || booking.id;
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize ${
        statusStyles[status] || "border-sage/10 bg-sand text-charcoal"
      }`}
    >
      {status}
    </span>
  );
}

function SummaryCard({ label, value, helper }) {
  return (
    <div className="rounded-[1.5rem] border border-sage/15 bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-[0.22em] text-muted">{label}</p>
      <p className="mt-3 font-heading text-4xl text-charcoal">{value}</p>
      <p className="mt-2 text-xs text-muted">{helper}</p>
    </div>
  );
}

export default async function AdminClientDetailsPage({ params }) {
  const resolvedParams = await params;
  const clientKey = safeDecodeURIComponent(resolvedParams?.clientKey).trim();

  if (!clientKey) {
    notFound();
  }

  const normalizedClientKey = clientKey.toLowerCase();

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

  const [bookingsResult, manualQuery] = await Promise.all([
    supabase
      .from("bookings")
      .select(
        `
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
      `
      )
      .order("booking_date", { ascending: false })
      .order("booking_time", { ascending: false }),
    // Look up manual-only client — by UUID if key is "manual-{uuid}", else by email/phone
    clientKey.startsWith("manual-")
      ? supabase
          .from("clients")
          .select("id, guest_name, guest_email, guest_phone, notes, created_at")
          .eq("id", clientKey.replace(/^manual-/, ""))
          .maybeSingle()
      : supabase
          .from("clients")
          .select("id, guest_name, guest_email, guest_phone, notes, created_at")
          .or(
            `guest_email.eq.${normalizedClientKey},guest_phone.eq.${normalizedClientKey}`
          )
          .maybeSingle(),
  ]);

  const bookingsError = bookingsResult.error;
  const clientBookings = (bookingsResult.data || [])
    .filter((booking) => getClientKeyFromBooking(booking) === normalizedClientKey)
    .sort((a, b) =>
      getBookingDateTimeValue(b).localeCompare(getBookingDateTimeValue(a))
    );

  const manualRecord = manualQuery.data ?? null;
  const isManualOnly = clientBookings.length === 0 && manualRecord;

  if (!bookingsError && clientBookings.length === 0 && !manualRecord) {
    notFound();
  }

  const latestBooking = clientBookings[0] ?? null;
  const firstBooking = clientBookings[clientBookings.length - 1] ?? null;

  const totalValue = clientBookings.reduce((total, booking) => {
    if (booking.status === "cancelled") return total;
    return total + Number(booking.service_durations?.price || 0);
  }, 0);

  const completedBookings = clientBookings.filter(
    (b) => b.status === "completed"
  ).length;

  return (
    <AdminShell
      activePage="clients"
      title="Client Details"
      userEmail={user.email}
    >
        <div className="mb-8">
          <Link
            href="/admin/clients"
            className="inline-flex rounded-full border border-sage/20 bg-white px-5 py-2 text-sm font-semibold text-charcoal transition hover:bg-sand"
          >
            ← Back to clients
          </Link>
        </div>

        {bookingsError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            Failed to load client details. Please try again.
          </div>
        ) : null}

        {!bookingsError && (latestBooking || isManualOnly) ? (
          <>
            <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="mb-3 text-sm uppercase tracking-[0.3em] text-sage-dark">
                  Client profile
                </p>
                <h1 className="font-heading text-5xl text-charcoal">
                  {isManualOnly
                    ? manualRecord.guest_name || "Unknown client"
                    : latestBooking.guest_name || "Unknown client"}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                  {isManualOnly
                    ? "Manual contact record — no bookings on file yet."
                    : "Booking history, client contact data, latest appointment and total reservation value."}
                </p>
              </div>

              {latestBooking ? (
                <StatusBadge status={latestBooking.status} />
              ) : (
                <span className="inline-flex rounded-full border border-sage/15 bg-sand px-4 py-1.5 text-xs font-medium text-muted">
                  contact only
                </span>
              )}
            </div>

            <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                label="Bookings"
                value={clientBookings.length}
                helper={
                  isManualOnly
                    ? "Manual contact"
                    : clientBookings.length > 1
                    ? "Returning client"
                    : "New client"
                }
              />
              <SummaryCard
                label="Total value"
                value={isManualOnly ? "—" : formatMoney(totalValue)}
                helper="Cancelled bookings excluded"
              />
              <SummaryCard
                label="Completed"
                value={isManualOnly ? "—" : completedBookings}
                helper="Completed appointments"
              />
              <SummaryCard
                label="Added"
                value={formatDate(
                  isManualOnly
                    ? manualRecord.created_at
                    : firstBooking?.created_at
                )}
                helper={isManualOnly ? "Manual record created" : "First booking record"}
              />
            </div>

            <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_1.4fr]">
              <div className="rounded-[2rem] border border-sage/15 bg-white p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.22em] text-muted">
                  Contact details
                </p>

                <div className="mt-5 space-y-4 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted">
                      Email
                    </p>
                    <p className="mt-1 text-charcoal">
                      {isManualOnly
                        ? manualRecord.guest_email || "-"
                        : latestBooking?.guest_email || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted">
                      Phone
                    </p>
                    <p className="mt-1 text-charcoal">
                      {isManualOnly
                        ? manualRecord.guest_phone || "-"
                        : latestBooking?.guest_phone || "-"}
                    </p>
                  </div>

                  {isManualOnly && manualRecord.notes ? (
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">
                        Notes
                      </p>
                      <p className="mt-1 text-muted">{manualRecord.notes}</p>
                    </div>
                  ) : null}

                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted">
                      Client key
                    </p>
                    <p className="mt-1 break-all text-muted">{clientKey}</p>
                  </div>
                </div>
              </div>

              {latestBooking ? (
                <div className="rounded-[2rem] border border-sage/15 bg-white p-6 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted">
                    Latest reservation
                  </p>

                  <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">
                        Treatment
                      </p>
                      <p className="mt-1 font-medium text-charcoal">
                        {latestBooking.services?.name || "Unknown service"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">
                        Date and time
                      </p>
                      <p className="mt-1 font-medium text-charcoal">
                        {latestBooking.booking_date} ·{" "}
                        {String(latestBooking.booking_time).slice(0, 5)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">
                        Duration and price
                      </p>
                      <p className="mt-1 text-charcoal">
                        {latestBooking.service_durations?.minutes || "-"} min ·{" "}
                        {formatMoney(latestBooking.service_durations?.price)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">
                        Status
                      </p>
                      <div className="mt-1">
                        <StatusBadge status={latestBooking.status} />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">
                        Notes
                      </p>
                      <p className="mt-1 text-muted">
                        {latestBooking.notes || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center rounded-[2rem] border border-sage/15 bg-white p-6 shadow-sm">
                  <p className="text-sm text-muted">
                    No bookings on file. This is a manual contact record only.
                  </p>
                </div>
              )}
            </div>

            {!isManualOnly ? (
            <>
            <div className="hidden overflow-hidden rounded-[2rem] border border-sage/15 bg-white shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] border-collapse text-left text-sm">
                  <thead className="bg-sand/40 text-xs uppercase tracking-[0.18em] text-muted">
                    <tr>
                      <th className="px-5 py-4 font-medium">Treatment</th>
                      <th className="px-5 py-4 font-medium">Date</th>
                      <th className="px-5 py-4 font-medium">Time</th>
                      <th className="px-5 py-4 font-medium">Duration</th>
                      <th className="px-5 py-4 font-medium">Price</th>
                      <th className="px-5 py-4 font-medium">Status</th>
                      <th className="px-5 py-4 font-medium">Notes</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-sage/10">
                    {clientBookings.map((booking) => (
                      <tr key={booking.id} className="align-top">
                        <td className="px-5 py-5 font-medium text-charcoal">
                          {booking.services?.name || "Unknown service"}
                        </td>

                        <td className="whitespace-nowrap px-5 py-5 text-charcoal">
                          {booking.booking_date}
                        </td>

                        <td className="whitespace-nowrap px-5 py-5 text-charcoal">
                          {String(booking.booking_time).slice(0, 5)}
                        </td>

                        <td className="px-5 py-5 text-muted">
                          {booking.service_durations?.minutes || "-"} min
                        </td>

                        <td className="px-5 py-5 font-medium text-charcoal">
                          {formatMoney(booking.service_durations?.price)}
                        </td>

                        <td className="px-5 py-5">
                          <StatusBadge status={booking.status} />
                        </td>

                        <td className="max-w-[280px] px-5 py-5 text-muted">
                          {booking.notes || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid gap-4 lg:hidden">
              {clientBookings.map((booking) => (
                <article
                  key={booking.id}
                  className="rounded-[2rem] border border-sage/15 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-heading text-2xl text-charcoal">
                        {booking.services?.name || "Unknown service"}
                      </h2>
                      <p className="mt-1 text-xs text-muted">
                        {booking.booking_date} ·{" "}
                        {String(booking.booking_time).slice(0, 5)}
                      </p>
                    </div>

                    <StatusBadge status={booking.status} />
                  </div>

                  <div className="mt-5 grid gap-4 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted">
                          Duration
                        </p>
                        <p className="mt-1 text-charcoal">
                          {booking.service_durations?.minutes || "-"} min
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted">
                          Price
                        </p>
                        <p className="mt-1 font-medium text-charcoal">
                          {formatMoney(booking.service_durations?.price)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">
                        Notes
                      </p>
                      <p className="mt-1 text-muted">{booking.notes || "—"}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            </>
            ) : null}
          </>
        ) : null}
    </AdminShell>
  );
}
