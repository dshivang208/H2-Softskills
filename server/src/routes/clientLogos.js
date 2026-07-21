import { Router } from 'express';
import { supabase } from '../supabaseClient.js';

const router = Router();

const PUBLIC_COLUMNS = 'id, name, logo_url, website_url, created_at';

// ---------------------------------------------------------------------------
// GET /api/client-logos  — every published logo, admin's chosen order
// ---------------------------------------------------------------------------
router.get('/', async (_req, res) => {
  const { data, error } = await supabase
    .from('client_logos')
    .select(PUBLIC_COLUMNS)
    .eq('status', 'published')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[client-logos] Fetch client logos failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not load client logos.' });
  }

  return res.status(200).json({ ok: true, logos: data });
});

export default router;