import { Link } from 'react-router-dom';
import { AppBar } from '@components/AppBar';
import { Card } from '@components/Card';
import { Button } from '@components/Button';
import { StreakChip } from '@components/StreakChip';
import { Pill } from '@components/Pill';
import { EmojiHero } from '@features/vocabulary/EmojiHero';
import { AssociationCallout } from '@features/vocabulary/AssociationCallout';
import { AchievementBadge } from '@features/progress/AchievementBadge';
import { useT } from '@hooks/useT';
import { useProgress } from '@contexts/ProgressContext';
import { useWordOfDay } from '@hooks/useWordOfDay';
import { useAchievements } from '@hooks/useAchievements';
import { useLanguagePairContext } from '@contexts/LanguagePairContext';

export default function HomePage() {
  const t = useT();
  const { aggregate } = useProgress();
  const wod = useWordOfDay();
  const achievements = useAchievements();
  const { loading } = useLanguagePairContext();
  const earnedTop = achievements.filter((a) => a.earned).slice(0, 3);

  if (loading) return <div className="p-6 text-zinc-500">{t('common.loading')}</div>;

  return (
    <>
      <AppBar title={t('app.title')} subtitle={t('app.subtitle')} right={<StreakChip />} />
      <div className="mx-auto flex max-w-md flex-col gap-4 px-4 py-2">
        <Card variant="brand" className="flex flex-col gap-3">
          <h2 className="font-display text-2xl font-bold">{t('home.greeting')}</h2>
          <p className="text-sm">{t('home.dueCount', { n: aggregate.wordsToRepeat })}</p>
          <Link to="/flashcards/session">
            <Button variant="primary" fullWidth>
              {t('home.startReview')}
            </Button>
          </Link>
        </Card>

        {wod ? (
          <Card>
            <Pill tone="accent">{t('home.wordOfDay')}</Pill>
            <div className="mt-3 flex items-center gap-3">
              <EmojiHero emoji={wod.emoji} />
              <div className="flex-1">
                <Link
                  to={`/vocabulary/word/${encodeURIComponent(wod.id)}`}
                  className="font-display text-2xl font-bold"
                >
                  {wod.target}
                </Link>
                <div className="text-sm text-zinc-500">{wod.base}</div>
              </div>
            </div>
            {wod.exampleTarget ? (
              <p className="mt-3 text-sm text-zinc-700">
                <em>{wod.exampleTarget}</em>
                <span className="block text-zinc-500">{wod.exampleBase}</span>
              </p>
            ) : null}
            <div className="mt-3">
              <AssociationCallout
                association={wod.association}
                similarSounding={wod.similarSounding}
              />
            </div>
          </Card>
        ) : null}

        {earnedTop.length > 0 ? (
          <section className="flex flex-col gap-2">
            <h3 className="font-display text-lg font-bold">{t('home.achievements')}</h3>
            <div className="grid grid-cols-3 gap-2">
              {earnedTop.map((a) => (
                <AchievementBadge key={a.id} a={a} />
              ))}
            </div>
          </section>
        ) : null}

        <nav className="grid grid-cols-2 gap-3">
          <Link to="/grammar">
            <Card variant="muted" padding="sm" className="flex items-center gap-2">
              📐 {t('nav.grammar')}
            </Card>
          </Link>
          <Link to="/favorites">
            <Card variant="muted" padding="sm" className="flex items-center gap-2">
              ⭐ {t('nav.favorites')}
            </Card>
          </Link>
          <Link to="/search">
            <Card variant="muted" padding="sm" className="flex items-center gap-2">
              🔍 {t('nav.search')}
            </Card>
          </Link>
          <Link to="/settings">
            <Card variant="muted" padding="sm" className="flex items-center gap-2">
              ⚙️ {t('nav.settings')}
            </Card>
          </Link>
        </nav>
      </div>
    </>
  );
}
