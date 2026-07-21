import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { supabase } from '../supabaseClient.js';
import { sendBroadcastEmail } from '../lib/mailer.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

const { ADMIN_EMAIL, ADMIN_PASSWORD_HASH, JWT_SECRET } = process.env;

// Used only by the case-study report upload route below. Files are kept in
// memory (never written to disk) and streamed straight to Supabase Storage.
const reportUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB, matches the bucket's file_size_limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed.'));
    }
    return cb(null, true);
  },
});

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

// ---------------------------------------------------------------------------
// Blog management
// ---------------------------------------------------------------------------

const ADMIN_BLOG_COLUMNS =
  'id, title, slug, excerpt, content, category, image_url, author, read_time, status, is_popular, created_at, updated_at';

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

// Appends -2, -3, ... to a slug until it's unique. `excludeId` lets an
// update keep its own existing slug without colliding with itself.
async function uniqueSlug(baseSlug, excludeId) {
  let candidate = baseSlug || 'post';
  let suffix = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    let query = supabase.from('blogs').select('id').eq('slug', candidate).limit(1);
    if (excludeId) query = query.neq('id', excludeId);
    const { data, error } = await query;

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) return candidate;

    suffix += 1;
    candidate = `${baseSlug}-${suffix}`;
  }
}

// ---------------------------------------------------------------------------
// GET /api/admin/blogs  — every post, any status (draft + published)
// ---------------------------------------------------------------------------
router.get('/blogs', async (_req, res) => {
  const { data, error } = await supabase
    .from('blogs')
    .select(ADMIN_BLOG_COLUMNS)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[admin] Fetch blogs failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not load blog posts.' });
  }

  return res.status(200).json({ ok: true, posts: data });
});

// ---------------------------------------------------------------------------
// GET /api/admin/blogs/:id  — single post for the edit form
// ---------------------------------------------------------------------------
router.get('/blogs/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('blogs')
    .select(ADMIN_BLOG_COLUMNS)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('[admin] Fetch blog failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not load this post.' });
  }

  if (!data) {
    return res.status(404).json({ ok: false, error: 'Post not found.' });
  }

  return res.status(200).json({ ok: true, post: data });
});

// ---------------------------------------------------------------------------
// POST /api/admin/blogs  — create a post
// ---------------------------------------------------------------------------
router.post('/blogs', async (req, res) => {
  const title = String(req.body?.title ?? '').trim();
  const excerpt = String(req.body?.excerpt ?? '').trim();
  const content = String(req.body?.content ?? '').trim();
  const category = String(req.body?.category ?? '').trim() || 'Web Development';
  const imageUrl = String(req.body?.image_url ?? '').trim() || null;
  const author = String(req.body?.author ?? '').trim() || 'H2 Softskills Team';
  const readTime = String(req.body?.read_time ?? '').trim() || '5 min read';
  const status = req.body?.status === 'published' ? 'published' : 'draft';
  const isPopular = Boolean(req.body?.is_popular);
  const requestedSlug = String(req.body?.slug ?? '').trim();

  if (!title || !excerpt || !content) {
    return res.status(400).json({ ok: false, error: 'Title, excerpt, and content are required.' });
  }

  try {
    const baseSlug = slugify(requestedSlug || title);
    const slug = await uniqueSlug(baseSlug);

    const { data, error } = await supabase
      .from('blogs')
      .insert({
        title,
        slug,
        excerpt,
        content,
        category,
        image_url: imageUrl,
        author,
        read_time: readTime,
        status,
        is_popular: isPopular,
      })
      .select(ADMIN_BLOG_COLUMNS)
      .single();

    if (error) throw new Error(error.message);

    return res.status(201).json({ ok: true, post: data });
  } catch (err) {
    console.error('[admin] Create blog failed:', err.message);
    return res.status(500).json({ ok: false, error: 'Could not create this post.' });
  }
});

