// Small shared helper for the admin dashboard. Keeps the JWT in
// localStorage and attaches it to every authenticated request.
//
// Points at the Express backend in server/. Override with a Vite env var
// (VITE_API_URL) when deploying so the frontend can hit a different host.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TOKEN_KEY = 'h2_admin_token';

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAdminLoggedIn() {
  return Boolean(getAdminToken());
}

/**
 * fetch() wrapper that attaches the admin bearer token and parses JSON.
 * Throws an Error with a readable message on failure, and clears the
 * stored token on a 401 so the app can redirect back to /admin/login.
 */
export async function adminFetch(path, options = {}) {
  const token = getAdminToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // No JSON body — fall through with data === null.
  }

  if (res.status === 401) {
    clearAdminToken();
  }

  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || 'Something went wrong. Please try again.');
  }

  return data;
}

/**
 * fetch() wrapper for multipart/form-data uploads (e.g. the case study PDF
 * uploader). Attaches the admin bearer token but — unlike adminFetch —
 * deliberately does NOT set a Content-Type header, so the browser can set
 * the correct multipart boundary itself. Throws an Error with a readable
 * message on failure, and clears the stored token on a 401.
 */
export async function adminUpload(path, formData) {
  const token = getAdminToken();

  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // No JSON body — fall through with data === null.
  }

  if (res.status === 401) {
    clearAdminToken();
  }

  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || 'Something went wrong. Please try again.');
  }

  return data;
}