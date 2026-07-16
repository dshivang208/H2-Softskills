import jwt from 'jsonwebtoken';

const { JWT_SECRET } = process.env;

/**
 * Protects admin-only routes. Expects `Authorization: Bearer <token>`,
 * where <token> was issued by POST /api/admin/login.
 */
export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ ok: false, error: 'Missing or invalid authorization header.' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== 'admin') {
      return res.status(403).json({ ok: false, error: 'Not authorized.' });
    }
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, error: 'Session expired. Please log in again.' });
  }
}