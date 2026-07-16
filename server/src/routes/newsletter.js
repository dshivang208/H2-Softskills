import { Router } from 'express';
import { supabase } from '../supabaseClient.js';

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/newsletter/subscribe
router.post('/subscribe', async (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase();

  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ ok: false, error: 'A valid email is required.' });
  }

  // If they already exist, treat re-subscribing as reactivation instead of
  // erroring out on the unique constraint.
  const { data: existing } = await supabase
    .from('subscribers')
    .select('id, status')
    .eq('email', email)
    .maybeSingle();

  if (existing) {
    if (existing.status === 'active') {
      return res.status(200).json({ ok: true, message: 'You are already subscribed.' });
    }
    const { error: updateError } = await supabase
      .from('subscribers')
      .update({ status: 'active', unsubscribed_at: null })
      .eq('id', existing.id);

    if (updateError) {
      console.error('[newsletter] Resubscribe failed:', updateError.message);
      return res.status(500).json({ ok: false, error: 'Could not subscribe you right now. Please try again.' });
    }
    return res.status(200).json({ ok: true, message: 'Welcome back! You are subscribed again.' });
  }

  const { error: insertError } = await supabase
    .from('subscribers')
    .insert({ email, source: 'blog' });

  if (insertError) {
    console.error('[newsletter] Insert failed:', insertError.message);
    return res.status(500).json({ ok: false, error: 'Could not subscribe you right now. Please try again.' });
  }

  return res.status(201).json({ ok: true, message: 'Subscribed! Welcome aboard.' });
});

// POST /api/newsletter/unsubscribe
router.post('/unsubscribe', async (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase();

  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ ok: false, error: 'A valid email is required.' });
  }

  const { error } = await supabase
    .from('subscribers')
    .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
    .eq('email', email);

  if (error) {
    console.error('[newsletter] Unsubscribe failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not unsubscribe you right now. Please try again.' });
  }

  return res.status(200).json({ ok: true, message: 'You have been unsubscribed.' });
});

export default router;