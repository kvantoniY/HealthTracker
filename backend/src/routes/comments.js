import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../lib/validate.js';
import { getSequelize } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Create comment for a post
router.post('/posts/:postId/comments',
  requireAuth,
  param('postId').isInt(),
  body('text').isString().notEmpty(),
  validate,
  async (req, res, next) => {
    try {
      const { Post, Comment } = getSequelize().models;
      const post = await Post.findByPk(req.params.postId);
      if (!post) return res.status(404).json({ error: { message: 'Post not found' } });

      const comment = await Comment.create({
        text: req.body.text,
        postId: post.id,
        authorId: req.user.id,
      });

      res.status(201).json({ data: comment });
    } catch (e) { next(e); }
  }
);

// Update comment
router.put('/comments/:id',
  requireAuth,
  param('id').isInt(),
  body('text').optional().isString(),
  validate,
  async (req, res, next) => {
    try {
      const { Comment } = getSequelize().models;
      const comment = await Comment.findByPk(req.params.id);
      if (!comment) return res.status(404).json({ error: { message: 'Not found' } });
      if (comment.authorId !== req.user.id) return res.status(403).json({ error: { message: 'Forbidden' } });

      await comment.update({ text: req.body.text ?? comment.text });
      res.json({ data: comment });
    } catch (e) { next(e); }
  }
);

// Delete comment
router.delete('/comments/:id',
  requireAuth,
  param('id').isInt(),
  validate,
  async (req, res, next) => {
    try {
      const { Comment } = getSequelize().models;
      const comment = await Comment.findByPk(req.params.id);
      if (!comment) return res.status(404).json({ error: { message: 'Not found' } });
      if (comment.authorId !== req.user.id) return res.status(403).json({ error: { message: 'Forbidden' } });

      await comment.destroy();
      res.json({ ok: true });
    } catch (e) { next(e); }
  }
);

export default router;
