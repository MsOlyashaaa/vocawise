import { useMemo } from 'react';
import { useLanguagePairContext } from '@contexts/LanguagePairContext';
import { searchItems } from '@utils/searchScore';
import type { VocabularyItem } from '@app-types/vocabulary';

export function useSearch(query: string): VocabularyItem[] {
  const { vocabulary } = useLanguagePairContext();
  return useMemo(
    () =>
      searchItems(vocabulary, query, [
        (v) => v.target,
        (v) => v.base,
        (v) => v.tags?.join(' '),
      ]).map((h) => h.item),
    [vocabulary, query],
  );
}
