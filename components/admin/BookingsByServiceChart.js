"use client";

/**
 * BookingsByServiceChart — presentational Recharts vertical bar chart.
 *
 * Props:
 *   data  Array<{ name: string, count: number }>  already aggregated, sorted
 *         descending, and filtered to services with >= 1 booking by the server
 *         component. This component does no fetching of its own.
 *
 * The empty-state is handled by the parent card; this only renders when data
 * has at least one entry.
 */
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const SAGE = "#5C4C42";
const GRID = "#E2C9C1"; // sand

function truncate(label, max = 14) {
  const value = String(label ?? "");
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

// Show whole numbers only on the Y axis (booking counts are integers).
function integerTicks(max) {
  const top = Math.max(1, Math.ceil(max));
  const step = Math.max(1, Math.ceil(top / 5));
  const ticks = [];
  for (let value = 0; value <= top; value += step) {
    ticks.push(value);
  }
  if (ticks[ticks.length - 1] !== top) {
    ticks.push(top);
  }
  return ticks;
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const point = payload[0].payload;

  return (
    <div className="rounded-xl bg-cream px-4 py-3 text-charcoal shadow-md ring-1 ring-charcoal/10">
      <p className="font-heading text-base leading-tight">{point.name}</p>
      <p className="mt-1 text-sm text-muted">
        {point.count} booking{point.count === 1 ? "" : "s"}
      </p>
    </div>
  );
}

export default function BookingsByServiceChart({ data }) {
  const maxCount = data.reduce((max, item) => Math.max(max, item.count), 0);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 8, right: 8, left: -16, bottom: 56 }}
        barCategoryGap="28%"
      >
        <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          tickFormatter={(value) => truncate(value)}
          angle={-30}
          textAnchor="end"
          interval={0}
          height={56}
          tick={{ fill: "#8A7A70", fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: GRID }}
        />
        <YAxis
          allowDecimals={false}
          ticks={integerTicks(maxCount)}
          domain={[0, Math.max(1, Math.ceil(maxCount))]}
          tick={{ fill: "#8A7A70", fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: GRID }}
        />
        <Tooltip
          cursor={{ fill: "rgba(92, 76, 66, 0.06)" }}
          content={<ChartTooltip />}
        />
        <Bar dataKey="count" fill={SAGE} radius={[6, 6, 0, 0]} maxBarSize={64} />
      </BarChart>
    </ResponsiveContainer>
  );
}
