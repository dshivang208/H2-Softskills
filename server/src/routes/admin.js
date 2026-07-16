import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { supabase } from '../supabaseClient.js';
import { sendBroadcastEmail } from '../lib/mailer.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

const { ADMIN_EMAIL, ADMIN_PASSWORD_HASH, JWT_SECRET } = process.env;

// ---------------------------------------------------------------------------
// POST /api/admin/login  (public)
// ---------------------------------------------------------------------------
router.post('/login', async (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  const password = String(req.body?.password ?? '');

  if (!email || !password) {
    return res.status(400).json({ ok: false, error: 'Email and password are required.' });
  }

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH || !JWT_SECRET) {
    console.error('[admin] Missing ADMIN_EMAIL / ADMIN_PASSWORD_HASH / JWT_SECRET in .env');
    return res.status(500).json({ ok: false, error: 'Admin login is not configured on the server.' });
  }

  const emailMatches = email === ADMIN_EMAIL.toLowerCase();
  const passwordMatches = emailMatches && (await bcrypt.compare(password, ADMIN_PASSWORD_HASH));

  if (!emailMatches || !passwordMatches) {
    return res.status(401).json({ ok: false, error: 'Invalid email or password.' });
  }

  const token = jwt.sign({ role: 'admin', email }, JWT_SECRET, { expiresIn: '12h' });
  return res.status(200).json({ ok: true, token });
});

// Everything below requires a valid admin token.
router.use(requireAdmin);

// ---------------------------------------------------------------------------
// GET /api/admin/subscribers  — list newsletter subscribers
// ---------------------------------------------------------------------------
router.get('/subscribers', async (req, res) => {
  const { data, error, count } = await supabase
    .from('subscribers')
    .select('id, email, status, source, created_at', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[admin] Fetch subscribers failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not load subscribers.' });
  }

  return res.status(200).json({ ok: true, subscribers: data, total: count ?? data.length });
});

// ---------------------------------------------------------------------------
// DELETE /api/admin/subscribers/:id  — remove a subscriber
// ---------------------------------------------------------------------------
router.delete('/subscribers/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from('subscribers').delete().eq('id', id);

  if (error) {
    console.error('[admin] Delete subscriber failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not delete subscriber.' });
  }

  return res.status(200).json({ ok: true });
});

// ---------------------------------------------------------------------------
// GET /api/admin/broadcasts  — history of past broadcasts
// ---------------------------------------------------------------------------
router.get('/broadcasts', async (_req, res) => {
  const { data, error } = await supabase
    .from('broadcasts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('[admin] Fetch broadcasts failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not load broadcast history.' });
  }

  return res.status(200).json({ ok: true, broadcasts: data });
});

// ---------------------------------------------------------------------------
// POST /api/admin/broadcast  — send an email to every active subscriber
// ---------------------------------------------------------------------------
router.post('/broadcast', async (req, res) => {
  const subject = String(req.body?.subject ?? '').trim();
  const message = String(req.body?.message ?? '').trim();

  if (!subject || !message) {
    return res.status(400).json({ ok: false, error: 'Subject and message are required.' });
  }

  const { data: subscribers, error: fetchError } = await supabase
    .from('subscribers')
    .select('email')
    .eq('status', 'active');

  if (fetchError) {
    console.error('[admin] Fetch active subscribers failed:', fetchError.message);
    return res.status(500).json({ ok: false, error: 'Could not load subscribers.' });
  }

  if (!subscribers || subscribers.length === 0) {
    return res.status(400).json({ ok: false, error: 'There are no active subscribers to send to.' });
  }

  // Send in small batches so we don't blow past Resend's rate limits.
  const BATCH_SIZE = 25;
  let sentCount = 0;
  let failedCount = 0;

  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(({ email }) => sendBroadcastEmail({ to: email, subject, message }))
    );
    results.forEach((result) => {
      if (result.status === 'fulfilled') sentCount += 1;
      else failedCount += 1;
    });
  }

  const { error: logError } = await supabase.from('broadcasts').insert({
    subject,
    message,
    recipient_count: subscribers.length,
    sent_count: sentCount,
    failed_count: failedCount,
  });

  if (logError) {
    console.error('[admin] Logging broadcast failed:', logError.message);
    // Not fatal — the emails already went out — so don't fail the request.
  }

  return res.status(200).json({
    ok: true,
    recipientCount: subscribers.length,
    sentCount,
    failedCount,
  });
});

export default router;