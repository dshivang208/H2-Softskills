import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import contactRouter from './src/routes/contact.js';
import newsletterRouter from './src/routes/newsletter.js';
import adminRouter from './src/routes/admin.js';
import blogRouter from './src/routes/blog.js';
import servicesRouter from './src/routes/services.js';
import projectsRouter from './src/routes/projects.js';
import caseStudiesRouter from './src/routes/caseStudies.js';
import serviceDetailsRouter from './src/routes/serviceDetails.js';
import clientTestimonialsRouter from './src/routes/clientTestimonials.js';
import clientLogosRouter from './src/routes/clientLogos.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Safety net: without these, ANY unexpected/unhandled error anywhere in the
// app (a stray thrown exception, an unawaited rejected promise) can crash
// the entire Node process on modern Node versions — killing every other
// in-flight request too. Render then restarts the server, and any request
// caught in that restart window fails from the browser's side as a plain
// "Failed to fetch", with nothing useful in the logs pointing at the real
// cause. Logging and surviving instead makes real bugs visible without
// taking the whole server down over one bad request.
process.on('unhandledRejection', (reason) => {
  console.error('[server] Unhandled promise rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[server] Uncaught exception:', err);
});

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  })
);

// Basic abuse protection on the public contact endpoint.
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Too many requests. Please try again later.' },
});

// Same idea for the public newsletter signup endpoint.
const newsletterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Too many requests. Please try again later.' },
});

// Tighter limit on admin login attempts to slow down brute-forcing.
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Too many login attempts. Please try again later.' },
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/contact', contactLimiter, contactRouter);
app.use('/api/newsletter', newsletterLimiter, newsletterRouter);
app.use('/api/blog', blogRouter);
app.use('/api/services', servicesRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/case-studies', caseStudiesRouter);
app.use('/api/service-details', serviceDetailsRouter);
app.use('/api/testimonials', clientTestimonialsRouter);
app.use('/api/client-logos', clientLogosRouter);
app.use('/api/admin/login', adminLoginLimiter);
app.use('/api/admin', adminRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ ok: false, error: 'Something went wrong.' });
});

app.listen(PORT, () => {
  console.log(`H2 Softskills API listening on http://localhost:${PORT}`);
});