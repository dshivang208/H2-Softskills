import { Router } from 'express';
import { supabase } from '../supabaseClient.js';

const router = Router();

// Columns exposed to the public site. Never leak `status` for a specific
// row beyond what's needed, and never expose drafts here.
const PUBLIC_COLUMNS =
  'id, title, slug, excerpt, content, category, image_url, author, read_time, is_popular, created_at';

// ---------------------------------------------------------------------------
// GET /api/blog  — published posts, optionally filtered by category/search
// ---------------------------------------------------------------------------
router.get('/', async (req, res) => {
  const category = String(req.query?.category ?? '').trim();
  const search = String(req.query?.search ?? '').trim();

  let query = supabase
    .from('blogs')
    .select(PUBLIC_COLUMNS)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (category && category.toLowerCase() !== 'all articles') {
    query = query.eq('category', category);
  }

  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[blog] Fetch posts failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not load blog posts.' });
  }

  return res.status(200).json({ ok: true, posts: data });
});

// ---------------------------------------------------------------------------
// GET /api/blog/categories  — distinct categories among published posts
// ---------------------------------------------------------------------------
router.get('/categories', async (_req, res) => {
  const { data, error } = await supabase
    .from('blogs')
    .select('category')
    .eq('status', 'published');

  if (error) {
    console.error('[blog] Fetch categories failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not load categories.' });
  }

  const categories = Array.from(new Set((data || []).map((row) => row.category))).sort();
  return res.status(200).json({ ok: true, categories });
});

// ---------------------------------------------------------------------------
// GET /api/blog/popular  — up to 3 posts flagged as popular
// ---------------------------------------------------------------------------
router.get('/popular', async (_req, res) => {
  const { data, error } = await supabase
    .from('blogs')
    .select(PUBLIC_COLUMNS)
    .eq('status', 'published')
    .eq('is_popular', true)
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) {
    console.error('[blog] Fetch popular posts failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not load popular posts.' });
  }

  return res.status(200).json({ ok: true, posts: data });
});

// ---------------------------------------------------------------------------
// GET /api/blog/:slug  — a single published post
// ---------------------------------------------------------------------------
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;

  const { data, error } = await supabase
    .from('blogs')
    .select(PUBLIC_COLUMNS)
    .eq('status', 'published')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('[blog] Fetch post failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not load this post.' });
  }

  if (!data) {
    return res.status(404).json({ ok: false, error: 'Post not found.' });
  }

  return res.status(200).json({ ok: true, post: data });
});

export default router;