import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import StatCard from "@/components/admin/StatCard";
import { updateBookingStatus } from "@/app/admin/reservations/actions";

export const metadata = {
  title: "Dashboard | Lumera Wellness Admin",
  description: "Overview of Lumera Wellness reservations and clients.",
};

export const dynamic = "force-dynamic";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  confirmed: "bg-sage/10 text-sage-dark border-sage/20",
  completed: "bg-charcoal/10 text-charcoal border-charcoal/10",
  cancelled: "bg-clay/10 text-clay border-clay/20",
};

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

function formatMoney(value) {
  return `EUR ${Number(value || 0).toLocaleString("en-GB")}`;
}

function formatDate(date) {
  if (!date) {
    return "-";
  }

  return new Date(date).toLocaleDateString("en-GB");
}

function getMonthKey(date) {
  return String(date || "").slice(0, 7);
}

// Monday–Sunday range (as YYYY-MM-DD strings) for the week containing the given
// Belgrade-local date. Date math is done in UTC so it never drifts with the
// server's own timezone.
function getBelgradeWeekRange(todayString) {
  const [year, month, day] = String(todayString).split("-").map(Number);
  const base = new Date(Date.UTC(year, month - 1, day));
  const weekday = base.getUTCDay(); // 0=Sun … 6=Sat
  const daysSinceMonday = (weekday + 6) % 7;

  const monday = new Date(base);
  monday.setUTCDate(base.getUTCDate() - daysSinceMonday);

  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);

  const format = (date) => date.toISOString().slice(0, 10);

  return { start: format(monday), end: format(sunday) };
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5" aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v3M16 3v3" strokeLinecap="round" />
    </svg>
  );
}

function WeekIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5" aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v3M16 3v3M7 13h4M7 16.5h7" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5" aria-hidden="true">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" strokeLinecap="round" />
      <path d="M16 6.5a3 3 0 0 1 0 6M17.5 19c0-2.2-.9-4-2.3-5.1" strokeLinecap="round" />
    </svg>
  );
}

