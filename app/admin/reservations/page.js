import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateBookingStatus } from "./actions";
import AdminShell from "@/components/admin/AdminShell";
import EditBookingButton from "@/components/admin/EditBookingButton";
import { getServices } from "@/lib/services";

export const metadata = {
  title: "Reservations | Lumera Wellness Admin",
  description: "Manage Lumera Wellness booking requests.",
};

export const dynamic = "force-dynamic";

const STATUS_OPTIONS = ["pending", "confirmed", "completed", "cancelled"];

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  confirmed: "bg-sage/10 text-sage-dark border-sage/20",
  completed: "bg-charcoal/10 text-charcoal border-charcoal/10",
  cancelled: "bg-clay/10 text-clay border-clay/20",
};

function getParamValue(value) {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
}

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

function formatDate(date) {
  if (!date) {
    return "-";
  }

  return new Date(date).toLocaleDateString("en-GB");
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

function ReservationActions({ booking, services }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {booking.status === "pending" || booking.status === "confirmed" ? (
        <EditBookingButton booking={booking} services={services} />
      ) : null}

      {booking.status === "pending" ? (
        <>
          <form action={updateBookingStatus.bind(null, booking.id, "confirmed")}>
            <button
              type="submit"
              className="rounded-full bg-sage px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-sage-dark"
            >
              Confirm
            </button>
          </form>

          <form action={updateBookingStatus.bind(null, booking.id, "cancelled")}>
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
          <form action={updateBookingStatus.bind(null, booking.id, "completed")}>
            <button
              type="submit"
              className="rounded-full bg-charcoal px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-sage-dark"
            >
              Complete
            </button>
          </form>

          <form action={updateBookingStatus.bind(null, booking.id, "cancelled")}>
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
  );
}

export default async function AdminReservationsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;

  const searchQuery = getParamValue(resolvedSearchParams?.q).trim();
  const statusFilter = getParamValue(resolvedSearchParams?.status) || "all";
  const dateFilter = getParamValue(resolvedSearchParams?.date);

  const normalizedSearchQuery = searchQuery.toLowerCase();
  const todayDate = getTodayDateString();

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

  const [bookingsResult, services] = await Promise.all([
    supabase
      .from("bookings")
      .select(
        `
        id,
        service_id,
        service_duration_id,
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
      .order("booking_date", { ascending: true })
      .order("booking_time", { ascending: true }),
    getServices(),
  ]);

  const { data: bookings, error: bookingsError } = bookingsResult;

  const allBookings = bookings || [];

  const filteredBookings = allBookings.filter((booking) => {
    const searchableValues = [
      booking.guest_name,
      booking.guest_email,
      booking.guest_phone,
      booking.services?.name,
      booking.notes,
    ];

    const matchesSearch =
      !normalizedSearchQuery ||
      searchableValues.some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(normalizedSearchQuery)
      );

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    const matchesDate = !dateFilter || booking.booking_date === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const summary = {
    total: allBookings.length,
    pending: allBookings.filter((booking) => booking.status === "pending")
      .length,
    confirmed: allBookings.filter((booking) => booking.status === "confirmed")
      .length,
    today: allBookings.filter((booking) => booking.booking_date === todayDate)
      .length,
  };

  const hasActiveFilters =
    searchQuery || statusFilter !== "all" || Boolean(dateFilter);

  return (
    <AdminShell
      activePage="reservations"
      title="Reservations"
      userEmail={user.email}
    >
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
            {filteredBookings.length} shown / {allBookings.length} total
          </div>
        </div>

        {bookingsError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            Failed to load reservations. Please try again.
          </div>
        ) : null}

        {!bookingsError ? (
          <>
            <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                label="Pending"
                value={summary.pending}
                helper="Waiting for admin review"
              />
              <SummaryCard
                label="Confirmed"
                value={summary.confirmed}
                helper="Approved appointments"
              />
              <SummaryCard
                label="Today"
                value={summary.today}
                helper={todayDate}
              />
              <SummaryCard
                label="Total bookings"
                value={summary.total}
                helper="All reservation records"
              />
            </div>

            <form
              action="/admin/reservations"
              className="mb-8 rounded-[2rem] border border-sage/15 bg-white p-5 shadow-sm"
            >
              <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr_auto] lg:items-end">
                <div>
                  <label
                    htmlFor="q"
                    className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted"
                  >
                    Search
                  </label>
                  <input
                    id="q"
                    name="q"
                    type="search"
                    defaultValue={searchQuery}
                    placeholder="Name, email, phone, treatment..."
                    className="w-full rounded-full border border-sage/20 bg-cream px-5 py-3 text-sm text-charcoal outline-none transition placeholder:text-muted/70 focus:border-sage"
                  />
                </div>

                <div>
                  <label
                    htmlFor="status"
                    className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={statusFilter}
                    className="w-full rounded-full border border-sage/20 bg-cream px-5 py-3 text-sm text-charcoal outline-none transition focus:border-sage"
                  >
                    <option value="all">All statuses</option>
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="date"
                    className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted"
                  >
                    Date
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    defaultValue={dateFilter}
                    className="w-full rounded-full border border-sage/20 bg-cream px-5 py-3 text-sm text-charcoal outline-none transition focus:border-sage"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-white transition hover:bg-sage-dark"
                  >
                    Apply
                  </button>

                  {hasActiveFilters ? (
                    <a
                      href="/admin/reservations"
                      className="rounded-full border border-sage/20 px-6 py-3 text-sm font-semibold text-charcoal transition hover:bg-sand"
                    >
                      Reset
                    </a>
                  ) : null}
                </div>
              </div>
            </form>
          </>
        ) : null}

        {!bookingsError && allBookings.length === 0 ? (
          <div className="rounded-[2rem] border border-sage/15 bg-white p-10 text-center shadow-sm">
            <h2 className="font-heading text-3xl text-charcoal">
              No reservations yet
            </h2>
            <p className="mt-3 text-sm text-muted">
              New booking requests will appear here.
            </p>
          </div>
        ) : null}

        {!bookingsError &&
        allBookings.length > 0 &&
        filteredBookings.length === 0 ? (
          <div className="rounded-[2rem] border border-sage/15 bg-white p-10 text-center shadow-sm">
            <h2 className="font-heading text-3xl text-charcoal">
              No matching reservations
            </h2>
            <p className="mt-3 text-sm text-muted">
              Try changing the search term, status or date filter.
            </p>
          </div>
        ) : null}

        {!bookingsError && filteredBookings.length > 0 ? (
          <>
            <div className="hidden overflow-hidden rounded-[2rem] border border-sage/15 bg-white shadow-sm lg:block">
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
                      <th className="w-[220px] px-5 py-4 font-medium">
                        Actions
                      </th>
                      <th className="px-5 py-4 font-medium">Notes</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-sage/10">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="align-top">
                        <td className="px-5 py-5">
                          <p className="font-medium text-charcoal">
                            {booking.guest_name}
                          </p>
                          <p className="mt-1 text-xs text-muted">
                            Created: {formatDate(booking.created_at)}
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
                            {booking.service_durations?.price !== null &&
                            booking.service_durations?.price !== undefined
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
                          <StatusBadge status={booking.status} />
                        </td>

                        <td className="w-[220px] px-5 py-5">
                          <ReservationActions booking={booking} services={services} />
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

            <div className="grid gap-4 lg:hidden">
              {filteredBookings.map((booking) => (
                <article
                  key={booking.id}
                  className="rounded-[2rem] border border-sage/15 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-heading text-2xl text-charcoal">
                        {booking.guest_name}
                      </h2>
                      <p className="mt-1 text-xs text-muted">
                        Created: {formatDate(booking.created_at)}
                      </p>
                    </div>

                    <StatusBadge status={booking.status} />
                  </div>

                  <div className="mt-5 grid gap-4 text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">
                        Contact
                      </p>
                      <p className="mt-1 text-charcoal">{booking.guest_email}</p>
                      <p className="mt-1 text-charcoal">{booking.guest_phone}</p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">
                        Treatment
                      </p>
                      <p className="mt-1 font-medium text-charcoal">
                        {booking.services?.name || "Unknown service"}
                      </p>
                      <p className="mt-1 text-muted">
                        {booking.service_durations?.minutes || "-"} min
                        {booking.service_durations?.price !== null &&
                        booking.service_durations?.price !== undefined
                          ? ` · €${booking.service_durations.price}`
                          : ""}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted">
                          Date
                        </p>
                        <p className="mt-1 text-charcoal">
                          {booking.booking_date}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted">
                          Time
                        </p>
                        <p className="mt-1 text-charcoal">
                          {String(booking.booking_time).slice(0, 5)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">
                        Notes
                      </p>
                      <p className="mt-1 text-muted">{booking.notes || "—"}</p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs uppercase tracking-[0.18em] text-muted">
                        Actions
                      </p>
                      <ReservationActions booking={booking} services={services} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : null}
    </AdminShell>
  );
}
