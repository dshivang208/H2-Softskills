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

  return resend.emails.send({
    from: MAIL_FROM,
    to: MAIL_TO,
    replyTo: email,
    subject: `New enquiry: ${subject}`,
    html,
  });
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

  return resend.emails.send({
    from: MAIL_FROM,
    to: email,
    replyTo: MAIL_TO,
    subject: `We've received your message — ${subject}`,
    html,
  });
}