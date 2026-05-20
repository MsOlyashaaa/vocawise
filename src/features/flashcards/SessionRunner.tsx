import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@components/Button';
import { ConfirmDialog } from '@components/ConfirmDialog';
import { EmptyState } from '@components/EmptyState';
import { FlashCard } from './FlashCard';
import { useFlashcardSession, type DeckFilter } from './useFlashcardSession';
import { useFavorites } from '@contexts/FavoritesContext';
import { useT } from '@hooks/useT';

export function SessionRunner({ filter }: { filter: DeckFilter }) {
  const t = useT();
  const nav = useNavigate();
  const { queue, current, done, index, onKnow, onRepeat } = useFlashcardSession(filter);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [confirmExit, setConfirmExit] = useState(false);

  if (queue.length === 0) {
    return (
      <EmptyState
        icon="🌱"
        title={t('flashcard.empty')}
        action={<Button onClick={() => nav(-1)}>{t('common.back')}</Button>}
      />
    );
  }

  if (done) {
    return (
      <EmptyState
        icon="🎉"
        title={t('flashcard.done')}
        action={<Button onClick={() => nav('/')}>{t('nav.home')}</Button>}
      />
    );
  }

  if (!current) return null;
  const fav = isFavorite(current.id);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-3">
      <div className="flex w-full items-center justify-between text-xs text-zinc-500">
        <button onClick={() => setConfirmExit(true)} aria-label={t('common.exit')} className="px-2">
          ✕
        </button>
        <span>
          {index + 1} / {queue.length}
        </span>
        <span style={{ width: 24 }} />
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full bg-brand-500 transition-all"
          style={{ width: `${(index / queue.length) * 100}%` }}
        />
      </div>

      <FlashCard item={current} />

      <div className="grid w-full grid-cols-3 gap-2">
        <Button variant="secondary" onClick={onRepeat}>
          {t('flashcard.repeat')}
        </Button>
        <Button variant="primary" onClick={onKnow}>
          {t('flashcard.iknow')}
        </Button>
        <Button variant="ghost" onClick={() => toggleFavorite(current.id)} aria-pressed={fav}>
          {fav ? '★' : '☆'}
        </Button>
      </div>

      <ConfirmDialog
        open={confirmExit}
        title={t('flashcard.exitConfirm')}
        onCancel={() => setConfirmExit(false)}
        onConfirm={() => {
          setConfirmExit(false);
          nav(-1);
        }}
        confirmLabel={t('common.exit')}
        destructive
      />
    </div>
  );
}
