/**
 * Formatting helpers for displaying service data.
 * Prices are stored as plain EUR integers in the mock data.
 */

export function formatPrice(price) {
  return `€${price}`;
}

export function formatDuration(minutes) {
  return `${minutes} min`;
}
