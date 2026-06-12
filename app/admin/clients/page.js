import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminHeader from "@/components/admin/AdminHeader";

export const metadata = {
  title: "Clients | Lumera Wellness Admin",
  description: "Manage Lumera Wellness client records.",
};

export const dynamic = "force-dynamic";

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

function buildClientsFromBookings(bookings) {
  const clientsMap = new Map();

  bookings.forEach((booking) => {
    const email = String(booking.guest_email || "").trim().toLowerCase();
    const phone = String(booking.guest_phone || "").trim();
    const fallbackKey = booking.id;

    const clientKey = email || phone || fallbackKey;
    const existingClient = clientsMap.get(clientKey);

    const bookingPrice = Number(booking.service_durations?.price || 0);
    const isRevenueBooking = booking.status !== "cancelled";

    if (!existingClient) {
      clientsMap.set(clientKey, {
        key: clientKey,
        name: booking.guest_name || "Unknown client",
        email: booking.guest_email || "-",
        phone: booking.guest_phone || "-",
        bookings: [booking],
        bookingCount: 1,
        totalValue: isRevenueBooking ? bookingPrice : 0,
        latestBooking: booking,
      });

      return;
    }

    const currentLatestValue = getBookingDateTimeValue(
      existingClient.latestBooking
    );
    const nextBookingValue = getBookingDateTimeValue(booking);

    existingClient.bookings.push(booking);
    existingClient.bookingCount += 1;
    existingClient.totalValue += isRevenueBooking ? bookingPrice : 0;

    if (nextBookingValue > currentLatestValue) {
      existingClient.latestBooking = booking;
      existingClient.name = booking.guest_name || existingClient.name;
      existingClient.email = booking.guest_email || existingClient.email;
      existingClient.phone = booking.guest_phone || existingClient.phone;
    }
  });

  return Array.from(clientsMap.values()).sort((a, b) =>
    getBookingDateTimeValue(b.latestBooking).localeCompare(
      getBookingDateTimeValue(a.latestBooking)
    )
  );
}

