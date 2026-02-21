'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getMood, moodActions } from '@/store/slices/moodSlice';
import { useEffect } from 'react';

export default function HealthTrackerPage() {
  const dispatch = useAppDispatch();
  const {mood, status, error} = useAppSelector((s) => s.mood);
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    dispatch(getMood(today));
  }, [])
  if (status === 'loading') return <div>Загрузка настроения...</div>;
  if (status === 'failed') return <div>Ошибка: {error}</div>;
  return (
    <div className="card">
      <h1 style={{ marginTop: 0 }}>Трекер здоровья</h1>
      {!mood ? (
        <p className="muted">Нет данных о состоянии на этот день.</p>
      ) : (
        <div className="col">
            <p>{mood.moodScore}</p>
        </div>
      )}
    </div>
  );
}
