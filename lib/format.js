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
