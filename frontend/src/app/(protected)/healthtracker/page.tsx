'use client';

import { useEffect, useMemo, useState } from 'react';
import MoodCircle from '@/shared/ui/MoodCircle';
import MoodSlider from '@/shared/ui/MoodSlider/MoodSlider';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getMood } from '@/store/slices/moodSlice';

function getLocalISODate(): string {
  // Локальная дата YYYY-MM-DD (без UTC-сдвига)
  return new Date().toLocaleDateString('en-CA');
}

export default function HealthTrackerPage() {
  const dispatch = useAppDispatch();
  const { mood, status, error } = useAppSelector((s) => s.mood);

  // локальный state под UI (отдельно числа)
  const [stressLevel, setStressLevel] = useState<number>(5);
  const [sleepHours, setSleepHours] = useState<number>(8);

  useEffect(() => {
    const today = getLocalISODate();
    dispatch(getMood(today));
  }, [dispatch]);

  // когда mood приехал — синхронизируем локальные значения с ним
  useEffect(() => {
    if (!mood) return;
    setStressLevel(mood.stressLevel ?? 5);
    setSleepHours(mood.sleepHours ?? 8);
  }, [mood]);

  const dateLabel = useMemo(() => {
    return mood?.date ? `Сегодня ${mood.date}` : 'Сегодня';
  }, [mood?.date]);

  if (status === 'loading') return <div>Загрузка настроения...</div>;
  if (status === 'failed') return <div>Ошибка: {error}</div>;

  return (
    <div className="card">
      <h1 style={{ marginTop: 0 }}>Трекер здоровья</h1>

      {!mood ? (
        <p className="muted">Нет данных о состоянии на этот день.</p>
      ) : (
        <div className="col" style={{ gap: 16 }}>
          <p>{dateLabel}</p>

          <MoodCircle score={Number(mood.moodScore) || 0} size={160} />

          <MoodSlider
            label="Стресс"
            value={stressLevel}
            min={1}
            max={10}
            step={1}
            unit="/ 10"
            kind="stress"
            onChange={setStressLevel}
          />

          <MoodSlider
            label="Сон"
            value={sleepHours}
            min={0}
            max={12}
            step={0.5}
            unit="ч"
            kind="sleep"
            onChange={setSleepHours}
          />

          <p>Заметка дня: {mood.notes}</p>

          {/* если хочешь — сюда кнопку "Сохранить изменения" */}
          {/* <button onClick={() => dispatch(updateMood({ date: mood.date, stressLevel, sleepHours }))}>
            Сохранить
          </button> */}
        </div>
      )}
    </div>
  );
}