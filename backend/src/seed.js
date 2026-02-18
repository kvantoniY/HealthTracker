import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { initDb, getSequelize } from './lib/db.js';

await initDb();
const { User, Post, MoodEntry, Comment, Friendship, PostLike } = getSequelize().models;

async function upsertUser(email, username, password) {
  const found = await User.findOne({ where: { email } });
  if (found) return found;
  const passwordHash = await bcrypt.hash(password, 10);
  return User.create({ email, username, passwordHash, displayName: username });
}

const u1 = await upsertUser('ivan@test.com', 'ivan', 'Password123!');
const u2 = await upsertUser('kate@test.com', 'kate', 'Password123!');

await MoodEntry.findOrCreate({
  where: { ownerId: u1.id, date: '2026-02-18' },
  defaults: { sleepHours: 7.5, stressLevel: 3, moodScore: 80, notes: 'seed', ownerId: u1.id, date: '2026-02-18' },
});

const [p1] = await Post.findOrCreate({
  where: { authorId: u1.id, text: 'Seed post: hello' },
  defaults: { authorId: u1.id, text: 'Seed post: hello', scope: 'day', attachedDate: '2026-02-18', attachedMoodScore: 80, photos: [] },
});

await Comment.findOrCreate({
  where: { postId: p1.id, authorId: u2.id, text: 'Nice!' },
  defaults: { postId: p1.id, authorId: u2.id, text: 'Nice!' },
});

await Friendship.findOrCreate({
  where: { requesterId: u1.id, addresseeId: u2.id },
  defaults: { requesterId: u1.id, addresseeId: u2.id, status: 'accepted' },
});

await PostLike.findOrCreate({
  where: { postId: p1.id, userId: u2.id },
  defaults: { postId: p1.id, userId: u2.id },
});

console.log('[seed] done');
process.exit(0);
