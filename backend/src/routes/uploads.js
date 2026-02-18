import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const uploadDir = process.env.UPLOAD_DIR || './uploads';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    const name = crypto.randomBytes(12).toString('hex') + ext;
    cb(null, name);
  },
});

const upload = multer({ storage });

router.post('/', requireAuth, upload.single('file'), (req, res) => {
  const url = `/uploads/${req.file.filename}`;
  res.status(201).json({ url });
});

export default router;
