"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import EditBookingModal from "./EditBookingModal";
import NewBookingModal from "./NewBookingModal";

const STATUS_CHIP = {
  pending:   "bg-amber-50 border-amber-200 text-amber-800",
  confirmed: "bg-sage/10 border-sage/30 text-sage-dark",
  completed: "bg-charcoal/10 border-charcoal/20 text-charcoal",
  cancelled: "bg-clay/10 border-clay/20 text-clay",
};

const STATUS_BADGE = {
  pending:   "bg-amber-50 text-amber-700 border-amber-100",
  confirmed: "bg-sage/10 text-sage-dark border-sage/20",
  completed: "bg-charcoal/10 text-charcoal border-charcoal/10",
  cancelled: "bg-clay/10 text-clay border-clay/20",
};

const DAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function getTodayBelgrade() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Belgrade",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function addMonths(yearMonth, delta) {
  const [y, m] = yearMonth.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  const ny = d.getUTCFullYear();
  const nm = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${ny}-${nm}`;
}

function buildMonthGrid(yearMonth) {
  const [year, month] = yearMonth.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  // weekday of the 1st (0=Mon … 6=Sun)
  const firstWeekday = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;

  const cells = [];

  // Leading days from previous month (greyed out, no bookings)
  const prevMonth = new Date(Date.UTC(year, month - 1, 0));
  const daysInPrev = prevMonth.getUTCDate();
  for (let i = firstWeekday - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    const [py, pm] = addMonths(yearMonth, -1).split("-");
    cells.push({ date: `${py}-${pm}-${String(d).padStart(2, "0")}`, current: false });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      date: `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      current: true,
    });
  }

  // Trailing days to fill the last row
  const remaining = (7 - (cells.length % 7)) % 7;
  const [ny, nm] = addMonths(yearMonth, 1).split("-");
  for (let d = 1; d <= remaining; d++) {
    cells.push({ date: `${ny}-${nm}-${String(d).padStart(2, "0")}`, current: false });
  }

  return cells;
}

function formatFullDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${
        STATUS_BADGE[status] || "border-sage/10 bg-sand text-charcoal"
      }`}
    >
      {status}
    </span>
  );
}

export default function MonthlyCalendar({ bookings, services, yearMonth }) {
  const router = useRouter();
  const today = useMemo(() => getTodayBelgrade(), []);

  const [selectedDate, setSelectedDate] = useState(null);
  const [editBooking, setEditBooking] = useState(null);
  const [newBookingDate, setNewBookingDate] = useState(null);

  const [year, month] = yearMonth.split("-").map(Number);
  const monthLabel = `${MONTH_NAMES[month - 1]} ${year}`;

  const cells = useMemo(() => buildMonthGrid(yearMonth), [yearMonth]);

  const bookingsByDate = useMemo(() => {
    const map = {};
    bookings.forEach((b) => {
      if (!map[b.booking_date]) map[b.booking_date] = [];
      map[b.booking_date].push(b);
    });
    return map;
  }, [bookings]);

  const selectedBookings = selectedDate ? (bookingsByDate[selectedDate] || []) : [];

  function handleDayClick(dateStr, isCurrent) {
    if (!isCurrent) return;
    setSelectedDate((prev) => (prev === dateStr ? null : dateStr));
  }

  function handleAddBooking(dateStr) {
    setNewBookingDate(dateStr);
  }

  return (
    <>
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-sage-dark">Lumera Admin</p>
          <h1 className="mt-1 font-heading text-5xl text-charcoal">Calendar</h1>
          <p className="mt-2 text-sm text-muted">{monthLabel}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              const [cy, cm] = getTodayBelgrade().split("-");
              router.push(`/admin/calendar?month=${cy}-${cm}`);
            }}
            className="rounded-full border border-sage/20 px-4 py-2 text-sm font-semibold text-charcoal transition hover:bg-sand"
          >
            Today
          </button>
          <button
            onClick={() => router.push(`/admin/calendar?month=${addMonths(yearMonth, -1)}`)}
            aria-label="Previous month"
            className="rounded-full border border-sage/20 p-2 text-charcoal transition hover:bg-sand"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => router.push(`/admin/calendar?month=${addMonths(yearMonth, 1)}`)}
            aria-label="Next month"
            className="rounded-full border border-sage/20 p-2 text-charcoal transition hover:bg-sand"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          <span className="rounded-full bg-white px-4 py-2 text-sm text-muted shadow-sm">
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""} this month
          </span>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="overflow-hidden rounded-[2rem] border border-sage/15 bg-white shadow-sm">
        {/* Day-of-week header */}
        <div className="grid grid-cols-7 border-b border-sage/10">
          {DAY_HEADERS.map((d) => (
            <div key={d} className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-sage/10">
          {cells.map(({ date, current }) => {
            const isToday = date === today;
            const isSelected = date === selectedDate;
            const dayBookings = bookingsByDate[date] || [];
            const dayNum = parseInt(date.split("-")[2], 10);
            const visible = dayBookings.slice(0, 3);
            const overflow = dayBookings.length - visible.length;

            return (
              <div
                key={date}
                onClick={() => handleDayClick(date, current)}
                className={`min-h-[110px] p-2 transition-colors ${
                  current ? "cursor-pointer hover:bg-sand/40" : "bg-sand/20 cursor-default"
                } ${isSelected ? "bg-sand/60" : ""}`}
              >
                {/* Date number + add button */}
                <div className="mb-1.5 flex items-center justify-between">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
                      isToday
                        ? "bg-charcoal text-white"
                        : current
                        ? "text-charcoal"
                        : "text-muted/40"
                    }`}
                  >
                    {dayNum}
                  </span>

                  {current ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAddBooking(date); }}
                      aria-label={`Add booking on ${date}`}
                      className="rounded-full p-1 text-muted opacity-0 transition hover:bg-sand hover:text-charcoal group-hover:opacity-100 hover:opacity-100"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-3.5 w-3.5" aria-hidden="true">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </button>
                  ) : null}
                </div>

                {/* Booking chips */}
                <div className="flex flex-col gap-0.5">
                  {visible.map((b) => (
                    <div
                      key={b.id}
                      className={`truncate rounded px-1.5 py-0.5 text-xs border ${
                        STATUS_CHIP[b.status] || "bg-sand border-sage/20 text-charcoal"
                      }`}
                    >
                      <span className="font-semibold">{String(b.booking_time).slice(0, 5)}</span>
                      {" "}{b.guest_name}
                    </div>
                  ))}
                  {overflow > 0 ? (
                    <p className="px-1.5 text-xs text-muted">+{overflow} more</p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected day detail panel */}
      {selectedDate ? (
        <div className="mt-6 rounded-[2rem] border border-sage/15 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-muted">Day view</p>
              <h2 className="mt-1 font-heading text-3xl text-charcoal">
                {formatFullDate(selectedDate)}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAddBooking(selectedDate)}
                className="rounded-full bg-charcoal px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-dark"
              >
                + Add booking
              </button>
              <button
                onClick={() => setSelectedDate(null)}
                aria-label="Close"
                className="rounded-full p-2 text-muted transition hover:bg-sand hover:text-charcoal"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
          </div>

          {selectedBookings.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">
              No bookings on this day.
            </p>
          ) : (
            <div className="grid gap-3">
              {selectedBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-2xl border border-sage/15 bg-cream p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-bold text-charcoal ring-1 ring-sage/15">
                        {String(booking.booking_time).slice(0, 5)}
                      </div>
                      <div>
                        <p className="font-semibold text-charcoal">{booking.guest_name}</p>
                        <p className="text-sm text-muted">{booking.services?.name || "Unknown service"}</p>
                      </div>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted sm:grid-cols-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide">Duration</p>
                      <p className="mt-0.5 text-charcoal">{booking.service_durations?.minutes || "—"} min</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide">Price</p>
                      <p className="mt-0.5 text-charcoal">
                        {booking.service_durations?.price != null
                          ? `€${booking.service_durations.price}`
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide">Email</p>
                      <p className="mt-0.5 truncate text-charcoal">{booking.guest_email || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide">Phone</p>
                      <p className="mt-0.5 text-charcoal">{booking.guest_phone || "—"}</p>
                    </div>
                  </div>

                  {booking.notes ? (
                    <p className="mt-2 rounded-lg bg-white px-3 py-2 text-sm italic text-muted ring-1 ring-sage/10">
                      {booking.notes}
                    </p>
                  ) : null}

                  <div className="mt-3 flex flex-wrap gap-2">
                    {(booking.status === "pending" || booking.status === "confirmed") ? (
                      <button
                        onClick={() => setEditBooking(booking)}
                        className="rounded-full border border-sage/20 px-4 py-1.5 text-xs font-semibold text-charcoal transition hover:bg-sand"
                      >
                        Edit
                      </button>
                    ) : null}
                    <Link
                      href={`/admin/reservations?q=${encodeURIComponent(booking.guest_name)}`}
                      className="rounded-full border border-sage/20 px-4 py-1.5 text-xs font-semibold text-muted transition hover:bg-sand hover:text-charcoal"
                    >
                      Manage status →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {/* Modals */}
      {editBooking ? (
        <EditBookingModal
          booking={editBooking}
          services={services}
          onClose={() => setEditBooking(null)}
        />
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
