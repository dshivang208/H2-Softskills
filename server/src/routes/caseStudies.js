import { Router } from 'express';
import { supabase } from '../supabaseClient.js';

const router = Router();

const PUBLIC_COLUMNS =
  'project_id, client_type, region, tech_stack, summary, challenges, solutions, process_steps, outcomes, pdf_url, created_at';

// ---------------------------------------------------------------------------
// GET /api/case-studies/:projectId  — a single published case study
// ---------------------------------------------------------------------------
router.get('/:projectId', async (req, res) => {
  const { projectId } = req.params;

  const { data, error } = await supabase
    .from('case_studies')
    .select(PUBLIC_COLUMNS)
    .eq('status', 'published')
    .eq('project_id', projectId)
    .maybeSingle();

  if (error) {
    console.error('[case-studies] Fetch case study failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not load this case study.' });
  }

  if (!data) {
    return res.status(404).json({ ok: false, error: 'No case study published for this project yet.' });
  }

  return res.status(200).json({ ok: true, caseStudy: data });
});

export default router;