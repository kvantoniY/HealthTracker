// components/MoodCircle.tsx
'use client';

import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css'; 

import { useMemo } from 'react';

interface MoodCircleProps {
  score: number;          // 0–100
  size?: number;          // диаметр в px
}

export default function MoodCircle({ score, size = 160 }: MoodCircleProps) {
  const getColor = (value: number) => {
    if (value >= 80) return '#4ade80';     // отличное — ярко-зелёный
    if (value >= 60) return '#22d3ee';     // хорошее — циан
    if (value >= 40) return '#fbbf24';     // среднее — жёлтый
    if (value >= 20) return '#f97316';     // плохое — оранжевый
    return '#ef4444';                      // ужасное — красный
  };
  const color = getColor(score);
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <CircularProgressbarWithChildren
        value={score}
        maxValue={100}
        text={`${Math.round(score)}%`}
        styles={buildStyles({
          pathColor: color,
          trailColor: 'rgba(50, 50, 60, 0.15)', 
          textColor: color,
          // Градиентный путь (path)
          pathTransitionDuration: 0.8, 
          strokeLinecap: 'round',
          textSize: '24px',
        })}
      />

      {/* Большой эмодзи поверх текста */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.45,
          pointerEvents: 'none',
          opacity: 0.85,
        }}
      >
        
      </div>
    </div>
  );
}