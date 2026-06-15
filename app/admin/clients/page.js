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
    booking.booking_time || "",
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
    const email = String(booking.guest_email || "")
      .trim()
      .toLowerCase();
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
      existingClient.latestBooking,
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
      getBookingDateTimeValue(a.latestBooking),
    ),
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
    `,
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
                    <Link
                      href="/admin/clients"
                      className="rounded-full border border-sage/20 px-6 py-3 text-sm font-semibold text-charcoal transition hover:bg-sand"
                    >
                      Reset
                    </Link>
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
          <div className="grid gap-4">
            {filteredClients.map((client) => {
              const latestBooking = client.latestBooking;
              const clientHref = `/admin/clients/${encodeURIComponent(client.key)}`;

              return (
                <Link
                  key={client.key}
                  href={clientHref}
                  aria-label={`View details for ${client.name}`}
                  className="group relative block overflow-hidden rounded-[2rem] border border-sage/15 bg-white p-5 pl-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-sage/35 hover:shadow-[0_18px_45px_rgba(58,74,57,0.12)] focus:outline-none focus:ring-2 focus:ring-sage/30"
                >
                  <span className="pointer-events-none absolute inset-y-5 left-0 w-1 origin-top scale-y-0 rounded-r-full bg-sage transition-transform duration-300 ease-out group-hover:scale-y-100" />

                  <div className="grid gap-5 lg:grid-cols-[1.2fr_1.4fr_0.7fr_1.3fr_0.8fr_0.8fr_1.4fr] lg:items-start">
                    <div className="transition-transform duration-300 ease-out group-hover:translate-x-1">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">
                        Client
                      </p>
                      <h2 className="mt-2 font-heading text-2xl leading-tight text-charcoal transition-colors duration-300 group-hover:text-sage-dark">
                        {client.name}
                      </h2>
                      <p className="mt-1 text-xs text-muted">
                        First seen:{" "}
                        {formatDate(
                          client.bookings[client.bookings.length - 1]
                            ?.created_at,
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">
                        Contact
                      </p>
                      <p className="mt-2 break-words text-sm text-charcoal">
                        {client.email}
                      </p>
                      <p className="mt-1 text-sm text-muted">{client.phone}</p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">
                        Bookings
                      </p>
                      <p className="mt-2 text-sm font-semibold text-charcoal">
                        {client.bookingCount}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {client.bookingCount > 1
                          ? "Returning client"
                          : "New client"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">
                        Latest reservation
                      </p>
                      <p className="mt-2 text-sm font-semibold text-charcoal">
                        {latestBooking.booking_date} ·{" "}
                        {String(latestBooking.booking_time).slice(0, 5)}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {latestBooking.services?.name || "Unknown service"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">
                        Status
                      </p>
                      <div className="mt-2">
                        <StatusBadge status={latestBooking.status} />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">
                        Value
                      </p>
                      <p className="mt-2 text-sm font-semibold text-charcoal">
                        {formatMoney(client.totalValue)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">
                        Notes
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm text-muted">
                        {latestBooking.notes || "—"}
                      </p>
                      <p className="mt-3 translate-x-[-6px] text-xs font-semibold text-sage-dark opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100">
                        Open client profile →
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
