import { Router } from 'express';
import { supabase } from '../supabaseClient.js';

const router = Router();

const PUBLIC_COLUMNS = 'id, name, role, quote, avatar_url, rating, created_at';

// ---------------------------------------------------------------------------
// GET /api/testimonials  — every published testimonial, admin's chosen order
// ---------------------------------------------------------------------------
router.get('/', async (_req, res) => {
  const { data, error } = await supabase
    .from('client_testimonials')
    .select(PUBLIC_COLUMNS)
    .eq('status', 'published')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[testimonials] Fetch testimonials failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not load testimonials.' });
  }

  return res.status(200).json({ ok: true, testimonials: data });
});

export default router;