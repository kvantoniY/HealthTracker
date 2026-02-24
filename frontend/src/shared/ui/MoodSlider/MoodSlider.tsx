'use client';

import React, { ChangeEvent } from 'react';
import './MoodSlider.css';

type SliderKind = 'stress' | 'sleep';

interface MoodSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;

  min?: number;
  max?: number;
  step?: number;
  unit?: string;       // например "/ 10" или "ч"
  kind?: SliderKind;   // влияет на подписи/описания
}

export default function MoodSlider({
  label,
  value,
  onChange,
  min = 1,
  max = 10,
  step = 1,
  unit = '',
  kind = 'stress',
}: MoodSliderProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value);
    onChange(newVal);
  };

  // Цвет трека (простая логика; можешь усложнить)
  const getTrackColor = (v: number): string => {
    // Для стресса: меньше = лучше, для сна: ближе к 8 = лучше
    if (kind === 'sleep') {
      const diff = Math.abs(v - 8);
      if (diff <= 0.5) return 'linear-gradient(to right, #10b981, #34d399)';
      if (diff <= 1.5) return 'linear-gradient(to right, #06b6d4, #22d3ee)';
      if (diff <= 2.5) return 'linear-gradient(to right, #eab308, #fbbf24)';
      return 'linear-gradient(to right, #ef4444, #f87171)';
    }

    // stress
    if (v <= 2) return 'linear-gradient(to right, #10b981, #34d399)';
    if (v <= 4) return 'linear-gradient(to right, #06b6d4, #22d3ee)';
    if (v <= 6) return 'linear-gradient(to right, #eab308, #fbbf24)';
    if (v <= 8) return 'linear-gradient(to right, #f97316, #fb923c)';
    return 'linear-gradient(to right, #ef4444, #f87171)';
  };

  const getDescription = (v: number): string => {
    if (kind === 'sleep') {
      if (v >= 7.5 && v <= 8.5) return 'Идеально 👌';
      if (v >= 6.5 && v <= 9.5) return 'Неплохо';
      if (v >= 5.5 && v <= 10.5) return 'Сойдёт';
      return 'Надо бы выспаться';
    }

    // stress
    if (v <= 2) return 'Спокойно 😌';
    if (v <= 4) return 'Легко напряжён';
    if (v <= 6) return 'Нормально';
    if (v <= 8) return 'Напряжно';
    return 'Жёстко…';
  };

  return (
    <div className="mood-slider-container">
      <div className="header">
        <span className="label">{label}:</span>
        <span className="value">
          {value} {unit}
        </span>
      </div>

      <div className="slider-wrapper">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={Number.isFinite(value) ? value : min}
          onChange={handleChange}
          className="mood-range"
          style={{ '--track-color': getTrackColor(value) } as React.CSSProperties}
        />
      </div>

      <div className="footer">
        <div className="description">{getDescription(value)}</div>
      </div>
    </div>
  );
}