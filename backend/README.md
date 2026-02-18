# Mental Social Backend (Express + SQLite + Sequelize)

Mini social-network backend for:
- Auth (register/login) with JWT
- Users profile
- Mood entries (tracker)
- Posts with optional attachment (day/week + mood score/date)
- Comments
- Friend requests (pending/accepted/blocked)
- Likes on posts

## Quick start
```bash
npm i
cp .env.example .env
npm run seed   # optional: creates demo users + sample data
npm run dev
```

Server: http://localhost:4000

## Auth
- POST /api/auth/register
- POST /api/auth/login
- GET  /api/auth/me (Bearer token)

## Main resources
All protected (Bearer token), unless stated.
- GET/POST /api/posts
- GET/PUT/DELETE /api/posts/:id
- POST /api/posts/:id/like
- POST /api/posts/:id/unlike

- GET/POST /api/posts/:postId/comments
- PUT/DELETE /api/comments/:id

- GET/POST /api/mood-entries
- GET/PUT/DELETE /api/mood-entries/:id
- GET /api/mood-entries/by-date/:yyyy-mm-dd

- GET/POST /api/friendships
- PUT /api/friendships/:id (update status)
- DELETE /api/friendships/:id

Uploads (very basic local storage):
- POST /api/uploads (multipart/form-data, field: file)
Returns a URL you can store in `Post.photos` (JSON array).

## Notes
- SQLite file stored at `data/dev.sqlite`.
- Models are created with `sequelize.sync()` on boot (MVP style).
- Ownership checks are enforced for update/delete on mood entries, posts, comments.
