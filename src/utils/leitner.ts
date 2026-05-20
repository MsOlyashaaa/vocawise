import type { CardState, LeitnerBox } from '@app-types/progress';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const INTERVALS_MS: Readonly<Record<LeitnerBox, number>> = {
  1: 0,
  2: 1 * ONE_DAY_MS,
  3: 3 * ONE_DAY_MS,
  4: 7 * ONE_DAY_MS,
  5: 14 * ONE_DAY_MS,
};

export function rate(state: CardState, correct: boolean, now: number = Date.now()): CardState {
  const nextBox: LeitnerBox = correct ? (Math.min(5, state.box + 1) as LeitnerBox) : 1;
  const nextStreak = correct ? state.correctStreak + 1 : 0;
  return {
    ...state,
    box: nextBox,
    lastReviewedAt: now,
    nextDueAt: now + INTERVALS_MS[nextBox],
    correctStreak: nextStreak,
    totalSeen: state.totalSeen + 1,
    totalCorrect: state.totalCorrect + (correct ? 1 : 0),
    flaggedRepeat: correct ? false : state.flaggedRepeat,
    isLearned: nextBox === 5 && nextStreak >= 2,
  };
}

export function flagRepeat(state: CardState): CardState {
  return { ...state, flaggedRepeat: true };
}

export function toggleFavorite(state: CardState): CardState {
  return { ...state, isFavorite: !state.isFavorite };
}
