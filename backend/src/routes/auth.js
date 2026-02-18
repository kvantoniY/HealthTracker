


import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { validate } from '../lib/validate.js';
import { getSequelize } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register',
  body('email').isEmail(),
  body('username').isLength({ min: 3 }),
  body('password').isLength({ min: 6 }),
  validate,
  async (req, res, next) => {
    try {
      const { User } = getSequelize().models;
      const { email, username, password } = req.body;

      const exists = await User.findOne({ where: { email } }) || await User.findOne({ where: { username } });
      if (exists) return res.status(409).json({ error: { message: 'User already exists' } });

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ email, username, passwordHash, displayName: username });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
      res.json({ token, user: sanitize(user) });
    } catch (e) { next(e); }
  }
);

router.post('/login',
  body('identifier').isString().notEmpty(),
  body('password').isString().notEmpty(),
  validate,
  async (req, res, next) => {
    try {
      const { User } = getSequelize().models;
      const { identifier, password } = req.body;

      const user = await User.findOne({ where: { email: identifier } }) || await User.findOne({ where: { username: identifier } });
      if (!user) return res.status(401).json({ error: { message: 'Invalid credentials' } });

      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return res.status(401).json({ error: { message: 'Invalid credentials' } });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
      res.json({ token, user: sanitize(user) });
    } catch (e) { next(e); }
  }
);

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const { User } = getSequelize().models;
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['passwordHash'] } });
    if (!user) return res.status(404).json({ error: { message: 'User not found' } });
    res.json({ user });
  } catch (e) { next(e); }
});

function sanitize(userInstance) {
  const u = userInstance.toJSON();
  delete u.passwordHash;
  return u;
}

export default router;
