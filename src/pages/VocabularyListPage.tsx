import { useMemo, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { AppBar } from '@components/AppBar';
import { SearchBar } from '@components/SearchBar';
import { Pill } from '@components/Pill';
import { WordCard } from '@features/vocabulary/WordCard';
import { EmptyState } from '@components/EmptyState';
import { useVocabulary } from '@hooks/useVocabulary';
import { useProgress } from '@contexts/ProgressContext';
import {
  CATEGORIES,
  CATEGORY_LABELS_UK,
  type Difficulty,
  type VocabCategory,
} from '@app-types/vocabulary';
import { useT } from '@hooks/useT';

const DIFFS: (Difficulty | 'all')[] = ['all', 'easy', 'medium', 'hard'];
const STATUSES = ['all', 'learned', 'unlearned'] as const;
type Status = (typeof STATUSES)[number];

export default function VocabularyListPage() {
  const t = useT();
  const { category } = useParams<{ category: string }>();
  const cat = category as VocabCategory | undefined;
  const items = useVocabulary(cat);
  const { cards } = useProgress();

  const [query, setQuery] = useState('');
  const [diff, setDiff] = useState<Difficulty | 'all'>('all');
  const [status, setStatus] = useState<Status>('all');
  const [tag, setTag] = useState<string>('all');

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const i of items) {
      for (const t of i.tags ?? []) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.toLocaleLowerCase().trim();
    return items.filter((i) => {
      if (diff !== 'all' && i.difficulty !== diff) return false;
      if (tag !== 'all' && !(i.tags ?? []).includes(tag)) return false;
      if (status !== 'all') {
        const learned = cards[i.id]?.isLearned === true;
        if (status === 'learned' && !learned) return false;
        if (status === 'unlearned' && learned) return false;
      }
      if (q && !i.target.toLocaleLowerCase().includes(q) && !i.base.toLocaleLowerCase().includes(q))
        return false;
      return true;
    });
  }, [items, cards, query, diff, status, tag]);

  if (!category || !CATEGORIES.includes(category as VocabCategory)) {
    return <Navigate to="/vocabulary" replace />;
  }

  return (
    <>
      <AppBar
        title={CATEGORY_LABELS_UK[cat!]}
        subtitle={`${filtered.length} / ${items.length}`}
        back
      />
      <div className="mx-auto flex max-w-md flex-col gap-3 px-4 py-2">
        <SearchBar
          placeholder={t('vocab.search')}
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
        />
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {DIFFS.map((d) => (
            <button key={d} onClick={() => setDiff(d)} className="shrink-0">
              <Pill tone={diff === d ? 'brand' : 'neutral'}>
                {d === 'all' ? t('common.all') : d}
              </Pill>
            </button>
          ))}
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setStatus(s)} className="shrink-0">
              <Pill tone={status === s ? 'accent' : 'neutral'}>
                {s === 'all'
                  ? t('common.all')
                  : s === 'learned'
                    ? t('vocab.filter.learned')
                    : t('vocab.filter.unlearned')}
              </Pill>
            </button>
          ))}
        </div>
        {tags.length > 0 ? (
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            <button onClick={() => setTag('all')} className="shrink-0">
              <Pill tone={tag === 'all' ? 'brand' : 'neutral'}>усі групи</Pill>
            </button>
            {tags.map(([tg, n]) => (
              <button key={tg} onClick={() => setTag(tg)} className="shrink-0">
                <Pill tone={tag === tg ? 'brand' : 'neutral'}>
                  {tg} · {n}
                </Pill>
              </button>
            ))}
          </div>
        ) : null}
        {filtered.length === 0 ? (
          <EmptyState title={t('common.empty')} />
        ) : (
          <ul className="flex flex-col gap-2">
            {filtered.map((item) => (
              <li key={item.id}>
                <WordCard item={item} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
