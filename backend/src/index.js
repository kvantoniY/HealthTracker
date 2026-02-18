import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import { buildSwaggerSpec } from './lib/swagger.js';


import { initDb } from './lib/db.js';
import { errorHandler, notFound } from './middleware/errors.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import moodRoutes from './routes/moodEntries.js';
import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';
import friendshipRoutes from './routes/friendships.js';
import uploadRoutes from './routes/uploads.js';
import docsRoutes from './routes/docs.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
const swaggerSpec = buildSwaggerSpec();
app.use('/api', docsRoutes);

app.use(morgan('dev'));

const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use('/uploads', express.static(path.resolve(uploadDir)));

app.get('/api/_health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mood-entries', moodRoutes);
app.use('/api/posts', postRoutes);
app.use('/api', commentRoutes);        // comments endpoints include /posts/:postId/comments and /comments/:id
app.use('/api/friendships', friendshipRoutes);
app.use('/api/uploads', uploadRoutes);

app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT || 4000);

await initDb();

app.listen(port, () => {
  console.log(`[server] listening on http://localhost:${port}`);
});
