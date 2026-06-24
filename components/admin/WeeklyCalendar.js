"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import EditBookingModal from "./EditBookingModal";
import NewBookingModal from "./NewBookingModal";

const STATUS_COLORS = {
  pending: "bg-amber-50 border-amber-200 text-amber-800",
  confirmed: "bg-sage/10 border-sage/30 text-sage-dark",
  completed: "bg-charcoal/10 border-charcoal/20 text-charcoal",
  cancelled: "bg-clay/10 border-clay/20 text-clay",
};

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getWeekDays(weekStart) {
  const [year, month, day] = weekStart.split("-").map(Number);
  const monday = new Date(Date.UTC(year, month - 1, day));

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setUTCDate(monday.getUTCDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

function addWeeks(weekStart, delta) {
  const [year, month, day] = weekStart.split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  d.setUTCDate(d.getUTCDate() + delta * 7);
  return d.toISOString().slice(0, 10);
}

function getTodayBelgrade() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Belgrade",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const get = (type) => parts.find((p) => p.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function formatDayHeader(dateStr) {
  const [, month, day] = dateStr.split("-");
  return `${day}/${month}`;
}

function formatMonthRange(weekDays) {
  const first = weekDays[0];
  const last = weekDays[6];
  const [fy, fm] = first.split("-");
  const [, lm, ld] = last.split("-");
  const monthName = (m) =>
    new Date(Date.UTC(2000, Number(m) - 1, 1)).toLocaleString("en-GB", {
      month: "long",
    });
  if (fm === lm) return `${monthName(fm)} ${fy}`;
  return `${monthName(fm)} – ${monthName(lm)} ${fy}`;
}

export default function WeeklyCalendar({ bookings, services, weekStart }) {
  const router = useRouter();
  const today = useMemo(() => getTodayBelgrade(), []);
  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);

  const [editBooking, setEditBooking] = useState(null);
  const [newBookingDate, setNewBookingDate] = useState(null);

  const bookingsByDay = useMemo(() => {
    const map = {};
    weekDays.forEach((d) => {
      map[d] = [];
    });
    bookings.forEach((b) => {
      if (map[b.booking_date]) {
        map[b.booking_date].push(b);
      }
    });
    return map;
  }, [bookings, weekDays]);

  function goToPrev() {
    router.push(`/admin/calendar?week=${addWeeks(weekStart, -1)}`);
  }

  function goToNext() {
    router.push(`/admin/calendar?week=${addWeeks(weekStart, 1)}`);
  }

  function goToToday() {
    const [year, month, day] = today.split("-").map(Number);
    const base = new Date(Date.UTC(year, month - 1, day));
    const weekday = base.getUTCDay();
    const daysSinceMonday = (weekday + 6) % 7;
    const monday = new Date(base);
    monday.setUTCDate(base.getUTCDate() - daysSinceMonday);
    router.push(`/admin/calendar?week=${monday.toISOString().slice(0, 10)}`);
  }

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-sage-dark">
            Lumera Admin
          </p>
          <h1 className="mt-1 font-heading text-5xl text-charcoal">
            Calendar
          </h1>
          <p className="mt-2 text-sm text-muted">
            {formatMonthRange(weekDays)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={goToToday}
            className="rounded-full border border-sage/20 px-4 py-2 text-sm font-semibold text-charcoal transition hover:bg-sand"
          >
            Today
          </button>
          <button
            onClick={goToPrev}
            aria-label="Previous week"
            className="rounded-full border border-sage/20 p-2 text-charcoal transition hover:bg-sand"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            aria-label="Next week"
            className="rounded-full border border-sage/20 p-2 text-charcoal transition hover:bg-sand"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          <span className="rounded-full bg-white px-4 py-2 text-sm text-muted shadow-sm">
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""} this week
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[700px] grid grid-cols-7 gap-3">
          {weekDays.map((dateStr, i) => {
            const isToday = dateStr === today;
            const dayBookings = bookingsByDay[dateStr] || [];

            return (
              <div key={dateStr} className="flex flex-col gap-2">
                <div
                  className={`flex items-center justify-between rounded-xl px-3 py-2 ${
                    isToday
                      ? "bg-charcoal text-white"
                      : "bg-white ring-1 ring-sage/15"
                  }`}
                >
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wide ${isToday ? "text-cream/70" : "text-muted"}`}>
                      {DAY_NAMES[i]}
                    </p>
                    <p className={`text-sm font-semibold ${isToday ? "text-white" : "text-charcoal"}`}>
                      {formatDayHeader(dateStr)}
                    </p>
                  </div>
                  <button
                    onClick={() => setNewBookingDate(dateStr)}
                    aria-label={`New booking on ${dateStr}`}
                    className={`rounded-full p-1 transition ${
                      isToday
                        ? "text-cream/70 hover:bg-white/10 hover:text-white"
                        : "text-muted hover:bg-sand hover:text-charcoal"
                    }`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4" aria-hidden="true">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  {dayBookings.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-sage/20 px-3 py-4 text-center">
                      <p className="text-xs text-muted/60">No bookings</p>
                    </div>
                  ) : (
                    dayBookings.map((booking) => (
                      <button
                        key={booking.id}
                        onClick={() => setEditBooking(booking)}
                        className={`w-full rounded-xl border px-3 py-2.5 text-left transition hover:shadow-sm ${
                          STATUS_COLORS[booking.status] ||
                          "bg-sand border-sage/20 text-charcoal"
                        }`}
                      >
                        <p className="text-xs font-semibold">
                          {String(booking.booking_time).slice(0, 5)}
                          {booking.service_durations?.minutes
                            ? ` · ${booking.service_durations.minutes}m`
                            : ""}
                        </p>
                        <p className="mt-0.5 truncate text-xs font-medium">
                          {booking.guest_name}
                        </p>
                        <p className="mt-0.5 truncate text-xs opacity-70">
                          {booking.services?.name || "Unknown"}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {editBooking &&
        (editBooking.status === "pending" ||
          editBooking.status === "confirmed") ? (
        <EditBookingModal
          booking={editBooking}
          services={services}
          onClose={() => setEditBooking(null)}
        />
      ) : editBooking ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-charcoal/50 p-4"
          onClick={() => setEditBooking(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-cream p-6 shadow-xl ring-1 ring-charcoal/10"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs uppercase tracking-[0.22em] text-muted">
              {editBooking.status}
            </p>
            <h2 className="mt-1 font-heading text-2xl text-charcoal">
              {editBooking.guest_name}
            </h2>
            <p className="mt-3 text-sm text-muted">
              {editBooking.services?.name} — {editBooking.booking_date} at{" "}
              {String(editBooking.booking_time).slice(0, 5)}
            </p>
            <p className="mt-1 text-sm text-muted">
              {editBooking.guest_email} · {editBooking.guest_phone}
            </p>
            {editBooking.notes ? (
              <p className="mt-2 text-sm text-muted italic">{editBooking.notes}</p>
            ) : null}
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setEditBooking(null)}
                className="rounded-full bg-charcoal px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-dark"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {newBookingDate ? (
        <NewBookingModal
          services={services}
          initialDate={newBookingDate}
          onClose={() => setNewBookingDate(null)}
        />
      ) : null}
    </>
  );
}