// ---------------------------------------------------------------------------
// PUT /api/admin/blogs/:id  — update a post
// ---------------------------------------------------------------------------
router.put('/blogs/:id', async (req, res) => {
  const { id } = req.params;

  const title = String(req.body?.title ?? '').trim();
  const excerpt = String(req.body?.excerpt ?? '').trim();
  const content = String(req.body?.content ?? '').trim();
  const category = String(req.body?.category ?? '').trim() || 'Web Development';
  const imageUrl = String(req.body?.image_url ?? '').trim() || null;
  const author = String(req.body?.author ?? '').trim() || 'H2 Softskills Team';
  const readTime = String(req.body?.read_time ?? '').trim() || '5 min read';
  const status = req.body?.status === 'published' ? 'published' : 'draft';
  const isPopular = Boolean(req.body?.is_popular);
  const requestedSlug = String(req.body?.slug ?? '').trim();

  if (!title || !excerpt || !content) {
    return res.status(400).json({ ok: false, error: 'Title, excerpt, and content are required.' });
  }

  try {
    const baseSlug = slugify(requestedSlug || title);
    const slug = await uniqueSlug(baseSlug, id);

    const { data, error } = await supabase
      .from('blogs')
      .update({
        title,
        slug,
        excerpt,
        content,
        category,
        image_url: imageUrl,
        author,
        read_time: readTime,
        status,
        is_popular: isPopular,
      })
      .eq('id', id)
      .select(ADMIN_BLOG_COLUMNS)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) {
      return res.status(404).json({ ok: false, error: 'Post not found.' });
    }

    return res.status(200).json({ ok: true, post: data });
  } catch (err) {
    console.error('[admin] Update blog failed:', err.message);
    return res.status(500).json({ ok: false, error: 'Could not update this post.' });
  }
});

// ---------------------------------------------------------------------------
// DELETE /api/admin/blogs/:id  — remove a post
// ---------------------------------------------------------------------------
router.delete('/blogs/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from('blogs').delete().eq('id', id);

  if (error) {
    console.error('[admin] Delete blog failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not delete this post.' });
  }

  return res.status(200).json({ ok: true });
});

// ---------------------------------------------------------------------------
// Services management
//
// These are ADDITIONAL services shown on the public /services page. They
// are stored separately from — and never overwrite — the hardcoded services
// array in src/components/Services.jsx, which keeps powering the Home page
// carousel and the original Services page cards.
// ---------------------------------------------------------------------------

const ADMIN_SERVICE_COLUMNS =
  'id, title, tag, description, image_url, icon, stats, status, created_at, updated_at';

function normalizeStats(rawStats) {
  if (!Array.isArray(rawStats)) return [];
  return rawStats
    .filter((s) => s && String(s.label || '').trim() && String(s.value || '').trim())
    .slice(0, 3)
    .map((s) => ({
      label: String(s.label).trim(),
      value: String(s.value).trim(),
      ...(s.highlight ? { highlight: String(s.highlight).trim() } : {}),
    }));
}

// ---------------------------------------------------------------------------
// GET /api/admin/services  — every service, any status (draft + published)
// ---------------------------------------------------------------------------
router.get('/services', async (_req, res) => {
  const { data, error } = await supabase
    .from('services')
    .select(ADMIN_SERVICE_COLUMNS)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[admin] Fetch services failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not load services.' });
  }

  return res.status(200).json({ ok: true, services: data });
});

// ---------------------------------------------------------------------------
// GET /api/admin/services/:id  — single service for the edit form
// ---------------------------------------------------------------------------
router.get('/services/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('services')
    .select(ADMIN_SERVICE_COLUMNS)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('[admin] Fetch service failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not load this service.' });
  }

  if (!data) {
    return res.status(404).json({ ok: false, error: 'Service not found.' });
  }

  return res.status(200).json({ ok: true, service: data });
});

