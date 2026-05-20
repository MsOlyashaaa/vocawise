import { Card } from '@components/Card';
import type { AchievementWithStatus } from '@hooks/useAchievements';

export function AchievementBadge({ a }: { a: AchievementWithStatus }) {
  return (
    <Card
      variant={a.earned ? 'brand' : 'muted'}
      padding="sm"
      className="flex flex-col items-center gap-1 text-center"
    >
      <div className={`text-3xl ${a.earned ? '' : 'opacity-50 grayscale'}`} aria-hidden>
        {a.icon}
      </div>
      <div className="text-xs font-semibold">{a.name}</div>
      <div className="text-[10px] opacity-70">{a.description}</div>
    </Card>
  );
}
