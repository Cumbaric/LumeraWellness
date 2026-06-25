/**
 * Formatting helpers for displaying service data.
 * Prices are stored as plain EUR integers.
 */

export function formatPrice(price) {
  return `€${price}`;
}

export function formatDuration(minutes) {
  return `${minutes} min`;
}

/**
 * Returns the lowest price across a service's durations.
 * Used for the "from €XX" label on ServiceCard.
 */
export function getStartingPrice(service) {
  return Math.min(...service.durations.map((d) => d.price));
}

/**
 * Returns a human-readable duration range for a service.
 * Single duration → "60 min". Multiple → "60–90 min".
 */
export function getDurationRange(service) {
  if (!service.durations?.length) return null;
  const minutes = service.durations.map((d) => d.minutes);
  const min = Math.min(...minutes);
  const max = Math.max(...minutes);
  return min === max ? `${min} min` : `${min}–${max} min`;
}

/**
 * Estimates reading time from HTML content string.
 * Strips tags, counts words, assumes 200 words/min.
 * Returns e.g. "3 min read".
 */
export function getReadingTime(html) {
  if (!html) return null;
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text.split(" ").filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}
