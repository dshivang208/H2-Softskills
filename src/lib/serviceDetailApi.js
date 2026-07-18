// Small shared helper for the public service detail page. Points at the
// Express backend in server/. Override with a Vite env var (VITE_API_URL)
// when deploying so the frontend can hit a different host.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Fetches the published detail content for a service. Returns null (rather
 * than throwing) when nothing has been published yet, so the page can show
 * a friendly "coming soon" state instead of an error.
 */
export async function fetchServiceDetail(serviceId) {
  try {
    const res = await fetch(`${API_URL}/api/service-details/${encodeURIComponent(serviceId)}`);
    const data = await res.json();
    if (!res.ok || !data?.ok) return null;
    return data.serviceDetail;
  } catch {
    return null;
  }
}