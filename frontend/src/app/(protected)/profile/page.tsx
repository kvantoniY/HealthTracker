'use client';

import { useAppSelector } from '@/store/hooks';

export default function ProfilePage() {
  const user = useAppSelector((s) => s.auth.user);

  return (
    <div className="card">
      <h1 style={{ marginTop: 0 }}>Профиль</h1>
      {!user ? (
        <p className="muted">Нет данных пользователя.</p>
      ) : (
        <div className="col">
          <div><span className="muted">Username:</span> {user.username}</div>
          <div><span className="muted">Email:</span> {user.email}</div>
          <div><span className="muted">Display name:</span> {user.displayName || '-'}</div>
          <div><span className="muted">Avatar:</span> {user.avatarUrl || '-'}</div>
          <div><span className="muted">Bio:</span> {user.bio || '-'}</div>
        </div>
      )}
    </div>
  );
}
