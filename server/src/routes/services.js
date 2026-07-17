import { Router } from 'express';
import { supabase } from '../supabaseClient.js';

const router = Router();

const PUBLIC_COLUMNS = 'id, title, tag, description, image_url, icon, stats, created_at';

// ---------------------------------------------------------------------------
// GET /api/services  — published admin-added services, oldest first so new
// ones append after the existing hardcoded cards on the Services page.
// ---------------------------------------------------------------------------
router.get('/', async (_req, res) => {
  const { data, error } = await supabase
    .from('services')
    .select(PUBLIC_COLUMNS)
    .eq('status', 'published')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[services] Fetch services failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not load services.' });
  }

  return res.status(200).json({ ok: true, services: data });
});

export default router;