function getBookingDateTimeValue(booking) {
  return `${booking.booking_date || ""} ${String(
    booking.booking_time || ""
  ).slice(0, 8)}`;
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

function MetricCard({ label, value, helper, tone = "light" }) {
  const toneClass =
    tone === "dark"
      ? "border-charcoal bg-charcoal text-white"
      : "border-sage/15 bg-white text-charcoal";

  return (
    <div className={`rounded-[1.5rem] border p-5 shadow-sm ${toneClass}`}>
      <p
        className={`text-xs uppercase tracking-[0.22em] ${
          tone === "dark" ? "text-cream/70" : "text-muted"
        }`}
      >
        {label}
      </p>
      <p className="mt-3 font-heading text-4xl">{value}</p>
      <p
        className={`mt-2 text-xs ${
          tone === "dark" ? "text-cream/70" : "text-muted"
        }`}
      >
        {helper}
      </p>
    </div>
  );
}

function QuickActions({ booking }) {
  if (booking.status === "pending") {
    return (
      <div className="flex flex-wrap gap-2">
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
      </div>
    );
  }

  if (booking.status === "confirmed") {
    return (
      <form action={updateBookingStatus.bind(null, booking.id, "completed")}>
        <button
          type="submit"
          className="rounded-full bg-charcoal px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-sage-dark"
        >
          Complete
        </button>
      </form>
    );
  }

  return <span className="text-xs text-muted">No actions</span>;
}

function BookingRow({ booking }) {
  return (
    <div className="grid gap-4 border-b border-sage/10 py-4 last:border-b-0 md:grid-cols-[1.2fr_1fr_0.8fr_0.8fr_1fr] md:items-center">
      <div>
        <p className="font-medium text-charcoal">{booking.guest_name}</p>
        <p className="mt-1 text-xs text-muted">{booking.guest_email}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-charcoal">
          {booking.services?.name || "Unknown service"}
        </p>
        <p className="mt-1 text-xs text-muted">
          {booking.service_durations?.minutes || "-"} min
        </p>
      </div>
      <div className="text-sm text-charcoal">
        <p>{booking.booking_date}</p>
        <p className="mt-1 text-xs text-muted">
          {String(booking.booking_time).slice(0, 5)}
        </p>
      </div>
      <StatusBadge status={booking.status} />
      <QuickActions booking={booking} />
    </div>
  );
}

function EmptyPanel({ title, text }) {
  return (
    <div className="rounded-[1.5rem] border border-sage/15 bg-white p-8 text-center shadow-sm">
      <h2 className="font-heading text-2xl text-charcoal">{title}</h2>
      <p className="mt-2 text-sm text-muted">{text}</p>
    </div>
  );
}

export default async function AdminDashboardPage() {
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

  const todayDate = getTodayDateString();
  const monthKey = getMonthKey(todayDate);
  const { start: weekStart, end: weekEnd } = getBelgradeWeekRange(todayDate);

  // KPI counts use head:true count queries so we only pull the count, not rows.
  // They run in parallel with the full bookings fetch (still needed for the
  // panels and tables further down the page).
  const [
    bookingsResult,
    todayCountResult,
    weekCountResult,
    pendingCountResult,
  ] = await Promise.all([
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
      .order("booking_date", { ascending: true })
      .order("booking_time", { ascending: true }),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("booking_date", todayDate),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .gte("booking_date", weekStart)
      .lte("booking_date", weekEnd),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  const { data: bookings, error: bookingsError } = bookingsResult;

  const todayCount = todayCountResult.count ?? 0;
  const weekCount = weekCountResult.count ?? 0;
  const pendingCount = pendingCountResult.count ?? 0;

  const allBookings = bookings || [];

  const activeBookings = allBookings.filter(
    (booking) => booking.status !== "cancelled"
  );
  const todayBookings = activeBookings.filter(
    (booking) => booking.booking_date === todayDate
  );
  const confirmedBookings = allBookings.filter(
    (booking) => booking.status === "confirmed"
  );
  const monthlyBookings = activeBookings.filter(
    (booking) => getMonthKey(booking.booking_date) === monthKey
  );
  const monthlyRevenue = monthlyBookings.reduce(
    (total, booking) => total + Number(booking.service_durations?.price || 0),
    0
  );

  // Total clients: there is no `profiles` table in this schema (registered users
  // live in auth.users, which isn't queryable under RLS here), so we count unique
  // clients by distinct guest_email (falling back to phone) from bookings.
  const clientKeys = new Set();
  allBookings.forEach((booking) => {
    const key =
      String(booking.guest_email || "").trim().toLowerCase() ||
      String(booking.guest_phone || "").trim();

    if (key) {
      clientKeys.add(key);
    }
  });

  const serviceCounts = new Map();
  activeBookings.forEach((booking) => {
    const serviceName = booking.services?.name || "Unknown service";
    serviceCounts.set(serviceName, (serviceCounts.get(serviceName) || 0) + 1);
  });

  const topService = Array.from(serviceCounts.entries()).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const recentBookings = [...allBookings]
    .sort((a, b) =>
      String(b.created_at || "").localeCompare(String(a.created_at || ""))
    )
    .slice(0, 5);

  const upcomingBookings = activeBookings
    .filter((booking) => getBookingDateTimeValue(booking) >= `${todayDate} 00:00:00`)
    .sort((a, b) =>
      getBookingDateTimeValue(a).localeCompare(getBookingDateTimeValue(b))
    )
    .slice(0, 6);

  return (
    <AdminShell activePage="dashboard" title="Dashboard" userEmail={user.email}>
        <div className="mb-10 grid gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-sage-dark">
              Overview
            </p>
            <h1 className="font-heading text-5xl text-charcoal">
              Good day, Lumera
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              Track today&apos;s appointments, pending requests, client growth and
              revenue from one focused workspace.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link
              href="/admin/reservations?status=pending"
              className="rounded-full bg-charcoal px-5 py-3 text-sm font-semibold text-white transition hover:bg-sage-dark"
            >
              Review pending
            </Link>
            <Link
              href="/booking"
              className="rounded-full border border-sage/20 bg-white px-5 py-3 text-sm font-semibold text-charcoal transition hover:bg-sand"
            >
              New booking
            </Link>
          </div>
        </div>

        {/* Phase 1: KPI stat cards. These 4 cards always render (fed by their own
            count queries), independent of whether the full bookings list loaded. */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Today's bookings"
            value={todayCount}
            hint={todayDate}
            icon={<CalendarIcon />}
          />
          <StatCard
            label="This week's bookings"
            value={weekCount}
            hint={`${weekStart} – ${weekEnd}`}
            icon={<WeekIcon />}
          />
          <StatCard
            label="Pending bookings"
            value={pendingCount}
            hint="Awaiting admin review"
            icon={<ClockIcon />}
          />
          <StatCard
            label="Total clients"
            value={clientKeys.size}
            hint="Unique guest emails"
            icon={<UsersIcon />}
          />
        </div>

        {bookingsError ? (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            Failed to load dashboard data. Please try again.
          </div>
        ) : null}

        {!bookingsError ? (
          <>
            {/* Secondary metrics: Confirmed + monthly revenue are kept here (not
                duplicated in the KPI row above) so no existing feature is lost. */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              <MetricCard
                label="Confirmed"
                value={confirmedBookings.length}
                helper="Approved appointments"
              />
              <MetricCard
                label="Month revenue"
                value={formatMoney(monthlyRevenue)}
                helper={monthKey}
              />
            </div>

            <div className="mb-8 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
              <div className="rounded-[2rem] border border-sage/15 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-muted">
                      Command center
                    </p>
                    <h2 className="mt-2 font-heading text-3xl text-charcoal">
                      Upcoming appointments
                    </h2>
                  </div>
                  <Link
                    href="/admin/reservations"
                    className="rounded-full border border-sage/20 px-4 py-2 text-xs font-semibold text-charcoal transition hover:bg-sand"
                  >
                    View all
                  </Link>
                </div>

                {upcomingBookings.length > 0 ? (
                  <div>
                    {upcomingBookings.map((booking) => (
                      <BookingRow key={booking.id} booking={booking} />
                    ))}
                  </div>
                ) : (
                  <EmptyPanel
                    title="No upcoming appointments"
                    text="New confirmed or pending bookings will appear here."
                  />
                )}
              </div>

              <div className="grid gap-6">
                <div className="rounded-[2rem] border border-sage/15 bg-white p-6 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted">
                    Top treatment
                  </p>
                  <h2 className="mt-3 font-heading text-3xl text-charcoal">
                    {topService?.[0] || "No bookings yet"}
                  </h2>
                  <p className="mt-2 text-sm text-muted">
                    {topService
                      ? `${topService[1]} active booking${
                          topService[1] === 1 ? "" : "s"
                        }`
                      : "Top service will appear after bookings."}
                  </p>
                </div>

                <div className="rounded-[2rem] border border-sage/15 bg-white p-6 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted">
                    Today schedule
                  </p>
                  <div className="mt-5 space-y-4">
                    {todayBookings.length > 0 ? (
                      todayBookings.slice(0, 4).map((booking) => (
                        <div
                          key={booking.id}
                          className="rounded-2xl bg-cream p-4 ring-1 ring-sage/10"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-medium text-charcoal">
                              {String(booking.booking_time).slice(0, 5)}
                            </p>
                            <StatusBadge status={booking.status} />
                          </div>
                          <p className="mt-2 text-sm text-charcoal">
                            {booking.guest_name}
                          </p>
                          <p className="mt-1 text-xs text-muted">
                            {booking.services?.name || "Unknown service"}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted">
                        No appointments scheduled today.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-sage/15 bg-white p-6 shadow-sm">
              <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted">
                    Recent activity
                  </p>
                  <h2 className="mt-2 font-heading text-3xl text-charcoal">
                    Latest booking requests
                  </h2>
                </div>
                <Link
                  href="/admin/clients"
                  className="text-sm font-semibold text-sage-dark transition hover:text-charcoal"
                >
                  Open clients
                </Link>
              </div>

              {recentBookings.length > 0 ? (
                <div className="grid gap-3">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="grid gap-3 rounded-2xl bg-cream p-4 ring-1 ring-sage/10 md:grid-cols-[1.2fr_1fr_0.8fr_0.7fr] md:items-center"
                    >
                      <div>
                        <p className="font-medium text-charcoal">
                          {booking.guest_name}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          Created {formatDate(booking.created_at)}
                        </p>
                      </div>
                      <p className="text-sm text-muted">
                        {booking.services?.name || "Unknown service"}
                      </p>
                      <p className="text-sm text-charcoal">
                        {booking.booking_date} at{" "}
                        {String(booking.booking_time).slice(0, 5)}
                      </p>
                      <StatusBadge status={booking.status} />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyPanel
                  title="No activity yet"
                  text="Latest booking requests will appear here."
                />
              )}
            </div>
          </>
        ) : null}
    </AdminShell>
  );
}
