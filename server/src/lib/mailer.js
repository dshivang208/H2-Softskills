import { Resend } from 'resend';

const { RESEND_API_KEY, MAIL_FROM, MAIL_TO } = process.env;

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

function escapeHtml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Sends the enquiry notification email to the studio inbox (MAIL_TO),
 * with reply-to set to the enquirer so you can hit "reply" directly.
 */
export async function sendEnquiryEmail({ name, email, subject, message }) {
  if (!resend) {
    console.warn('[mailer] RESEND_API_KEY not set — skipping email send.');
    return { skipped: true };
  }

  const html = `
    <div style="font-family: sans-serif; font-size: 15px; color: #131b2e; line-height: 1.6;">
      <h2 style="margin-bottom: 4px;">New enquiry from ${escapeHtml(name)}</h2>
      <p style="color:#434654; margin-top:0;">via h2softskills.in contact form</p>
      <table style="border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding:4px 12px 4px 0; color:#434654;">Name</td><td>${escapeHtml(name)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0; color:#434654;">Email</td><td>${escapeHtml(email)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0; color:#434654;">Subject</td><td>${escapeHtml(subject)}</td></tr>
      </table>
      <p style="white-space: pre-wrap; background:#f2f3ff; padding:16px; border-radius:12px;">${escapeHtml(message)}</p>
    </div>
  `;

  const { data, error } = await resend.emails.send({
    from: MAIL_FROM,
    to: MAIL_TO,
    replyTo: email,
    subject: `New enquiry: ${subject}`,
    html,
  });

  // The Resend SDK resolves successfully even when the API rejects the
  // send (bad `from` domain, rate limit, invalid recipient, etc.) — it
  // reports the failure via this `error` field instead of throwing. If we
  // don't check it, callers using Promise.allSettled see a false
  // "fulfilled" and think the email went out when it didn't.
  if (error) {
    throw new Error(error.message || 'Resend rejected the enquiry email.');
  }
  return data;
}

/**
 * Sends an auto-reply to the person who submitted the form, confirming
 * receipt. Sent "from" MAIL_FROM (a Resend-verified sender) but with
 * Reply-To set to MAIL_TO, so if they hit reply it lands in your inbox —
 * you can't actually send "from" a gmail.com address you don't control
 * the DNS for, this is the standard equivalent.
 */
export async function sendAutoReplyEmail({ name, email, subject }) {
  if (!resend) {
    console.warn('[mailer] RESEND_API_KEY not set — skipping auto-reply send.');
    return { skipped: true };
  }

  const html = `
    <div style="font-family: sans-serif; font-size: 15px; color: #131b2e; line-height: 1.6;">
      <h2 style="margin-bottom: 4px;">Thanks for reaching out, ${escapeHtml(name)}!</h2>
      <p style="color:#434654;">
        We've received your enquiry — <strong>${escapeHtml(subject)}</strong> — and someone from
        the H2 Softskills team will get back to you shortly.
      </p>
      <p style="color:#434654;">If anything's urgent, just reply directly to this email.</p>
      <p style="margin-top: 24px; color:#131b2e;">— H2 Softskills</p>
    </div>
  `;

  const { data, error } = await resend.emails.send({
    from: MAIL_FROM,
    to: email,
    replyTo: MAIL_TO,
    subject: `We've received your message — ${subject}`,
    html,
  });

  if (error) {
    throw new Error(error.message || 'Resend rejected the auto-reply email.');
  }
  return data;
}

/**
 * Sends a newsletter broadcast to a single subscriber. Called once per
 * recipient (in small batches) from POST /api/admin/broadcast — Resend
 * doesn't get a "to" list here on purpose, so one subscriber can never see
 * another subscriber's email address in the "to" header.
 */
export async function sendBroadcastEmail({ to, subject, message }) {
  if (!resend) {
    console.warn('[mailer] RESEND_API_KEY not set — skipping broadcast send.');
    return { skipped: true };
  }

  // Plain-text messages get wrapped with line breaks preserved; if the
  // admin already wrote HTML themselves it still displays fine either way.
  const html = `
    <div style="font-family: sans-serif; font-size: 15px; color: #131b2e; line-height: 1.6;">
      <div style="white-space: pre-wrap;">${escapeHtml(message)}</div>
      <hr style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;" />
      <p style="color:#9aa0b4; font-size:12px;">
        You're receiving this because you subscribed to the H2 Softskills newsletter.
      </p>
    </div>
  `;

  const { data, error } = await resend.emails.send({
    from: MAIL_FROM,
    to,
    replyTo: MAIL_TO,
    subject,
    html,
  });

  // Same as the other send functions: Resend reports per-recipient
  // failures via `error`, not by rejecting the promise. Throwing here is
  // what makes Promise.allSettled in the /broadcast route correctly count
  // this recipient under failedCount instead of sentCount.
  if (error) {
    throw new Error(error.message || `Resend rejected the broadcast email to ${to}.`);
  }
  return data;
}