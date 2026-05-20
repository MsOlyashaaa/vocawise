import { useMemo } from 'react';
import { useProgress } from '@contexts/ProgressContext';
import { ACHIEVEMENTS, type Achievement } from '@app-types/achievements';

export interface AchievementWithStatus extends Achievement {
  earned: boolean;
}

export function useAchievements(): AchievementWithStatus[] {
  const { earnedAchievements } = useProgress();
  return useMemo(
    () => ACHIEVEMENTS.map((a) => ({ ...a, earned: earnedAchievements.includes(a.id) })),
    [earnedAchievements],
  );
}