// ---------------------------------------------------------------------------
// POST /api/admin/services  — create a service
// ---------------------------------------------------------------------------
router.post('/services', async (req, res) => {
  const title = String(req.body?.title ?? '').trim();
  const tag = String(req.body?.tag ?? '').trim();
  const description = String(req.body?.description ?? '').trim();
  const imageUrl = String(req.body?.image_url ?? '').trim() || null;
  const icon = String(req.body?.icon ?? '').trim() || 'Code2';
  const status = req.body?.status === 'published' ? 'published' : 'draft';
  const stats = normalizeStats(req.body?.stats);

  if (!title || !description) {
    return res.status(400).json({ ok: false, error: 'Title and description are required.' });
  }

  const { data, error } = await supabase
    .from('services')
    .insert({
      title,
      tag,
      description,
      image_url: imageUrl,
      icon,
      stats,
      status,
    })
    .select(ADMIN_SERVICE_COLUMNS)
    .single();

  if (error) {
    console.error('[admin] Create service failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not create this service.' });
  }

  return res.status(201).json({ ok: true, service: data });
});

// ---------------------------------------------------------------------------
// PUT /api/admin/services/:id  — update a service
// ---------------------------------------------------------------------------
router.put('/services/:id', async (req, res) => {
  const { id } = req.params;

  const title = String(req.body?.title ?? '').trim();
  const tag = String(req.body?.tag ?? '').trim();
  const description = String(req.body?.description ?? '').trim();
  const imageUrl = String(req.body?.image_url ?? '').trim() || null;
  const icon = String(req.body?.icon ?? '').trim() || 'Code2';
  const status = req.body?.status === 'published' ? 'published' : 'draft';
  const stats = normalizeStats(req.body?.stats);

  if (!title || !description) {
    return res.status(400).json({ ok: false, error: 'Title and description are required.' });
  }

  const { data, error } = await supabase
    .from('services')
    .update({
      title,
      tag,
      description,
      image_url: imageUrl,
      icon,
      stats,
      status,
    })
    .eq('id', id)
    .select(ADMIN_SERVICE_COLUMNS)
    .maybeSingle();

  if (error) {
    console.error('[admin] Update service failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not update this service.' });
  }

  if (!data) {
    return res.status(404).json({ ok: false, error: 'Service not found.' });
  }

  return res.status(200).json({ ok: true, service: data });
});

// ---------------------------------------------------------------------------
// DELETE /api/admin/services/:id  — remove a service
// ---------------------------------------------------------------------------
router.delete('/services/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from('services').delete().eq('id', id);

  if (error) {
    console.error('[admin] Delete service failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not delete this service.' });
  }

  return res.status(200).json({ ok: true });
});

// ---------------------------------------------------------------------------
// Case study management
//
// Each case study is linked to an EXISTING project card via `project_id`
// (matching an id in the static `projects` array in
// src/components/FeaturedProjects.jsx). This never creates, edits, or
// deletes a project card itself — it only stores the extra case-study
// content shown on that project's /projects/:projectId/case-study page.
// ---------------------------------------------------------------------------

const ADMIN_CASE_STUDY_COLUMNS =
  'id, project_id, client_type, region, tech_stack, summary, challenges, solutions, process_steps, outcomes, pdf_url, status, created_at, updated_at';

function normalizeTitledList(rawList, maxItems) {
  if (!Array.isArray(rawList)) return [];
  return rawList
    .filter((item) => item && String(item.title || '').trim() && String(item.description || '').trim())
    .slice(0, maxItems)
    .map((item) => ({
      title: String(item.title).trim(),
      description: String(item.description).trim(),
    }));
}

function normalizeStepList(rawList, maxItems) {
  if (!Array.isArray(rawList)) return [];
  return rawList
    .map((step) => String(step || '').trim())
    .filter(Boolean)
    .slice(0, maxItems);
}

// ---------------------------------------------------------------------------
// GET /api/admin/case-studies  — every case study, any status
// ---------------------------------------------------------------------------
router.get('/case-studies', async (_req, res) => {
  const { data, error } = await supabase
    .from('case_studies')
    .select(ADMIN_CASE_STUDY_COLUMNS)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('[admin] Fetch case studies failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not load case studies.' });
  }

  return res.status(200).json({ ok: true, caseStudies: data });
});

