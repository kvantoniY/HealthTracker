'use client';

import { Header } from '@/widgets/Header';
import { useAuthRedirect } from '@/shared/lib/useAuthRedirect';
import { useAppSelector } from '@/store/hooks';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  useAuthRedirect();
  const { status } = useAppSelector((s) => s.auth);

  if (status === 'loading') {
    return (
      <div className="container">
        <div className="spacer" />
        <div className="card">Загрузка...</div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="container">
        <div className="spacer" />
        {children}
      </main>
    </>
  );
}
