/**
 * Signature section heading: an optional uppercase label, a serif title, and a
 * thin gold divider beneath. Used across the site for a consistent rhythm.
 *
 * Props:
 *   - label?: string   small uppercase pre-title (gold/clay)
 *   - title:  string   main heading text (required)
 *   - align?: 'center' | 'left'   default 'center'
 *   - light?: boolean   render title/label light for dark backgrounds
 *                       (divider stays gold). Default false.
 */
export default function SectionHeading({
  label,
  title,
  align = "center",
  light = false,
}) {
  const isCenter = align === "center";

  return (
    <div className={`mb-12 ${isCenter ? "text-center" : "text-left"}`}>
      {label && (
        <span
          className={`text-sm font-medium uppercase tracking-[0.25em] ${
            light ? "text-gold" : "text-clay"
          }`}
        >
          {label}
        </span>
      )}
      <h2
        className={`mt-3 font-heading text-3xl font-semibold sm:text-4xl ${
          light ? "text-cream" : "text-charcoal"
        }`}
      >
        {title}
      </h2>
      <div
        className={`mt-5 h-0.5 w-20 bg-gold ${isCenter ? "mx-auto" : ""}`}
        aria-hidden="true"
      />
    </div>
  );
}