// ---------------------------------------------------------------------------
// GET /api/admin/case-studies/:projectId  — single case study for the edit form
// ---------------------------------------------------------------------------
router.get('/case-studies/:projectId', async (req, res) => {
  const { projectId } = req.params;

  const { data, error } = await supabase
    .from('case_studies')
    .select(ADMIN_CASE_STUDY_COLUMNS)
    .eq('project_id', projectId)
    .maybeSingle();

  if (error) {
    console.error('[admin] Fetch case study failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not load this case study.' });
  }

  // Not found is a normal state here (case study not written yet) — the
  // admin form just starts blank, so return 200 with a null caseStudy
  // instead of a 404.
  return res.status(200).json({ ok: true, caseStudy: data || null });
});

// ---------------------------------------------------------------------------
// PUT /api/admin/case-studies/:projectId  — create or update (upsert) a
// case study for an existing project card.
// ---------------------------------------------------------------------------
router.put('/case-studies/:projectId', async (req, res) => {
  const { projectId } = req.params;

  const clientType = String(req.body?.client_type ?? '').trim();
  const region = String(req.body?.region ?? '').trim();
  const techStack = String(req.body?.tech_stack ?? '').trim();
  const summary = String(req.body?.summary ?? '').trim();
  const pdfUrl = String(req.body?.pdf_url ?? '').trim() || null;
  const status = req.body?.status === 'published' ? 'published' : 'draft';
  const challenges = normalizeTitledList(req.body?.challenges, 4);
  const solutions = normalizeTitledList(req.body?.solutions, 6);
  const outcomes = normalizeTitledList(req.body?.outcomes, 4);
  const processSteps = normalizeStepList(req.body?.process_steps, 8);

  if (!projectId) {
    return res.status(400).json({ ok: false, error: 'A project is required.' });
  }
  if (!summary) {
    return res.status(400).json({ ok: false, error: 'A summary is required.' });
  }

  const { data, error } = await supabase
    .from('case_studies')
    .upsert(
      {
        project_id: projectId,
        client_type: clientType,
        region,
        tech_stack: techStack,
        summary,
        challenges,
        solutions,
        process_steps: processSteps,
        outcomes,
        pdf_url: pdfUrl,
        status,
      },
      { onConflict: 'project_id' }
    )
    .select(ADMIN_CASE_STUDY_COLUMNS)
    .single();

  if (error) {
    console.error('[admin] Save case study failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not save this case study.' });
  }

  return res.status(200).json({ ok: true, caseStudy: data });
});

// ---------------------------------------------------------------------------
// DELETE /api/admin/case-studies/:projectId  — remove a case study (the
// project card itself is unaffected; it just goes back to having no
// published case study).
// ---------------------------------------------------------------------------
router.delete('/case-studies/:projectId', async (req, res) => {
  const { projectId } = req.params;

  const { error } = await supabase.from('case_studies').delete().eq('project_id', projectId);

  if (error) {
    console.error('[admin] Delete case study failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not delete this case study.' });
  }

  return res.status(200).json({ ok: true });
});

