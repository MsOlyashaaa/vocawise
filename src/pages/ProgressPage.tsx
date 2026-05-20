import { AppBar } from '@components/AppBar';
import { Card } from '@components/Card';
import { StatCard } from '@features/progress/StatCard';
import { AchievementBadge } from '@features/progress/AchievementBadge';
import { StreakHeatmap } from '@features/progress/StreakHeatmap';
import { ProgressRing } from '@components/ProgressRing';
import { useProgress } from '@contexts/ProgressContext';
import { useAchievements } from '@hooks/useAchievements';
import { useLanguagePairContext } from '@contexts/LanguagePairContext';
import { CATEGORIES, CATEGORY_LABELS_UK } from '@app-types/vocabulary';
import { useT } from '@hooks/useT';

export default function ProgressPage() {
  const t = useT();
  const { aggregate, cards } = useProgress();
  const achievements = useAchievements();
  const { vocabulary } = useLanguagePairContext();

  const perCat = CATEGORIES.map((c) => {
    const items = vocabulary.filter((v) => v.category === c);
    const learned = items.filter((v) => cards[v.id]?.isLearned).length;
    return { c, total: items.length, learned, pct: items.length > 0 ? learned / items.length : 0 };
  });

  return (
    <>
      <AppBar title={t('nav.progress')} />
      <div className="mx-auto flex max-w-md flex-col gap-4 px-4 py-2">
        <div className="grid grid-cols-2 gap-3">
          <StatCard label={t('progress.learned')} value={aggregate.wordsLearned} emoji="✅" />
          <StatCard label={t('progress.toRepeat')} value={aggregate.wordsToRepeat} emoji="🔁" />
          <StatCard label={t('progress.favorites')} value={aggregate.favoritesCount} emoji="⭐" />
          <StatCard
            label={t('progress.accuracy')}
            value={`${Math.round(aggregate.quizAccuracy * 100)}%`}
            emoji="🎯"
          />
        </div>

        <Card>
          <h3 className="mb-2 font-display font-bold">{t('progress.streak')}</h3>
          <div className="flex items-center justify-between">
            <div className="font-display text-3xl font-bold">
              {aggregate.currentStreak} {t('progress.streakDays')}
            </div>
            <div className="text-xs text-zinc-500">Найдовша: {aggregate.longestStreak}</div>
          </div>
          <div className="mt-3">
            <StreakHeatmap />
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 font-display font-bold">Категорії</h3>
          <div className="flex flex-col gap-2">
            {perCat.map((p) => (
              <div key={p.c} className="flex items-center gap-3">
                <ProgressRing value={p.pct} size={36} thickness={4} />
                <div className="flex-1">
                  <div className="text-sm font-semibold">{CATEGORY_LABELS_UK[p.c]}</div>
                  <div className="text-xs text-zinc-500">
                    {p.learned} / {p.total}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <section>
          <h3 className="mb-2 font-display font-bold">{t('home.achievements')}</h3>
          <div className="grid grid-cols-3 gap-2">
            {achievements.map((a) => (
              <AchievementBadge key={a.id} a={a} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
