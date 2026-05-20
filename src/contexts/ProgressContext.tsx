import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from 'react';
import { useSettings } from './SettingsContext';
import { useLanguagePairContext } from './LanguagePairContext';
import { saveStateDebounced } from '@storage/localStore';
import type { PersistedState } from '@storage/schema';
import { newCardState, type CardState, type ProgressAggregate } from '@app-types/progress';
import { rate, flagRepeat } from '@utils/leitner';
import { toLocalISODate, diffInDays } from '@utils/dateUtils';
import { ACHIEVEMENTS } from '@app-types/achievements';
import type { VocabCategory, VocabularyItem } from '@app-types/vocabulary';

interface ProgressContextValue {
  cards: Readonly<Record<string, CardState>>;
  earnedAchievements: readonly string[];
  lessonsRead: readonly string[];
  aggregate: ProgressAggregate;
  rateCard: (itemId: string, correct: boolean) => string[];
  toggleRepeatLater: (itemId: string) => void;
  markLessonRead: (lessonId: string) => void;
  resetProgress: () => void;
  recordWordOfDay: (date: string, itemId: string) => void;
  recentlyEarned: string[];
  clearRecentlyEarned: () => void;
}

const Ctx = createContext<ProgressContextValue | null>(null);

interface InternalState {
  recentlyEarned: string[];
}

type Action = { type: 'set-recently-earned'; ids: string[] } | { type: 'clear-recently-earned' };

function reducer(_state: InternalState, action: Action): InternalState {
  if (action.type === 'set-recently-earned') return { recentlyEarned: action.ids };
  return { recentlyEarned: [] };
}

