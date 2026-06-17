/**
 * StatCard — reusable presentational KPI card for the admin dashboard.
 *
 * Props:
 *   label  string             small uppercase caption (e.g. "Today's bookings")
 *   value  string | number    the big headline number
 *   hint   string (optional)  small supporting line below the value
 *   icon   ReactNode (optional) inline SVG shown in a circular badge; you may
 *                                also pass the icon as `children`.
 *
 * Purely presentational — no data fetching. Matches the blush/gold palette.
 */
export default function StatCard({ label, value, hint, icon, children }) {
  const badge = icon ?? children;

  return (
    <div className="relative rounded-2xl bg-cream p-5 shadow-sm ring-1 ring-charcoal/10">
      {badge ? (
        <span
          aria-hidden="true"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-sage/10 text-sage-dark ring-1 ring-gold/20"
        >
          {badge}
        </span>
      ) : null}

      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-3 font-heading text-3xl text-charcoal">{value}</p>
      {hint ? <p className="mt-1 text-sm text-muted">{hint}</p> : null}
    </div>
  );
}
