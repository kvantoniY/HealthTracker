'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { bootstrapAuth } from '@/store/slices/authSlice';

export function AuthBootstrapper() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(bootstrapAuth());
  }, [dispatch]);

  return null;
}
