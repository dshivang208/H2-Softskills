import { Router } from 'express';
import { supabase } from '../supabaseClient.js';
import { sendEnquiryEmail, sendAutoReplyEmail } from '../lib/mailer.js';

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ name, email, subject, message }) {
  const errors = {};
  if (!name?.trim()) errors.name = 'Name is required.';
  if (!email?.trim() || !EMAIL_RE.test(email.trim())) errors.email = 'A valid email is required.';
  if (!subject?.trim()) errors.subject = 'Subject is required.';
  if (!message?.trim()) errors.message = 'Message is required.';
  return errors;
}

// POST /api/contact
router.post('/', async (req, res) => {
  const name = String(req.body?.name ?? '').trim();
  const email = String(req.body?.email ?? '').trim();
  const subject = String(req.body?.subject ?? '').trim();
  const message = String(req.body?.message ?? '').trim();

  const errors = validate({ name, email, subject, message });
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ ok: false, errors });
  }

  // 1. Store the enquiry first — the database write must succeed regardless
  //    of whether either email later fails.
  const { data: enquiry, error: dbError } = await supabase
    .from('enquiries')
    .insert({ name, email, subject, message })
    .select()
    .single();

  if (dbError) {
    console.error('[contact] Supabase insert failed:', dbError.message);
    return res.status(500).json({ ok: false, error: 'Could not save your enquiry. Please try again.' });
  }

  // 2. Send the notification email (to you) and the auto-reply (to the
  //    person who filled the form). Each is independent — one failing
  //    doesn't block the other, and neither failing blocks the response,
  //    since the enquiry is already safely saved.
  const [notifyResult, autoReplyResult] = await Promise.allSettled([
    sendEnquiryEmail({ name, email, subject, message }),
    sendAutoReplyEmail({ name, email, subject }),
  ]);

  if (notifyResult.status === 'rejected') {
    console.error('[contact] Notification email failed:', notifyResult.reason?.message);
  }
  if (autoReplyResult.status === 'rejected') {
    console.error('[contact] Auto-reply email failed:', autoReplyResult.reason?.message);
  }

  const emailSent = notifyResult.status === 'fulfilled' && autoReplyResult.status === 'fulfilled';
  await supabase.from('enquiries').update({ email_sent: emailSent }).eq('id', enquiry.id);

  return res.status(201).json({ ok: true, id: enquiry.id });
});

export default router;