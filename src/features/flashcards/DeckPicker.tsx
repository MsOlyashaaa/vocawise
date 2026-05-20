import { Link } from 'react-router-dom';
import { Card } from '@components/Card';
import { Pill } from '@components/Pill';
import {
  CATEGORIES,
  CATEGORY_EMOJI,
  CATEGORY_LABELS_UK,
  type VocabCategory,
} from '@app-types/vocabulary';
import { useT } from '@hooks/useT';

interface DeckLinkProps {
  to: string;
  emoji: string;
  title: string;
  subtitle?: string;
}

function DeckLink({ to, emoji, title, subtitle }: DeckLinkProps) {
  return (
    <Link to={to}>
      <Card padding="sm" className="flex items-center gap-3 active:scale-[0.99]">
        <div className="text-3xl" aria-hidden>
          {emoji}
        </div>
        <div className="flex-1">
          <div className="font-display font-bold">{title}</div>
          {subtitle ? <div className="text-xs text-zinc-500">{subtitle}</div> : null}
        </div>
        <Pill tone="brand">▶︎</Pill>
      </Card>
    </Link>
  );
}

export function DeckPicker() {
  const t = useT();
  return (
    <div className="flex flex-col gap-3">
      <DeckLink to="/flashcards/session?deck=due" emoji="⏰" title={t('flashcard.deck.due')} />
      <DeckLink to="/flashcards/session?deck=all" emoji="🗂️" title={t('flashcard.deck.all')} />
      <DeckLink
        to="/flashcards/session?deck=favorites"
        emoji="⭐"
        title={t('flashcard.deck.favorites')}
      />
      <DeckLink
        to="/flashcards/session?deck=repeat"
        emoji="🔁"
        title={t('flashcard.deck.repeatLater')}
      />
      <h3 className="mt-2 font-display font-bold">{t('flashcard.deck.byCategory')}</h3>
      {CATEGORIES.map((c: VocabCategory) => (
        <DeckLink
          key={c}
          to={`/flashcards/session?deck=category&category=${c}`}
          emoji={CATEGORY_EMOJI[c]}
          title={CATEGORY_LABELS_UK[c]}
        />
      ))}
    </div>
  );
}