export default async function AdminClientsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = getParamValue(resolvedSearchParams?.q).trim();
  const normalizedSearchQuery = searchQuery.toLowerCase();

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
    .order("booking_time", { ascending: false });

  const allBookings = bookings || [];
  const clients = buildClientsFromBookings(allBookings);

  const filteredClients = clients.filter((client) => {
    if (!normalizedSearchQuery) {
      return true;
    }

    return [client.name, client.email, client.phone]
      .map((value) => String(value || "").toLowerCase())
      .some((value) => value.includes(normalizedSearchQuery));
  });

  const summary = {
    totalClients: clients.length,
    returningClients: clients.filter((client) => client.bookingCount > 1)
      .length,
    newClients: clients.filter((client) => client.bookingCount === 1).length,
    totalBookings: allBookings.length,
  };

  return (
    <section className="min-h-screen bg-cream px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <AdminHeader userEmail={user.email} activePage="clients" />

        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-sage-dark">
              Lumera Admin
            </p>
            <h1 className="font-heading text-5xl text-charcoal">Clients</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              Review client records generated from bookings, including contact
              details, reservation history, latest appointment and client value.
            </p>
          </div>

          <div className="rounded-full bg-white px-5 py-3 text-sm text-muted shadow-sm">
            {filteredClients.length} shown / {clients.length} total
          </div>
        </div>

        {bookingsError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            Failed to load clients. Please try again.
          </div>
        ) : null}

        {!bookingsError ? (
          <>
            <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                label="Total clients"
                value={summary.totalClients}
                helper="Unique clients by email or phone"
              />
              <SummaryCard
                label="Returning"
                value={summary.returningClients}
                helper="Clients with 2+ bookings"
              />
              <SummaryCard
                label="New clients"
                value={summary.newClients}
                helper="Clients with one booking"
              />
              <SummaryCard
                label="Total bookings"
                value={summary.totalBookings}
                helper="All reservation records"
              />
            </div>

            <form
              action="/admin/clients"
              className="mb-8 rounded-[2rem] border border-sage/15 bg-white p-5 shadow-sm"
            >
              <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <label
                    htmlFor="q"
                    className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted"
                  >
                    Search clients
                  </label>
                  <input
                    id="q"
                    name="q"
                    type="search"
                    defaultValue={searchQuery}
                    placeholder="Name, email or phone..."
                    className="w-full rounded-full border border-sage/20 bg-cream px-5 py-3 text-sm text-charcoal outline-none transition placeholder:text-muted/70 focus:border-sage"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-white transition hover:bg-sage-dark"
                  >
                    Search
                  </button>

                  {searchQuery ? (
                    <a
                      href="/admin/clients"
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

        {!bookingsError && clients.length === 0 ? (
          <div className="rounded-[2rem] border border-sage/15 bg-white p-10 text-center shadow-sm">
            <h2 className="font-heading text-3xl text-charcoal">
              No clients yet
            </h2>
            <p className="mt-3 text-sm text-muted">
              Clients will appear here after the first booking.
            </p>
          </div>
        ) : null}

        {!bookingsError &&
        clients.length > 0 &&
        filteredClients.length === 0 ? (
          <div className="rounded-[2rem] border border-sage/15 bg-white p-10 text-center shadow-sm">
            <h2 className="font-heading text-3xl text-charcoal">
              No matching clients
            </h2>
            <p className="mt-3 text-sm text-muted">
              Try changing the search term.
            </p>
          </div>
        ) : null}

        {!bookingsError && filteredClients.length > 0 ? (
          <>
            <div className="hidden overflow-hidden rounded-[2rem] border border-sage/15 bg-white shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1250px] border-collapse text-left text-sm">
                  <thead className="bg-sand/40 text-xs uppercase tracking-[0.18em] text-muted">
                    <tr>
                      <th className="px-5 py-4 font-medium">Client</th>
                      <th className="px-5 py-4 font-medium">Contact</th>
                      <th className="px-5 py-4 font-medium">Bookings</th>
                      <th className="px-5 py-4 font-medium">
                        Latest reservation
                      </th>
                      <th className="px-5 py-4 font-medium">Latest status</th>
                      <th className="px-5 py-4 font-medium">Total value</th>
                      <th className="px-5 py-4 font-medium">Actions</th>
                      <th className="px-5 py-4 font-medium">Notes</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-sage/10">
                    {filteredClients.map((client) => {
                      const latestBooking = client.latestBooking;

                      return (
                        <tr key={client.key} className="align-top">
                          <td className="px-5 py-5">
                            <p className="font-medium text-charcoal">
                              {client.name}
                            </p>
                            <p className="mt-1 text-xs text-muted">
                              First seen:{" "}
                              {formatDate(
                                client.bookings[client.bookings.length - 1]
                                  ?.created_at
                              )}
                            </p>
                          </td>

                          <td className="px-5 py-5 text-muted">
                            <p>{client.email}</p>
                            <p className="mt-1">{client.phone}</p>
                          </td>

                          <td className="px-5 py-5">
                            <p className="font-medium text-charcoal">
                              {client.bookingCount}
                            </p>
                            <p className="mt-1 text-xs text-muted">
                              {client.bookingCount > 1
                                ? "Returning client"
                                : "New client"}
                            </p>
                          </td>

                          <td className="px-5 py-5">
                            <p className="font-medium text-charcoal">
                              {latestBooking.booking_date} ·{" "}
                              {String(latestBooking.booking_time).slice(0, 5)}
                            </p>
                            <p className="mt-1 text-xs text-muted">
                              {latestBooking.services?.name ||
                                "Unknown service"}
                            </p>
                          </td>

                          <td className="px-5 py-5">
                            <StatusBadge status={latestBooking.status} />
                          </td>

                          <td className="px-5 py-5 font-medium text-charcoal">
                            {formatMoney(client.totalValue)}
                          </td>

                          <td className="px-5 py-5">
                            <Link
                              href={`/admin/clients/${encodeURIComponent(
                                client.key
                              )}`}
                              className="inline-flex rounded-full bg-charcoal px-4 py-2 text-xs font-semibold text-white transition hover:bg-sage-dark"
                            >
                              View details
                            </Link>
                          </td>

                          <td className="max-w-[260px] px-5 py-5 text-muted">
                            {latestBooking.notes || "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid gap-4 lg:hidden">
              {filteredClients.map((client) => {
                const latestBooking = client.latestBooking;

                return (
                  <article
                    key={client.key}
                    className="rounded-[2rem] border border-sage/15 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-heading text-2xl text-charcoal">
                          {client.name}
                        </h2>
                        <p className="mt-1 text-xs text-muted">
                          {client.bookingCount > 1
                            ? "Returning client"
                            : "New client"}
                        </p>
                      </div>

                      <StatusBadge status={latestBooking.status} />
                    </div>

                    <div className="mt-5 grid gap-4 text-sm">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted">
                          Contact
                        </p>
                        <p className="mt-1 text-charcoal">{client.email}</p>
                        <p className="mt-1 text-charcoal">{client.phone}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-muted">
                            Bookings
                          </p>
                          <p className="mt-1 font-medium text-charcoal">
                            {client.bookingCount}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-muted">
                            Total value
                          </p>
                          <p className="mt-1 font-medium text-charcoal">
                            {formatMoney(client.totalValue)}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted">
                          Latest reservation
                        </p>
                        <p className="mt-1 font-medium text-charcoal">
                          {latestBooking.booking_date} ·{" "}
                          {String(latestBooking.booking_time).slice(0, 5)}
                        </p>
                        <p className="mt-1 text-muted">
                          {latestBooking.services?.name || "Unknown service"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted">
                          Notes
                        </p>
                        <p className="mt-1 text-muted">
                          {latestBooking.notes || "—"}
                        </p>
                      </div>

                      <Link
                        href={`/admin/clients/${encodeURIComponent(
                          client.key
                        )}`}
                        className="inline-flex w-fit rounded-full bg-charcoal px-5 py-2 text-xs font-semibold text-white transition hover:bg-sage-dark"
                      >
                        View details
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}