// ---------------------------------------------------------------------------
// POST /api/admin/case-studies/:projectId/report  — upload/replace the PDF
// for a project's case study. Stored in the "case-study-reports" Storage
// bucket as `${projectId}.pdf`, so re-uploading always overwrites the same
// file and the public URL never changes.
// ---------------------------------------------------------------------------
router.post('/case-studies/:projectId/report', (req, res) => {
  reportUpload.single('file')(req, res, async (uploadErr) => {
    if (uploadErr) {
      const message =
        uploadErr.code === 'LIMIT_FILE_SIZE'
          ? 'That PDF is too large (20 MB max).'
          : uploadErr.message || 'Could not process the uploaded file.';
      return res.status(400).json({ ok: false, error: message });
    }

    const { projectId } = req.params;

    if (!req.file) {
      return res.status(400).json({ ok: false, error: 'No PDF file was uploaded.' });
    }

    // Everything below can throw unexpectedly (a Supabase network hiccup,
    // a malformed response, etc). Without this try/catch, an error here
    // becomes an unhandled rejection — which can crash the whole Node
    // process on some Node versions, killing every other in-flight
    // request too (this is what "Failed to fetch" on an otherwise-correct
    // upload usually means).
    try {
      const path = `${projectId}.pdf`;

      const { error: uploadError } = await supabase.storage
        .from('case-study-reports')
        .upload(path, req.file.buffer, {
          contentType: 'application/pdf',
          upsert: true,
        });

      if (uploadError) {
        console.error('[admin] Upload case study report failed:', uploadError.message);
        return res.status(500).json({ ok: false, error: 'Could not upload this PDF.' });
      }

      const { data: publicUrlData } = supabase.storage
        .from('case-study-reports')
        .getPublicUrl(path);

      // Bust any cached copy of the previous file at the same URL — public
      // storage URLs are otherwise indistinguishable across re-uploads.
      const url = `${publicUrlData.publicUrl}?v=${Date.now()}`;

      // Keep the case_studies row in sync so the URL shows up next time the
      // admin form loads, and so the public case-study page can use it too.
      const { error: dbError } = await supabase
        .from('case_studies')
        .update({ pdf_url: url })
        .eq('project_id', projectId);

      if (dbError) {
        // The file itself uploaded fine — don't fail the request just
        // because there's no case_studies row yet (e.g. it hasn't been
        // saved once already). The admin form will still store the URL on
        // its next Save/Publish.
        console.warn('[admin] Uploaded report but could not update case_studies row:', dbError.message);
      }

      return res.status(200).json({ ok: true, url });
    } catch (err) {
      console.error('[admin] Unexpected error uploading case study report:', err);
      if (!res.headersSent) {
        return res.status(500).json({ ok: false, error: 'Unexpected server error while uploading the PDF. Please try again.' });
      }
    }
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/admin/case-studies/:projectId/report  — remove the uploaded
// PDF from Storage and clear pdf_url on the case study row.
// ---------------------------------------------------------------------------
router.delete('/case-studies/:projectId/report', async (req, res) => {
  const { projectId } = req.params;
  const path = `${projectId}.pdf`;

  const { error: removeError } = await supabase.storage.from('case-study-reports').remove([path]);

  if (removeError) {
    console.error('[admin] Delete case study report failed:', removeError.message);
    return res.status(500).json({ ok: false, error: 'Could not delete this PDF.' });
  }

  const { error: dbError } = await supabase
    .from('case_studies')
    .update({ pdf_url: null })
    .eq('project_id', projectId);

  if (dbError) {
    console.warn('[admin] Removed report but could not clear pdf_url:', dbError.message);
  }

  return res.status(200).json({ ok: true });
});

// ---------------------------------------------------------------------------
// Service detail page management
//
// Each service detail row is linked to an EXISTING service card via
// `service_id` (matching an id in the static `services` array in
// src/components/Services.jsx, or the uuid id of an admin-added service
// from the `services` table). This never creates, edits, or deletes a
// service card itself — it only stores the extra content shown on that
// service's /services/:serviceId detail page.
// ---------------------------------------------------------------------------

const ADMIN_SERVICE_DETAIL_COLUMNS =
  'id, service_id, intro, capabilities, outcomes, deliverables, ideal_fit, faqs, status, created_at, updated_at';

function normalizeStringList(rawList, maxItems) {
  if (!Array.isArray(rawList)) return [];
  return rawList
    .map((item) => String(item || '').trim())
    .filter(Boolean)
    .slice(0, maxItems);
}

function normalizeFaqList(rawList, maxItems) {
  if (!Array.isArray(rawList)) return [];
  return rawList
    .filter((item) => item && String(item.question || '').trim() && String(item.answer || '').trim())
    .slice(0, maxItems)
    .map((item) => ({
      question: String(item.question).trim(),
      answer: String(item.answer).trim(),
    }));
}

// ---------------------------------------------------------------------------
// GET /api/admin/service-details  — every service detail row, any status
// ---------------------------------------------------------------------------
router.get('/service-details', async (_req, res) => {
  const { data, error } = await supabase
    .from('service_details')
    .select(ADMIN_SERVICE_DETAIL_COLUMNS)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('[admin] Fetch service details failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not load service details.' });
  }

  return res.status(200).json({ ok: true, serviceDetails: data });
});

// ---------------------------------------------------------------------------
// GET /api/admin/service-details/:serviceId  — single detail row for the edit form
// ---------------------------------------------------------------------------
router.get('/service-details/:serviceId', async (req, res) => {
  const { serviceId } = req.params;

  const { data, error } = await supabase
    .from('service_details')
    .select(ADMIN_SERVICE_DETAIL_COLUMNS)
    .eq('service_id', serviceId)
    .maybeSingle();

  if (error) {
    console.error('[admin] Fetch service detail failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not load this service.' });
  }

  // Not found is a normal state here (detail page not written yet) — the
  // admin form just starts blank, so return 200 with a null serviceDetail
  // instead of a 404.
  return res.status(200).json({ ok: true, serviceDetail: data || null });
});

// ---------------------------------------------------------------------------
// PUT /api/admin/service-details/:serviceId  — create or update (upsert) the
// detail-page content for an existing service card.
// ---------------------------------------------------------------------------
router.put('/service-details/:serviceId', async (req, res) => {
  const { serviceId } = req.params;

  const intro = String(req.body?.intro ?? '').trim();
  const status = req.body?.status === 'published' ? 'published' : 'draft';
  const capabilities = normalizeStringList(req.body?.capabilities, 8);
  const outcomes = normalizeStringList(req.body?.outcomes, 6);
  const deliverables = normalizeStringList(req.body?.deliverables, 8);
  const idealFit = normalizeStringList(req.body?.ideal_fit, 6);
  const faqs = normalizeFaqList(req.body?.faqs, 8);

  if (!serviceId) {
    return res.status(400).json({ ok: false, error: 'A service is required.' });
  }

  const { data, error } = await supabase
    .from('service_details')
    .upsert(
      {
        service_id: serviceId,
        intro,
        capabilities,
        outcomes,
        deliverables,
        ideal_fit: idealFit,
        faqs,
        status,
      },
      { onConflict: 'service_id' }
    )
    .select(ADMIN_SERVICE_DETAIL_COLUMNS)
    .single();

  if (error) {
    console.error('[admin] Save service detail failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not save this service detail page.' });
  }

  return res.status(200).json({ ok: true, serviceDetail: data });
});

