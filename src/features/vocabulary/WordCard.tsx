import { Link } from 'react-router-dom';
import { Card } from '@components/Card';
import { Pill } from '@components/Pill';
import { DifficultyDot } from '@components/DifficultyDot';
import { useFavorites } from '@contexts/FavoritesContext';
import { transliteratePl } from '@utils/transliteratePl';
import type { VocabularyItem } from '@app-types/vocabulary';

interface Props {
  item: VocabularyItem;
  showCategory?: boolean;
}

export function WordCard({ item, showCategory = false }: Props) {
  const { isFavorite } = useFavorites();
  return (
    <Link to={`/vocabulary/word/${encodeURIComponent(item.id)}`} className="block">
      <Card
        padding="md"
        className="flex items-center gap-3 transition hover:bg-surface-muted active:scale-[0.99]"
      >
        <div className="text-3xl" aria-hidden>
          {item.emoji ?? '📖'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-display text-lg font-bold">{item.target}</span>
            <DifficultyDot value={item.difficulty} />
            {isFavorite(item.id) ? <span aria-hidden>★</span> : null}
          </div>
          <div className="truncate text-xs italic text-zinc-400">
            [{transliteratePl(item.target)}]
          </div>
          <div className="truncate text-sm text-zinc-500">{item.base}</div>
        </div>
        {showCategory ? <Pill tone="neutral">{item.category}</Pill> : null}
      </Card>
    </Link>
  );
}
