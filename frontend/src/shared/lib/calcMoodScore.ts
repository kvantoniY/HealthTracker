export function calcMoodScore(
  sleepHours: number,
  stressLevel: number
): number {
  // --- нормализация сна ---
  // идеал: 8 часов
  const idealSleep = 8;
  const maxSleepDiff = 4; // после ±4ч считаем очень плохо

  const sleepDiff = Math.abs(sleepHours - idealSleep);
  const sleepPenalty = Math.min(sleepDiff / maxSleepDiff, 1);

  // 1 = идеально, 0 = плохо
  const sleepScore = 1 - sleepPenalty;

  // --- нормализация стресса ---
  // stressLevel: 1 (лучше) -> 10 (хуже)
  const stressScore = 1 - (stressLevel - 1) / 9;

  // --- веса ---
  const WEIGHT_SLEEP = 0.6;
  const WEIGHT_STRESS = 0.4;

  const normalizedScore =
    sleepScore * WEIGHT_SLEEP +
    stressScore * WEIGHT_STRESS;

  // --- перевод в диапазон 10–100 ---
  const moodScore = 10 + normalizedScore * 90;

  return Math.round(moodScore);
}