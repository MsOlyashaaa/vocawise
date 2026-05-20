import { useMemo } from 'react';
import { useLanguagePairContext } from '@contexts/LanguagePairContext';
import type { VocabCategory, VocabularyItem } from '@app-types/vocabulary';

export function useVocabulary(category?: VocabCategory): readonly VocabularyItem[] {
  const { vocabulary } = useLanguagePairContext();
  return useMemo(
    () => (category ? vocabulary.filter((v) => v.category === category) : vocabulary),
    [vocabulary, category],
  );
}

export function useVocabularyById(itemId: string | undefined): VocabularyItem | undefined {
  const { vocabulary } = useLanguagePairContext();
  return useMemo(
    () => (itemId ? vocabulary.find((v) => v.id === itemId) : undefined),
    [vocabulary, itemId],
  );
}
