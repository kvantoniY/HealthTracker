import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../lib/validate.js';
import { getSequelize } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/',
  requireAuth,
  query('from').optional().isISO8601(),
  query('to').optional().isISO8601(),
  validate,
  async (req, res, next) => {
    try {
      const { MoodEntry } = getSequelize().models;
      const where = { ownerId: req.user.id };
      if (req.query.from || req.query.to) {
        where.date = {};
        if (req.query.from) where.date['$gte'] = req.query.from;
        if (req.query.to) where.date['$lte'] = req.query.to;
      }
      const entries = await MoodEntry.findAll({ where, order: [['date', 'DESC']] });
      res.json({ data: entries });
    } catch (e) { next(e); }
  }
);

router.get('/by-date/:date',
  requireAuth,
  param('date').isISO8601().withMessage('Use YYYY-MM-DD'),
  validate,
  async (req, res, next) => {
    try {
      const { MoodEntry } = getSequelize().models;
      const entry = await MoodEntry.findOne({ where: { ownerId: req.user.id, date: req.params.date } });
      res.json({ data: entry || null });
    } catch (e) { next(e); }
  }
);

router.post('/',
  requireAuth,
  body('date').isISO8601(),
  body('sleepHours').optional().isFloat(),
  body('stressLevel').optional().isInt({ min: 0, max: 10 }),
  body('moodScore').optional().isInt({ min: 1, max: 100 }),
  body('notes').optional().isString(),
  validate,
  async (req, res, next) => {
    try {
      const { MoodEntry } = getSequelize().models;
      const entry = await MoodEntry.create({ ...req.body, ownerId: req.user.id });
      res.status(201).json({ data: entry });
    } catch (e) { next(e); }
  }
);

router.put('/:id',
  requireAuth,
  param('id').isInt(),
  validate,
  async (req, res, next) => {
    try {
      const { MoodEntry } = getSequelize().models;
      const entry = await MoodEntry.findByPk(req.params.id);
      if (!entry) return res.status(404).json({ error: { message: 'Not found' } });
      if (entry.ownerId !== req.user.id) return res.status(403).json({ error: { message: 'Forbidden' } });

      const allowed = ['date', 'sleepHours', 'stressLevel', 'moodScore', 'notes'];
      const patch = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
      await entry.update(patch);
      res.json({ data: entry });
    } catch (e) { next(e); }
  }
);

router.delete('/:id',
  requireAuth,
  param('id').isInt(),
  validate,
  async (req, res, next) => {
    try {
      const { MoodEntry } = getSequelize().models;
      const entry = await MoodEntry.findByPk(req.params.id);
      if (!entry) return res.status(404).json({ error: { message: 'Not found' } });
      if (entry.ownerId !== req.user.id) return res.status(403).json({ error: { message: 'Forbidden' } });
      await entry.destroy();
      res.json({ ok: true });
    } catch (e) { next(e); }
  }
);

export default router;
