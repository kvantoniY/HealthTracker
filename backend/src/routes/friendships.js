import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../lib/validate.js';
import { getSequelize } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import { Op } from 'sequelize';

const router = Router();

router.get('/',
  requireAuth,
  query('status').optional().isIn(['pending', 'accepted', 'blocked']),
  validate,
  async (req, res, next) => {
    try {
      const { Friendship, User } = getSequelize().models;
      const where = {
        [Op.or]: [
          { requesterId: req.user.id },
          { addresseeId: req.user.id },
        ],
      };
      if (req.query.status) where.status = req.query.status;

      const items = await Friendship.findAll({
        where,
        order: [['createdAt', 'DESC']],
        include: [
          { model: User, as: 'requester', attributes: ['id', 'username', 'displayName', 'avatarUrl'] },
          { model: User, as: 'addressee', attributes: ['id', 'username', 'displayName', 'avatarUrl'] },
        ],
      });

      res.json({ data: items });
    } catch (e) { next(e); }
  }
);

router.post('/',
  requireAuth,
  body('addresseeId').isInt(),
  validate,
  async (req, res, next) => {
    try {
      const { Friendship, User } = getSequelize().models;
      const addresseeId = Number(req.body.addresseeId);

      if (addresseeId === req.user.id) return res.status(400).json({ error: { message: 'Cannot friend yourself' } });

      const addressee = await User.findByPk(addresseeId);
      if (!addressee) return res.status(404).json({ error: { message: 'User not found' } });

      const [f, created] = await Friendship.findOrCreate({
        where: { requesterId: req.user.id, addresseeId },
        defaults: { status: 'pending' },
      });

      res.status(created ? 201 : 200).json({ data: f });
    } catch (e) { next(e); }
  }
);

router.put('/:id',
  requireAuth,
  param('id').isInt(),
  body('status').isIn(['pending', 'accepted', 'blocked']),
  validate,
  async (req, res, next) => {
    try {
      const { Friendship } = getSequelize().models;
      const f = await Friendship.findByPk(req.params.id);
      if (!f) return res.status(404).json({ error: { message: 'Not found' } });

      // only requester or addressee can change status
      if (f.requesterId !== req.user.id && f.addresseeId !== req.user.id) {
        return res.status(403).json({ error: { message: 'Forbidden' } });
      }

      await f.update({ status: req.body.status });
      res.json({ data: f });
    } catch (e) { next(e); }
  }
);

router.delete('/:id',
  requireAuth,
  param('id').isInt(),
  validate,
  async (req, res, next) => {
    try {
      const { Friendship } = getSequelize().models;
      const f = await Friendship.findByPk(req.params.id);
      if (!f) return res.status(404).json({ error: { message: 'Not found' } });
      if (f.requesterId !== req.user.id && f.addresseeId !== req.user.id) {
        return res.status(403).json({ error: { message: 'Forbidden' } });
      }
      await f.destroy();
      res.json({ ok: true });
    } catch (e) { next(e); }
  }
);

export default router;
