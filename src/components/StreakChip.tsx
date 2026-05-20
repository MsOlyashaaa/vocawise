import { Pill } from './Pill';
import { useDailyStreak } from '@hooks/useDailyStreak';
import { useT } from '@hooks/useT';

export function StreakChip() {
  const streak = useDailyStreak();
  const t = useT();
  return (
    <Pill tone="brand">
      🔥 {streak.currentStreak} {t('progress.streakDays')}
    </Pill>
  );
}
