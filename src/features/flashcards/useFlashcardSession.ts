import { useCallback, useMemo, useRef, useState } from 'react';
import { useSettings } from '@contexts/SettingsContext';
import { useProgress } from '@contexts/ProgressContext';
import { useLanguagePairContext } from '@contexts/LanguagePairContext';
import { buildSession } from '@utils/sessionPicker';
import { pickN } from '@utils/shuffle';
import type { VocabularyItem, VocabCategory } from '@app-types/vocabulary';

export type DeckFilter =
  | { kind: 'all'; tag?: string | undefined }
  | { kind: 'category'; category: VocabCategory; tag?: string | undefined }
  | { kind: 'due'; tag?: string | undefined }
  | { kind: 'favorites' }
  | { kind: 'repeat' }
  | { kind: 'single'; id: string };

export function useFlashcardSession(filter: DeckFilter, sizeOverride?: number) {
  const { vocabulary } = useLanguagePairContext();
  const { cards, rateCard, toggleRepeatLater } = useProgress();
  const { perPair, global } = useSettings();
  const defaultSize = perPair[global.activePairId]?.sessionSize ?? 10;
  const size = sizeOverride ?? defaultSize;

  const cardsRef = useRef(cards);
  cardsRef.current = cards;

  const queue = useMemo<VocabularyItem[]>(() => {
    if (filter.kind === 'single') {
      const item = vocabulary.find((v) => v.id === filter.id);
      return item ? [item] : [];
    }
    if (filter.kind === 'all' || filter.kind === 'category') {
      const tag = filter.tag;
      const pool = vocabulary.filter((v) => {
        if (filter.kind === 'category' && v.category !== filter.category) return false;
        if (tag && !(v.tags ?? []).includes(tag)) return false;
        return true;
      });
      return pickN(pool, size);
    }
    return buildSession({
      vocabulary,
      cards: cardsRef.current,
      size,
      filter: (item, state) => {
        switch (filter.kind) {
          case 'due':
            if (filter.tag && !(item.tags ?? []).includes(filter.tag)) return false;
            return state ? state.nextDueAt <= Date.now() || state.flaggedRepeat : true;
          case 'favorites':
            return state?.isFavorite === true;
          case 'repeat':
            return state?.flaggedRepeat === true;
        }
      },
    });
    // Intentionally exclude `cards` from deps: queue must stay frozen during
    // a session, otherwise rateCard mutations re-shuffle the deck mid-click.
  }, [vocabulary, size, filter]);

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