// ---------------------------------------------------------------------------
// DELETE /api/admin/service-details/:serviceId  — remove the detail content
// (the service card itself is unaffected; it just goes back to having no
// published detail page).
// ---------------------------------------------------------------------------
router.delete('/service-details/:serviceId', async (req, res) => {
  const { serviceId } = req.params;

  const { error } = await supabase.from('service_details').delete().eq('service_id', serviceId);

  if (error) {
    console.error('[admin] Delete service detail failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not delete this service detail page.' });
  }

  return res.status(200).json({ ok: true });
});

// ---------------------------------------------------------------------------
// Client testimonials management
//
// Feeds the ADDITIONAL "What Our Clients Say" section on the Home page.
// Fully separate from the 3 hardcoded cards in src/components/Testimonials.jsx
// — this never touches those.
// ---------------------------------------------------------------------------

const ADMIN_TESTIMONIAL_COLUMNS =
  'id, name, role, quote, avatar_url, rating, display_order, status, created_at, updated_at';

function normalizeRating(raw) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return 5;
  return Math.min(5, Math.max(1, Math.round(n)));
}

function normalizeOrder(raw) {
  const n = Number(raw);
  return Number.isFinite(n) ? Math.round(n) : 0;
}

// ---------------------------------------------------------------------------
// GET /api/admin/testimonials  — every testimonial, any status
// ---------------------------------------------------------------------------
router.get('/testimonials', async (_req, res) => {
  const { data, error } = await supabase
    .from('client_testimonials')
    .select(ADMIN_TESTIMONIAL_COLUMNS)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[admin] Fetch testimonials failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not load testimonials.' });
  }

  return res.status(200).json({ ok: true, testimonials: data });
});