function computeAggregate(
  cards: Record<string, CardState>,
  vocabulary: readonly VocabularyItem[],
  streak: { currentStreak: number; longestStreak: number },
): ProgressAggregate {
  let learned = 0;
  let toRepeat = 0;
  let favorites = 0;
  let totalSeen = 0;
  let totalCorrect = 0;
  const now = Date.now();
  for (const c of Object.values(cards)) {
    if (c.isLearned) learned += 1;
    if (c.flaggedRepeat || c.nextDueAt <= now) toRepeat += 1;
    if (c.isFavorite) favorites += 1;
    totalSeen += c.totalSeen;
    totalCorrect += c.totalCorrect;
  }
  const accuracy = totalSeen > 0 ? totalCorrect / totalSeen : 0;

  const byCategory = new Map<VocabCategory, { learned: number; total: number }>();
  for (const v of vocabulary) {
    const slot = byCategory.get(v.category) ?? { learned: 0, total: 0 };
    slot.total += 1;
    if (cards[v.id]?.isLearned) slot.learned += 1;
    byCategory.set(v.category, slot);
  }
  const categoriesCompleted: string[] = [];
  for (const [cat, { learned: l, total: t }] of byCategory.entries()) {
    if (t > 0 && l === t) categoriesCompleted.push(cat);
  }

  return {
    wordsLearned: learned,
    wordsToRepeat: toRepeat,
    favoritesCount: favorites,
    totalSeen,
    totalCorrect,
    quizAccuracy: accuracy,
    categoriesCompleted,
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
  };
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { rawState, global } = useSettings();
  const { vocabulary } = useLanguagePairContext();
  const [internal, dispatch] = useReducer(reducer, { recentlyEarned: [] });

  const pairId = global.activePairId;
  const pairState = rawState.pairs[pairId];
  const cards = pairState?.cards ?? {};
  const earnedAchievements = pairState?.earnedAchievements ?? [];
  const lessonsRead = pairState?.lessonsRead ?? [];
  const streak = pairState?.streak ?? { currentStreak: 0, longestStreak: 0, lastActiveDay: '' };

  const aggregate = useMemo(
    () => computeAggregate(cards, vocabulary, streak),
    [cards, vocabulary, streak],
  );

  const persist = useCallback(
    (mutate: (draft: PersistedState) => void) => {
      const draft = structuredClone(rawState);
      mutate(draft);
      saveStateDebounced(draft);
      window.dispatchEvent(new CustomEvent('vocawise:state-mutated', { detail: draft }));
    },
    [rawState],
  );

  const rateCard = useCallback<ProgressContextValue['rateCard']>(
    (itemId, correct) => {
      const earnedNow: string[] = [];
      persist((draft) => {
        const pair = draft.pairs[pairId];
        if (!pair) return;
        const prev = pair.cards[itemId] ?? newCardState(itemId);
        const next = rate(prev, correct);
        pair.cards[itemId] = next;

        const today = toLocalISODate();
        if (pair.streak.lastActiveDay !== today) {
          if (pair.streak.lastActiveDay && diffInDays(today, pair.streak.lastActiveDay) === 1) {
            pair.streak.currentStreak += 1;
          } else {
            pair.streak.currentStreak = 1;
          }
          pair.streak.lastActiveDay = today;
          if (pair.streak.currentStreak > pair.streak.longestStreak) {
            pair.streak.longestStreak = pair.streak.currentStreak;
          }
        }

        const agg = computeAggregate(pair.cards, vocabulary, pair.streak);
        for (const ach of ACHIEVEMENTS) {
          if (ach.when(agg) && !pair.earnedAchievements.includes(ach.id)) {
            pair.earnedAchievements.push(ach.id);
            earnedNow.push(ach.id);
          }
        }
      });
      if (earnedNow.length > 0) dispatch({ type: 'set-recently-earned', ids: earnedNow });
      return earnedNow;
    },
    [pairId, persist, vocabulary],
  );

  const toggleRepeatLater = useCallback<ProgressContextValue['toggleRepeatLater']>(
    (itemId) => {
      persist((draft) => {
        const pair = draft.pairs[pairId];
        if (!pair) return;
        const prev = pair.cards[itemId] ?? newCardState(itemId);
        pair.cards[itemId] = prev.flaggedRepeat
          ? { ...prev, flaggedRepeat: false }
          : flagRepeat(prev);
      });
    },
    [pairId, persist],
  );

  const markLessonRead = useCallback<ProgressContextValue['markLessonRead']>(
    (lessonId) => {
      persist((draft) => {
        const pair = draft.pairs[pairId];
        if (!pair) return;
        if (!pair.lessonsRead.includes(lessonId)) pair.lessonsRead.push(lessonId);
      });
    },
    [pairId, persist],
  );

  const resetProgress = useCallback<ProgressContextValue['resetProgress']>(() => {
    persist((draft) => {
      draft.pairs[pairId] = {
        cards: {},
        streak: { currentStreak: 0, longestStreak: 0, lastActiveDay: '' },
        earnedAchievements: [],
        lessonsRead: [],
        wordOfDayHistory: [],
        settings: { sessionSize: 10, quizMode: 'due' },
      };
    });
  }, [pairId, persist]);

  const recordWordOfDay = useCallback<ProgressContextValue['recordWordOfDay']>(
    (date, itemId) => {
      persist((draft) => {
        const pair = draft.pairs[pairId];
        if (!pair) return;
        if (!pair.wordOfDayHistory.find((w) => w.date === date)) {
          pair.wordOfDayHistory.unshift({ date, itemId });
          if (pair.wordOfDayHistory.length > 30) pair.wordOfDayHistory.length = 30;
        }
      });
    },
    [pairId, persist],
  );

  const value = useMemo<ProgressContextValue>(
    () => ({
      cards,
      earnedAchievements,
      lessonsRead,
      aggregate,
      rateCard,
      toggleRepeatLater,
      markLessonRead,
      resetProgress,
      recordWordOfDay,
      recentlyEarned: internal.recentlyEarned,
      clearRecentlyEarned: () => dispatch({ type: 'clear-recently-earned' }),
    }),
    [
      cards,
      earnedAchievements,
      lessonsRead,
      aggregate,
      rateCard,
      toggleRepeatLater,
      markLessonRead,
      resetProgress,
      recordWordOfDay,
      internal.recentlyEarned,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
