import { useNavigate, useParams } from 'react-router-dom';
import { AppBar } from '@components/AppBar';
import { Card } from '@components/Card';
import { Button } from '@components/Button';
import { Pill } from '@components/Pill';
import { EmojiHero } from '@features/vocabulary/EmojiHero';
import { AssociationCallout } from '@features/vocabulary/AssociationCallout';
import { GrammarTable } from '@features/grammar/GrammarTable';
import { EmptyState } from '@components/EmptyState';
import { useToast } from '@components/Toast';
import { useVocabularyById } from '@hooks/useVocabulary';
import { useFavorites } from '@contexts/FavoritesContext';
import { useProgress } from '@contexts/ProgressContext';
import { transliteratePl } from '@utils/transliteratePl';
import { CATEGORY_LABELS_UK, DIFFICULTY_LABELS_UK } from '@app-types/vocabulary';
import { useT } from '@hooks/useT';

export default function WordDetailPage() {
  const t = useT();
  const nav = useNavigate();
  const { id } = useParams<{ id: string }>();
  const decoded = id ? decodeURIComponent(id) : '';
  const item = useVocabularyById(decoded);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { cards, markLearned } = useProgress();
  const { push } = useToast();

  if (!item) {
    return (
      <>
        <AppBar title={t('common.unknown')} back />
        <EmptyState icon="🤔" title={t('common.empty')} />
      </>
    );
  }

  const fav = isFavorite(item.id);
  const learned = cards[item.id]?.isLearned === true;

  return (
    <>
      <AppBar
        title={item.target}
        subtitle={CATEGORY_LABELS_UK[item.category]}
        back
        right={
          <button
            onClick={() => toggleFavorite(item.id)}
            aria-label="favorite"
            className="px-2 text-2xl"
          >
            {fav ? '★' : '☆'}
          </button>
        }
      />
      <div className="mx-auto flex max-w-md flex-col gap-4 px-4 py-2">
        <Card className="flex flex-col items-center gap-3 text-center">
          <EmojiHero emoji={item.emoji} size="lg" />
          <div className="font-display text-4xl font-bold">{item.target}</div>
          <div className="text-sm italic text-zinc-400">[{transliteratePl(item.target)}]</div>
          <div className="text-lg text-zinc-600">{item.base}</div>
          <div className="flex flex-wrap justify-center gap-2">
            <Pill tone="neutral">{DIFFICULTY_LABELS_UK[item.difficulty]}</Pill>
            {item.tags?.map((tag) => (
              <Pill key={tag} tone="neutral">
                {tag}
              </Pill>
            ))}
          </div>
        </Card>

        {item.exampleTarget ? (
          <Card>
            <h3 className="mb-1 text-xs uppercase tracking-wide text-zinc-500">
              {t('vocab.example')}
            </h3>
            <p className="font-medium">{item.exampleTarget}</p>
            <p className="text-sm text-zinc-500">{item.exampleBase}</p>
          </Card>
        ) : null}

        <AssociationCallout association={item.association} similarSounding={item.similarSounding} />

        {item.meta ? (
          <Card>
            <h3 className="mb-2 text-xs uppercase tracking-wide text-zinc-500">
              {t('vocab.meta')}
            </h3>
            <div className="flex flex-col gap-2 text-sm">
              {item.meta.gender ? (
                <div>
                  <strong>{t(`vocab.gender.${item.meta.gender}`)}</strong>
                </div>
              ) : null}
              {item.meta.aspect ? <div>{t(`vocab.aspect.${item.meta.aspect}`)}</div> : null}
              {item.meta.plural ? (
                <div>
                  {t('vocab.plural')}: <strong>{item.meta.plural}</strong>
                </div>
              ) : null}
              {item.meta.conjugation ? (
                <div>
                  <div className="mb-1 text-zinc-500">{t('vocab.conjugation')}</div>
                  <GrammarTable
                    headers={['Особа', 'Форма']}
                    rows={Object.entries(item.meta.conjugation)}
                  />
                </div>
              ) : null}
            </div>
          </Card>
        ) : null}

        <div className="flex flex-col gap-2">
          <Button
            variant={learned ? 'secondary' : 'primary'}
            fullWidth
            disabled={learned}
            onClick={() => {
              markLearned(item.id);
              push(`«${item.target}» позначено як вивчене.`, 'success');
            }}
          >
            {learned ? '✓ Вивчено' : 'Я знаю це слово'}
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => nav(`/flashcards/session?deck=single&id=${encodeURIComponent(item.id)}`)}
          >
            {t('vocab.practiceThis')}
          </Button>
        </div>
      </div>
    </>
  );
}
