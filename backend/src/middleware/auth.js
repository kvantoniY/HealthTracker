import jwt from 'jsonwebtoken';
import { getSequelize } from '../lib/db.js';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [type, token] = header.split(' ');
  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ error: { message: 'Missing Bearer token' } });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    req.user = payload; // { id }
    next();
  } catch (e) {
    return res.status(401).json({ error: { message: 'Invalid token' } });
  }
}

export async function attachUser(req, res, next) {
  // optional helper if you want full user
  const { User } = getSequelize().models;
  if (!req.user?.id) return next();
  req.currentUser = await User.findByPk(req.user.id, { attributes: { exclude: ['passwordHash'] } });
  next();
}
