import { useState } from 'react';
import { AppBar } from '@components/AppBar';
import { SearchBar } from '@components/SearchBar';
import { WordCard } from '@features/vocabulary/WordCard';
import { EmptyState } from '@components/EmptyState';
import { useSearch } from '@hooks/useSearch';
import { useT } from '@hooks/useT';

export default function SearchPage() {
  const t = useT();
  const [q, setQ] = useState('');
  const results = useSearch(q);

  return (
    <>
      <AppBar title={t('nav.search')} back />
      <div className="mx-auto flex max-w-md flex-col gap-3 px-4 py-2">
        <SearchBar
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          placeholder={t('vocab.search')}
          value={q}
          onChange={(e) => setQ(e.currentTarget.value)}
        />
        {q.trim() === '' ? null : results.length === 0 ? (
          <EmptyState icon="🔍" title={t('empty.search')} />
        ) : (
          <ul className="flex flex-col gap-2">
            {results.map((i) => (
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
