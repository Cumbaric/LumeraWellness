import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import WeeklyCalendar from "@/components/admin/WeeklyCalendar";
import { getServices } from "@/lib/services";

export const metadata = {
  title: "Calendar | Lumera Wellness Admin",
  description: "Weekly calendar view of Lumera Wellness appointments.",
};

export const dynamic = "force-dynamic";

function getCurrentMondayBelgrade() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Belgrade",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const get = (type) => parts.find((p) => p.type === type)?.value;
  const todayStr = `${get("year")}-${get("month")}-${get("day")}`;

  const [year, month, day] = todayStr.split("-").map(Number);
  const base = new Date(Date.UTC(year, month - 1, day));
  const weekday = base.getUTCDay();
  const daysSinceMonday = (weekday + 6) % 7;

  const monday = new Date(base);
  monday.setUTCDate(base.getUTCDate() - daysSinceMonday);

  return monday.toISOString().slice(0, 10);
}

function getParamValue(value) {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

function isValidMonday(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.getUTCDay() === 1;
}

export default async function AdminCalendarPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const weekParam = getParamValue(resolvedSearchParams?.week);

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

  const weekStart = isValidMonday(weekParam)
    ? weekParam
    : getCurrentMondayBelgrade();

  const [year, month, day] = weekStart.split("-").map(Number);
  const mondayUTC = new Date(Date.UTC(year, month - 1, day));
  const sundayUTC = new Date(mondayUTC);
  sundayUTC.setUTCDate(mondayUTC.getUTCDate() + 6);
  const weekEnd = sundayUTC.toISOString().slice(0, 10);

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
      .gte("booking_date", weekStart)
      .lte("booking_date", weekEnd)
      .order("booking_date", { ascending: true })
      .order("booking_time", { ascending: true }),
    getServices(),
  ]);

  const bookings = bookingsResult.data || [];

  return (
    <AdminShell
      activePage="calendar"
      title="Calendar"
      userEmail={user.email}
    >
      <WeeklyCalendar
        bookings={bookings}
        services={services}
        weekStart={weekStart}
      />
    </AdminShell>
  );
}
