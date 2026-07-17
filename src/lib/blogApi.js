// Small shared helper for the public Blog / BlogPost pages. Points at the
// Express backend in server/. Override with a Vite env var (VITE_API_URL)
// when deploying so the frontend can hit a different host.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * fetch() wrapper for the public blog endpoints. Throws an Error with a
 * readable message on failure.
 */
export async function blogFetch(path) {
  const res = await fetch(`${API_URL}${path}`);

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

export function fetchPublishedPosts({ category, search } = {}) {
  const params = new URLSearchParams();
  if (category && category.toLowerCase() !== 'all articles') params.set('category', category);
  if (search) params.set('search', search);
  const qs = params.toString();
  return blogFetch(`/api/blog${qs ? `?${qs}` : ''}`);
}

export function fetchPopularPosts() {
  return blogFetch('/api/blog/popular');
}

export function fetchPostBySlug(slug) {
  return blogFetch(`/api/blog/${encodeURIComponent(slug)}`);
}