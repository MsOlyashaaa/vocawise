import { useCallback, useMemo, useState } from 'react';
import { useSettings } from '@contexts/SettingsContext';
import { useProgress } from '@contexts/ProgressContext';
import { useLanguagePairContext } from '@contexts/LanguagePairContext';
import { buildSession } from '@utils/sessionPicker';
import type { VocabularyItem, VocabCategory } from '@app-types/vocabulary';

export type DeckFilter =
  | { kind: 'all' }
  | { kind: 'category'; category: VocabCategory }
  | { kind: 'due' }
  | { kind: 'favorites' }
  | { kind: 'repeat' };

export function useFlashcardSession(filter: DeckFilter) {
  const { vocabulary } = useLanguagePairContext();
  const { cards, rateCard, toggleRepeatLater } = useProgress();
  const { perPair, global } = useSettings();
  const size = perPair[global.activePairId]?.sessionSize ?? 10;

  const queue = useMemo<VocabularyItem[]>(() => {
    return buildSession({
      vocabulary,
      cards,
      size,
      filter: (item, state) => {
        switch (filter.kind) {
          case 'all':
            return true;
          case 'category':
            return item.category === filter.category;
          case 'due':
            return state ? state.nextDueAt <= Date.now() || state.flaggedRepeat : true;
          case 'favorites':
            return state?.isFavorite === true;
          case 'repeat':
            return state?.flaggedRepeat === true;
        }
      },
    });
  }, [vocabulary, cards, size, filter]);

  const [index, setIndex] = useState(0);
  const current = queue[index];
  const done = queue.length === 0 || index >= queue.length;

  const onKnow = useCallback(() => {
    if (current) rateCard(current.id, true);
    setIndex((i) => i + 1);
  }, [current, rateCard]);

  const onRepeat = useCallback(() => {
    if (current) {
      toggleRepeatLater(current.id);
      rateCard(current.id, false);
    }
    setIndex((i) => i + 1);
  }, [current, rateCard, toggleRepeatLater]);

  return { queue, current, done, index, onKnow, onRepeat };
}
