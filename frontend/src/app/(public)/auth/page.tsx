'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { authActions, loginThunk, registerThunk } from '@/store/slices/authSlice';

type Mode = 'login' | 'register';

export default function AuthPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { token, status, error } = useAppSelector((s) => s.auth);

  const [mode, setMode] = useState<Mode>('login');
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (token) router.replace('/');
  }, [token, router]);

  const canSubmit = useMemo(() => {
    if (!password.trim()) return false;
    if (mode === 'login') return Boolean(identifier.trim());
    return Boolean(email.trim()) && Boolean(username.trim());
  }, [mode, identifier, email, username, password]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    dispatch(authActions.clearError());
    if (mode === 'login') {
      await dispatch(loginThunk({ identifier, password }));
    } else {
      await dispatch(registerThunk({ email, username, password }));
    }
  }

  return (
    <div className="container" style={{ paddingTop: 48 }}>
      <div className="card" style={{ maxWidth: 460, margin: '0 auto' }}>
        <div className="col" style={{ gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 26 }}>HealthTracker</h1>
            <p className="muted" style={{ margin: '6px 0 0' }}>
              {mode === 'login' ? 'Вход в аккаунт' : 'Создание аккаунта'}
            </p>
          </div>

          <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`btn ${mode === 'login' ? 'btnPrimary' : ''}`}
              onClick={() => setMode('login')}
            >
              Вход
            </button>
            <button
              type="button"
              className={`btn ${mode === 'register' ? 'btnPrimary' : ''}`}
              onClick={() => setMode('register')}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={onSubmit} className="col">
            {mode === 'login' ? (
              <label className="col">
                <span className="muted">Email или username</span>
                <input
                  className="input"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="ivan@test.com или ivan"
                  autoComplete="username"
                />
              </label>
            ) : (
              <>
                <label className="col">
                  <span className="muted">Email</span>
                  <input
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ivan@test.com"
                    autoComplete="email"
                  />
                </label>
                <label className="col">
                  <span className="muted">Username</span>
                  <input
                    className="input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ivan"
                    autoComplete="username"
                  />
                </label>
              </>
            )}

            <label className="col">
              <span className="muted">Пароль</span>
              <input
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </label>

            {error ? (
              <div className="card" style={{ padding: 12, borderColor: 'rgba(255,100,100,0.45)' }}>
                <div style={{ fontWeight: 700 }}>Ошибка</div>
                <div className="muted" style={{ marginTop: 4 }}>{error}</div>
              </div>
            ) : null}

            <button className="btn btnPrimary" type="submit" disabled={!canSubmit || status === 'loading'}>
              {status === 'loading' ? 'Подождите…' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>

          <p className="muted" style={{ margin: 0, fontSize: 13 }}>
            После авторизации токен сохраняется в localStorage.
          </p>
        </div>
      </div>
    </div>
  );
}
