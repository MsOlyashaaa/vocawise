import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@components/Button';
import { ConfirmDialog } from '@components/ConfirmDialog';
import { EmptyState } from '@components/EmptyState';
import { useT } from '@hooks/useT';

interface Props {
  title: string;
  total: number;
  index: number;
  score: number;
  done: boolean;
  children: ReactNode;
}

export function PracticeFrame({ title, total, index, score, done, children }: Props) {
  const t = useT();
  const nav = useNavigate();
  const [confirmExit, setConfirmExit] = useState(false);

  if (total === 0) {
    return (
      <EmptyState
        icon="🌱"
        title={t('flashcard.empty')}
        action={<Button onClick={() => nav(-1)}>{t('common.back')}</Button>}
      />
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 px-4 py-3">
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <button onClick={() => setConfirmExit(true)} aria-label={t('common.exit')} className="px-2">
          ✕
        </button>
        <span className="font-semibold">{title}</span>
        <span>
          {index} / {total} · {t('practice.score')}: {score}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full bg-brand-500 transition-all"
          style={{ width: `${(index / total) * 100}%` }}
        />
      </div>
      {done ? (
        <EmptyState
          icon="🎉"
          title={t('flashcard.done')}
          description={`${t('practice.score')}: ${score} / ${total}`}
          action={<Button onClick={() => nav('/practice')}>{t('common.back')}</Button>}
        />
      ) : (
        children
      )}
      <ConfirmDialog
        open={confirmExit}
        title={t('flashcard.exitConfirm')}
        onCancel={() => setConfirmExit(false)}
        onConfirm={() => {
          setConfirmExit(false);
          nav('/practice');
        }}
        confirmLabel={t('common.exit')}
        destructive
      />
    </div>
  );
}
