import { Router } from 'express';
import { supabase } from '../supabaseClient.js';

const router = Router();

const PUBLIC_COLUMNS = 'id, title, tag, accent, description, image_url, display_order, created_at';

// ---------------------------------------------------------------------------
// GET /api/projects  — every published project, admin's chosen order
// ---------------------------------------------------------------------------
router.get('/', async (_req, res) => {
  const { data, error } = await supabase
    .from('projects')
    .select(PUBLIC_COLUMNS)
    .eq('status', 'published')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[projects] Fetch projects failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not load projects.' });
  }

  return res.status(200).json({ ok: true, projects: data });
});

export default router;