// ---------------------------------------------------------------------------
// GET /api/admin/testimonials/:id  — single testimonial for the edit form
// ---------------------------------------------------------------------------
router.get('/testimonials/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('client_testimonials')
    .select(ADMIN_TESTIMONIAL_COLUMNS)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('[admin] Fetch testimonial failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not load this testimonial.' });
  }

  if (!data) {
    return res.status(404).json({ ok: false, error: 'Testimonial not found.' });
  }

  return res.status(200).json({ ok: true, testimonial: data });
});

// ---------------------------------------------------------------------------
// POST /api/admin/testimonials  — create a testimonial
// ---------------------------------------------------------------------------
router.post('/testimonials', async (req, res) => {
  const name = String(req.body?.name ?? '').trim();
  const role = String(req.body?.role ?? '').trim();
  const quote = String(req.body?.quote ?? '').trim();
  const avatarUrl = String(req.body?.avatar_url ?? '').trim() || null;
  const rating = normalizeRating(req.body?.rating);
  const displayOrder = normalizeOrder(req.body?.display_order);
  const status = req.body?.status === 'published' ? 'published' : 'draft';

  if (!name || !quote) {
    return res.status(400).json({ ok: false, error: 'Name and quote are required.' });
  }

  const { data, error } = await supabase
    .from('client_testimonials')
    .insert({
      name,
      role,
      quote,
      avatar_url: avatarUrl,
      rating,
      display_order: displayOrder,
      status,
    })
    .select(ADMIN_TESTIMONIAL_COLUMNS)
    .single();

  if (error) {
    console.error('[admin] Create testimonial failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not create this testimonial.' });
  }

  return res.status(201).json({ ok: true, testimonial: data });
});

// ---------------------------------------------------------------------------
// PUT /api/admin/testimonials/:id  — update a testimonial
// ---------------------------------------------------------------------------
router.put('/testimonials/:id', async (req, res) => {
  const { id } = req.params;

  const name = String(req.body?.name ?? '').trim();
  const role = String(req.body?.role ?? '').trim();
  const quote = String(req.body?.quote ?? '').trim();
  const avatarUrl = String(req.body?.avatar_url ?? '').trim() || null;
  const rating = normalizeRating(req.body?.rating);
  const displayOrder = normalizeOrder(req.body?.display_order);
  const status = req.body?.status === 'published' ? 'published' : 'draft';

  if (!name || !quote) {
    return res.status(400).json({ ok: false, error: 'Name and quote are required.' });
  }

  const { data, error } = await supabase
    .from('client_testimonials')
    .update({
      name,
      role,
      quote,
      avatar_url: avatarUrl,
      rating,
      display_order: displayOrder,
      status,
    })
    .eq('id', id)
    .select(ADMIN_TESTIMONIAL_COLUMNS)
    .maybeSingle();

  if (error) {
    console.error('[admin] Update testimonial failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not update this testimonial.' });
  }

  if (!data) {
    return res.status(404).json({ ok: false, error: 'Testimonial not found.' });
  }

  return res.status(200).json({ ok: true, testimonial: data });
});

// ---------------------------------------------------------------------------
// DELETE /api/admin/testimonials/:id  — remove a testimonial
// ---------------------------------------------------------------------------
router.delete('/testimonials/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from('client_testimonials').delete().eq('id', id);

  if (error) {
    console.error('[admin] Delete testimonial failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not delete this testimonial.' });
  }

  return res.status(200).json({ ok: true });
});

