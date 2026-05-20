import { useMemo } from 'react';
import { AppBar } from '@components/AppBar';
import { CategoryTile } from '@features/vocabulary/CategoryTile';
import { useLanguagePairContext } from '@contexts/LanguagePairContext';
import { useProgress } from '@contexts/ProgressContext';
import { CATEGORIES, type VocabCategory } from '@app-types/vocabulary';
import { useT } from '@hooks/useT';

export default function VocabularyCategoriesPage() {
  const t = useT();
  const { vocabulary } = useLanguagePairContext();
  const { cards } = useProgress();

  const stats = useMemo(() => {
    const byCat = new Map<VocabCategory, { total: number; learned: number }>();
    for (const v of vocabulary) {
      const slot = byCat.get(v.category) ?? { total: 0, learned: 0 };
      slot.total += 1;
      if (cards[v.id]?.isLearned) slot.learned += 1;
      byCat.set(v.category, slot);
    }
    return byCat;
  }, [vocabulary, cards]);

  return (
    <>
      <AppBar title={t('vocab.categories')} />
      <div className="mx-auto grid max-w-md grid-cols-2 gap-3 px-4 py-2">
        {CATEGORIES.map((c) => {
          const s = stats.get(c) ?? { total: 0, learned: 0 };
          return <CategoryTile key={c} category={c} total={s.total} learned={s.learned} />;
        })}
      </div>
    </>
  );
}
