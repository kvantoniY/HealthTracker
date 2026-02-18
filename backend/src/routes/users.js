import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../lib/validate.js';
import { getSequelize } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const { User } = getSequelize().models;
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['passwordHash'] } });
    res.json({ user });
  } catch (e) { next(e); }
});

router.put('/me',
  requireAuth,
  body('displayName').optional().isString(),
  body('bio').optional().isString(),
  body('avatarUrl').optional().isString(),
  validate,
  async (req, res, next) => {
    try {
      const { User } = getSequelize().models;
      const user = await User.findByPk(req.user.id);
      if (!user) return res.status(404).json({ error: { message: 'User not found' } });

      const { displayName, bio, avatarUrl } = req.body;
      await user.update({ displayName, bio, avatarUrl });
      res.json({ user: sanitize(user) });
    } catch (e) { next(e); }
  }
);

function sanitize(userInstance) {
  const u = userInstance.toJSON();
  delete u.passwordHash;
  return u;
}

export default router;
