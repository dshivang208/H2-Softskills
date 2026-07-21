// Small shared helper for the public "Our Clients" marquee on the Home
// page. Points at the Express backend in server/. Override with a Vite
// env var (VITE_API_URL) when deploying so the frontend can hit a
// different host.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * fetch() wrapper for the public client-logos endpoint. Throws an Error
 * with a readable message on failure.
 */
export async function fetchPublishedClientLogos() {
  const res = await fetch(`${API_URL}/api/client-logos`);

  let data = null;
  try {
    data = await res.json();
  } catch {
    // No JSON body — fall through with data === null.
  }

  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || 'Something went wrong. Please try again.');
  }

  return data;
}