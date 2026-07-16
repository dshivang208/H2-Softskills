import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import contactRouter from './src/routes/contact.js';
import newsletterRouter from './src/routes/newsletter.js';
import adminRouter from './src/routes/admin.js';

const app = express();
const PORT = process.env.PORT || 5000;

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
app.use('/api/admin/login', adminLoginLimiter);
app.use('/api/admin', adminRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ ok: false, error: 'Something went wrong.' });
});

app.listen(PORT, () => {
  console.log(`H2 Softskills API listening on http://localhost:${PORT}`);
});