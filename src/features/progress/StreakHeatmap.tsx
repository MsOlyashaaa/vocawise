import { lastNDates } from '@utils/dateUtils';
import { useSettings } from '@contexts/SettingsContext';

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function StreakHeatmap() {
  const { rawState, global } = useSettings();
  const pair = rawState.pairs[global.activePairId];
  const days = lastNDates(30);
  const activeDays = new Set<string>();
  if (pair) {
    for (const c of Object.values(pair.cards)) {
      if (c.lastReviewedAt > 0) {
        const d = new Date(c.lastReviewedAt);
        activeDays.add(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
      }
    }
  }
  return (
    <div className="grid grid-cols-10 gap-1.5">
      {days.map((d) => (
        <div
          key={d}
          title={d}
          className={`h-5 w-5 rounded-md ${activeDays.has(d) ? 'bg-brand-500' : 'bg-surface-muted'}`}
        />
      ))}
    </div>
  );
}
