import type { CardState, StreakState } from '@app-types/progress';

export const STORAGE_KEY = 'vocawise:v1';
export const SCHEMA_VERSION = 1 as const;

export interface PerPairState {
  cards: Record<string, CardState>;
  streak: StreakState;
  earnedAchievements: string[];
  lessonsRead: string[];
  wordOfDayHistory: { date: string; itemId: string }[];
  settings: { sessionSize: number; quizMode: 'all' | 'due' };
}

export interface PersistedState {
  schemaVersion: typeof SCHEMA_VERSION;
  pairs: Record<string, PerPairState>;
  globalSettings: { activePairId: string; theme: 'light' | 'dark' };
}

export function emptyPairState(): PerPairState {
  return {
    cards: {},
    streak: { currentStreak: 0, longestStreak: 0, lastActiveDay: '' },
    earnedAchievements: [],
    lessonsRead: [],
    wordOfDayHistory: [],
    settings: { sessionSize: 10, quizMode: 'due' },
  };
}

export function emptyState(activePairId: string): PersistedState {
  return {
    schemaVersion: SCHEMA_VERSION,
    pairs: { [activePairId]: emptyPairState() },
    globalSettings: { activePairId, theme: 'light' },
  };
}

export function migrate(raw: unknown, defaultPairId: string): PersistedState {
  if (!raw || typeof raw !== 'object') return emptyState(defaultPairId);
  const obj = raw as Partial<PersistedState>;
  if (obj.schemaVersion === SCHEMA_VERSION && obj.pairs && obj.globalSettings) {
    return obj as PersistedState;
  }
  return emptyState(defaultPairId);
}
