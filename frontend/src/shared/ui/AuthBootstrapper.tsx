'use client';

import { useEffect } from 'react';
import { bootstrapAuth } from '@/store/slices/authSlice';
import { useAppDispatch } from '@/store/hooks';

export function AuthBootstrapper() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(bootstrapAuth());
  }, [dispatch]);

  return null;
}
