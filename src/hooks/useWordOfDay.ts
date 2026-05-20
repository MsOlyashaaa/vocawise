import { useEffect, useMemo } from 'react';
import { useLanguagePairContext } from '@contexts/LanguagePairContext';
import { useProgress } from '@contexts/ProgressContext';
import { useSettings } from '@contexts/SettingsContext';
import { hash32 } from '@utils/deterministicHash';
import { toLocalISODate } from '@utils/dateUtils';
import type { VocabularyItem } from '@app-types/vocabulary';

export function useWordOfDay(): VocabularyItem | undefined {
  const { vocabulary } = useLanguagePairContext();
  const { global } = useSettings();
  const { recordWordOfDay } = useProgress();

  const word = useMemo(() => {
    if (vocabulary.length === 0) return undefined;
    const dayKey = toLocalISODate();
    const idx = hash32(dayKey + ':' + global.activePairId) % vocabulary.length;
    return vocabulary[idx];
  }, [vocabulary, global.activePairId]);

  useEffect(() => {
    if (word) recordWordOfDay(toLocalISODate(), word.id);
  }, [word, recordWordOfDay]);

  return word;
}
