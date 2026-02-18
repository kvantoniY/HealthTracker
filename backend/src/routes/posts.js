/**
 * @openapi
 * tags:
 *   - name: Posts
 *     description: Posts feed
 */

/**
 * @openapi
 * /api/posts:
 *   get:
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: authorId
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, default: 0 }
 *     responses:
 *       200:
 *         description: OK
 *   post:
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties:
 *               text: { type: string, example: "Сегодня день норм" }
 *               scope: { type: string, enum: [day, week], example: day }
 *               attachedDate: { type: string, example: "2026-02-18" }
 *               attachedMoodScore: { type: integer, example: 80 }
 *               photos:
 *                 type: array
 *                 items: { type: string }
 *     responses:
 *       201:
 *         description: Created
 */

/**
 * @openapi
 * /api/posts/{id}:
 *   get:
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 *   put:
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 *   delete:
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 */


import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../lib/validate.js';
import { getSequelize } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import { Op } from 'sequelize';

const router = Router();

router.get('/',
  requireAuth,
  query('authorId').optional().isInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('offset').optional().isInt({ min: 0 }),
  validate,
  async (req, res, next) => {
    try {
      const { Post, User, Comment } = getSequelize().models;
      const where = {};
      if (req.query.authorId) where.authorId = Number(req.query.authorId);

      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const offset = req.query.offset ? Number(req.query.offset) : 0;

      const posts = await Post.findAll({
        where,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        include: [
          { model: User, as: 'author', attributes: ['id', 'username', 'displayName', 'avatarUrl'] },
          { model: Comment, include: [{ model: User, as: 'author', attributes: ['id', 'username', 'displayName', 'avatarUrl'] }], limit: 20, order: [['createdAt', 'ASC']] },
          { model: User, as: 'likes', attributes: ['id'] },
        ],
      });

      res.json({ data: posts });
    } catch (e) { next(e); }
  }
);

router.get('/:id',
  requireAuth,
  param('id').isInt(),
  validate,
  async (req, res, next) => {
    try {
      const { Post, User, Comment } = getSequelize().models;
      const post = await Post.findByPk(req.params.id, {
        include: [
          { model: User, as: 'author', attributes: ['id', 'username', 'displayName', 'avatarUrl'] },
          { model: Comment, include: [{ model: User, as: 'author', attributes: ['id', 'username', 'displayName', 'avatarUrl'] }], order: [['createdAt', 'ASC']] },
          { model: User, as: 'likes', attributes: ['id'] },
        ],
      });
      if (!post) return res.status(404).json({ error: { message: 'Not found' } });
      res.json({ data: post });
    } catch (e) { next(e); }
  }
);

router.post('/',
  requireAuth,
  body('text').isString().notEmpty(),
  body('scope').optional().isIn(['day', 'week']),
  body('attachedDate').optional().isISO8601(),
  body('attachedMoodScore').optional().isInt({ min: 1, max: 100 }),
  body('photos').optional().isArray(),
  validate,
  async (req, res, next) => {
    try {
      const { Post } = getSequelize().models;
      const { text, scope = 'day', attachedDate = null, attachedMoodScore = null, photos = [] } = req.body;

      const post = await Post.create({
        text,
        scope,
        attachedDate,
        attachedMoodScore,
        photos,
        authorId: req.user.id,
      });

      res.status(201).json({ data: post });
    } catch (e) { next(e); }
  }
);

router.put('/:id',
  requireAuth,
  param('id').isInt(),
  validate,
  async (req, res, next) => {
    try {
      const { Post } = getSequelize().models;
      const post = await Post.findByPk(req.params.id);
      if (!post) return res.status(404).json({ error: { message: 'Not found' } });
      if (post.authorId !== req.user.id) return res.status(403).json({ error: { message: 'Forbidden' } });

      const allowed = ['text', 'scope', 'attachedDate', 'attachedMoodScore', 'photos'];
      const patch = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
      await post.update(patch);
      res.json({ data: post });
    } catch (e) { next(e); }
  }
);

router.delete('/:id',
  requireAuth,
  param('id').isInt(),
  validate,
  async (req, res, next) => {
    try {
      const { Post } = getSequelize().models;
      const post = await Post.findByPk(req.params.id);
      if (!post) return res.status(404).json({ error: { message: 'Not found' } });
      if (post.authorId !== req.user.id) return res.status(403).json({ error: { message: 'Forbidden' } });
      await post.destroy();
      res.json({ ok: true });
    } catch (e) { next(e); }
  }
);

// Likes
router.post('/:id/like',
  requireAuth,
  param('id').isInt(),
  validate,
  async (req, res, next) => {
    try {
      const { Post, PostLike } = getSequelize().models;
      const post = await Post.findByPk(req.params.id);
      if (!post) return res.status(404).json({ error: { message: 'Post not found' } });

      await PostLike.findOrCreate({ where: { postId: post.id, userId: req.user.id } });
      res.json({ ok: true });
    } catch (e) { next(e); }
  }
);

router.post('/:id/unlike',
  requireAuth,
  param('id').isInt(),
  validate,
  async (req, res, next) => {
    try {
      const { PostLike } = getSequelize().models;
      await PostLike.destroy({ where: { postId: req.params.id, userId: req.user.id } });
      res.json({ ok: true });
    } catch (e) { next(e); }
  }
);

export default router;
