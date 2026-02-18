'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout } from '@/store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

function Avatar({ url, label }: { url?: string | null; label: string }) {
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={label} src={url} className="avatar" />;
  }
  return <div className="avatar">{label.slice(0, 1).toUpperCase()}</div>;
}

export function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  const displayName = user?.displayName || user?.username || 'User';

  return (
    <header className="header">
      <div className="container headerInner">
        <div className="row" style={{ alignItems: 'center' }}>
          <Link href="/" className="pill">
            HealthTracker
          </Link>
          <nav className="nav">
            <Link href="/" className="pill">Главная</Link>
            <Link href="/dashboard" className="pill">Дашборд</Link>
            <Link href="/settings" className="pill">Настройки</Link>
          </nav>
        </div>

        <div className="row" style={{ alignItems: 'center' }}>
          <div className="muted">{displayName}</div>
          <button
            className="btn"
            onClick={() => router.push('/profile')}
            aria-label="Профиль"
            type="button"
            style={{ padding: 0, border: 'none', background: 'transparent' }}
          >
            <Avatar url={user?.avatarUrl} label={displayName} />
          </button>
          <button
            className="btn"
            onClick={() => {
              dispatch(logout());
              router.push('/auth');
            }}
            type="button"
          >
            Выйти
          </button>
        </div>
      </div>
    </header>
  );
}
