// Small shared helper for the public case study page. Points at the
// Express backend in server/. Override with a Vite env var (VITE_API_URL)
// when deploying so the frontend can hit a different host.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Fetches the published case study for a project. Returns null (rather
 * than throwing) when nothing has been published yet, so the page can show
 * a friendly "coming soon" state instead of an error.
 */
export async function fetchCaseStudy(projectId) {
  try {
    const res = await fetch(`${API_URL}/api/case-studies/${encodeURIComponent(projectId)}`);
    const data = await res.json();
    if (!res.ok || !data?.ok) return null;
    return data.caseStudy;
  } catch {
    return null;
  }
}