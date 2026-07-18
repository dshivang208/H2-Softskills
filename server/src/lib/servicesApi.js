// Small shared helper for the public Services page. Points at the Express
// backend in server/. Override with a Vite env var (VITE_API_URL) when
// deploying so the frontend can hit a different host.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Fetches admin-added, published services. Returns an empty array (rather
 * than throwing) on failure, so the Services page can always fall back to
 * showing just the built-in hardcoded cards.
 */
export async function fetchPublishedServices() {
  try {
    const res = await fetch(`${API_URL}/api/services`);
    const data = await res.json();
    if (!res.ok || !data?.ok) return [];
    return data.services || [];
  } catch {
    return [];
  }
}