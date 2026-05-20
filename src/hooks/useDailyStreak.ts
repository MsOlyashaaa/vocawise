import { useSettings } from '@contexts/SettingsContext';

export function useDailyStreak() {
  const { rawState, global } = useSettings();
  const streak = rawState.pairs[global.activePairId]?.streak;
  return streak ?? { currentStreak: 0, longestStreak: 0, lastActiveDay: '' };
}
