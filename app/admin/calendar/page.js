import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import MonthlyCalendar from "@/components/admin/MonthlyCalendar";
import { getServices } from "@/lib/services";

export const metadata = {
  title: "Calendar | Lumera Wellness Admin",
  description: "Monthly calendar view of Lumera Wellness appointments.",
};

export const dynamic = "force-dynamic";

function getCurrentYearMonth() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Belgrade",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  return `${year}-${month}`;
}

function getParamValue(value) {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

function isValidYearMonth(str) {
  return /^\d{4}-\d{2}$/.test(str);
}

export default async function AdminCalendarPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const monthParam = getParamValue(resolvedSearchParams?.month);

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
  if (adminError || !isAdmin) redirect("/admin/login");

  const yearMonth = isValidYearMonth(monthParam)
    ? monthParam
    : getCurrentYearMonth();

  const [year, month] = yearMonth.split("-").map(Number);
  const firstDay = `${yearMonth}-01`;
  const lastDayDate = new Date(Date.UTC(year, month, 0));
  const lastDay = lastDayDate.toISOString().slice(0, 10);

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
        services ( name ),
        service_durations ( minutes, price )
      `
      )
      .gte("booking_date", firstDay)
      .lte("booking_date", lastDay)
      .order("booking_date", { ascending: true })
      .order("booking_time", { ascending: true }),
    getServices(),
  ]);

  const bookings = bookingsResult.data || [];

  return (
    <AdminShell activePage="calendar" title="Calendar" userEmail={user.email}>
      <MonthlyCalendar
        bookings={bookings}
        services={services}
        yearMonth={yearMonth}
      />
    </AdminShell>
  );
}
