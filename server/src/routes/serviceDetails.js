import { Router } from 'express';
import { supabase } from '../supabaseClient.js';

const router = Router();

const PUBLIC_COLUMNS =
  'service_id, intro, capabilities, outcomes, deliverables, ideal_fit, faqs, created_at';

// ---------------------------------------------------------------------------
// GET /api/service-details/:serviceId  — a single published service detail page
// ---------------------------------------------------------------------------
router.get('/:serviceId', async (req, res) => {
  const { serviceId } = req.params;

  const { data, error } = await supabase
    .from('service_details')
    .select(PUBLIC_COLUMNS)
    .eq('status', 'published')
    .eq('service_id', serviceId)
    .maybeSingle();

  if (error) {
    console.error('[service-details] Fetch service detail failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not load this service.' });
  }

  if (!data) {
    return res.status(404).json({ ok: false, error: 'No details published for this service yet.' });
  }

  return res.status(200).json({ ok: true, serviceDetail: data });
});

export default router;