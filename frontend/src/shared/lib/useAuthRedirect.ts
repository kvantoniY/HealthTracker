'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

/**
 * Client-side route guard.
 * - Unauth users can only visit /auth
 * - Auth users can visit everything under protected group, and are redirected away from /auth
 */
export function useAuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const { token, status } = useAppSelector((s) => s.auth);

  useEffect(() => {
    // wait for bootstrap to settle
    if (status === 'loading') return;

    const isAuthPage = pathname?.startsWith('/auth');
    const isAuthed = Boolean(token);

    if (!isAuthed && !isAuthPage) {
      router.replace('/auth');
      return;
    }
    if (isAuthed && isAuthPage) {
      router.replace('/');
    }
  }, [pathname, router, status, token]);
}