// ---------------------------------------------------------------------------
// Client logos management
//
// Adds EXTRA logos to the "Our Clients" marquee on the Home page, on top of
// the hardcoded ones in src/components/Clients.jsx (Polygon, Binance, AWS,
// etc). This never touches those — the admin can only add/edit/remove the
// logos stored here.
// ---------------------------------------------------------------------------

const ADMIN_CLIENT_LOGO_COLUMNS =
  'id, name, logo_url, website_url, display_order, status, created_at, updated_at';

// ---------------------------------------------------------------------------
// GET /api/admin/client-logos  — every logo, any status
// ---------------------------------------------------------------------------
router.get('/client-logos', async (_req, res) => {
  const { data, error } = await supabase
    .from('client_logos')
    .select(ADMIN_CLIENT_LOGO_COLUMNS)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[admin] Fetch client logos failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not load client logos.' });
  }

  return res.status(200).json({ ok: true, logos: data });
});

// ---------------------------------------------------------------------------
// GET /api/admin/client-logos/:id  — single logo for the edit form
// ---------------------------------------------------------------------------
router.get('/client-logos/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('client_logos')
    .select(ADMIN_CLIENT_LOGO_COLUMNS)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('[admin] Fetch client logo failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not load this logo.' });
  }

  if (!data) {
    return res.status(404).json({ ok: false, error: 'Logo not found.' });
  }

  return res.status(200).json({ ok: true, logo: data });
});

// ---------------------------------------------------------------------------
// POST /api/admin/client-logos  — add a logo
// ---------------------------------------------------------------------------
router.post('/client-logos', async (req, res) => {
  const name = String(req.body?.name ?? '').trim();
  const logoUrl = String(req.body?.logo_url ?? '').trim();
  const websiteUrl = String(req.body?.website_url ?? '').trim() || null;
  const displayOrder = normalizeOrder(req.body?.display_order);
  const status = req.body?.status === 'published' ? 'published' : 'draft';

  if (!name || !logoUrl) {
    return res.status(400).json({ ok: false, error: 'Name and logo URL are required.' });
  }

  const { data, error } = await supabase
    .from('client_logos')
    .insert({
      name,
      logo_url: logoUrl,
      website_url: websiteUrl,
      display_order: displayOrder,
      status,
    })
    .select(ADMIN_CLIENT_LOGO_COLUMNS)
    .single();

  if (error) {
    console.error('[admin] Create client logo failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not add this logo.' });
  }

  return res.status(201).json({ ok: true, logo: data });
});

// ---------------------------------------------------------------------------
// PUT /api/admin/client-logos/:id  — update a logo
// ---------------------------------------------------------------------------
router.put('/client-logos/:id', async (req, res) => {
  const { id } = req.params;

  const name = String(req.body?.name ?? '').trim();
  const logoUrl = String(req.body?.logo_url ?? '').trim();
  const websiteUrl = String(req.body?.website_url ?? '').trim() || null;
  const displayOrder = normalizeOrder(req.body?.display_order);
  const status = req.body?.status === 'published' ? 'published' : 'draft';

  if (!name || !logoUrl) {
    return res.status(400).json({ ok: false, error: 'Name and logo URL are required.' });
  }

  const { data, error } = await supabase
    .from('client_logos')
    .update({
      name,
      logo_url: logoUrl,
      website_url: websiteUrl,
      display_order: displayOrder,
      status,
    })
    .eq('id', id)
    .select(ADMIN_CLIENT_LOGO_COLUMNS)
    .maybeSingle();

  if (error) {
    console.error('[admin] Update client logo failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not update this logo.' });
  }

  if (!data) {
    return res.status(404).json({ ok: false, error: 'Logo not found.' });
  }

  return res.status(200).json({ ok: true, logo: data });
});

// ---------------------------------------------------------------------------
// DELETE /api/admin/client-logos/:id  — remove a logo
// ---------------------------------------------------------------------------
router.delete('/client-logos/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from('client_logos').delete().eq('id', id);

  if (error) {
    console.error('[admin] Delete client logo failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not delete this logo.' });
  }

  return res.status(200).json({ ok: true });
});

export default router;