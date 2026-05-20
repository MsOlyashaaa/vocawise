import { AppBar } from '@components/AppBar';
import { WordCard } from '@features/vocabulary/WordCard';
import { EmptyState } from '@components/EmptyState';
import { useFavorites } from '@contexts/FavoritesContext';
import { useLanguagePairContext } from '@contexts/LanguagePairContext';
import { useT } from '@hooks/useT';

export default function FavoritesPage() {
  const t = useT();
  const { favoriteIds } = useFavorites();
  const { vocabulary } = useLanguagePairContext();
  const items = vocabulary.filter((v) => favoriteIds.includes(v.id));

  return (
    <>
      <AppBar title={t('nav.favorites')} back />
      <div className="mx-auto max-w-md px-4 py-2">
        {items.length === 0 ? (
          <EmptyState icon="⭐" title={t('empty.favorites')} />
        ) : (
          <ul className="flex flex-col gap-2">
            {items.map((i) => (
              <li key={i.id}>
                <WordCard item={i} showCategory />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
