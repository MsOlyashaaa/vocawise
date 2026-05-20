import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { useSettings } from './SettingsContext';
import { saveStateDebounced } from '@storage/localStore';
import { newCardState } from '@app-types/progress';

interface FavoritesValue {
  isFavorite: (itemId: string) => boolean;
  toggleFavorite: (itemId: string) => void;
  favoriteIds: string[];
}

const Ctx = createContext<FavoritesValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { rawState, global } = useSettings();
  const pairId = global.activePairId;
  const cards = rawState.pairs[pairId]?.cards ?? {};

  const favoriteIds = useMemo(
    () =>
      Object.values(cards)
        .filter((c) => c.isFavorite)
        .map((c) => c.itemId),
    [cards],
  );

  const isFavorite = useCallback((itemId: string) => cards[itemId]?.isFavorite === true, [cards]);

  const toggleFavorite = useCallback(
    (itemId: string) => {
      const draft = structuredClone(rawState);
      const pair = draft.pairs[pairId];
      if (!pair) return;
      const prev = pair.cards[itemId] ?? newCardState(itemId);
      pair.cards[itemId] = { ...prev, isFavorite: !prev.isFavorite };
      saveStateDebounced(draft);
      window.dispatchEvent(new CustomEvent('vocawise:state-mutated', { detail: draft }));
    },
    [pairId, rawState],
  );

  const value = useMemo<FavoritesValue>(
    () => ({ isFavorite, toggleFavorite, favoriteIds }),
    [isFavorite, toggleFavorite, favoriteIds],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFavorites(): FavoritesValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
