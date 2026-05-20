import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { loadState, saveStateDebounced } from '@storage/localStore';
import type { PersistedState } from '@storage/schema';
import { DEFAULT_PAIR_ID } from '@data/language-pairs';

interface GlobalSettings {
  activePairId: string;
  theme: 'light' | 'dark';
}

interface PairSettings {
  sessionSize: number;
  quizMode: 'all' | 'due';
}

type SettingsAction =
  | { type: 'set-active-pair'; pairId: string }
  | { type: 'set-theme'; theme: 'light' | 'dark' }
  | { type: 'set-session-size'; pairId: string; size: number }
  | { type: 'set-quiz-mode'; pairId: string; mode: 'all' | 'due' }
  | { type: 'replace'; state: PersistedState };

interface SettingsState {
  global: GlobalSettings;
  perPair: Record<string, PairSettings>;
  hydrated: boolean;
  raw: PersistedState;
}

function fromRaw(raw: PersistedState): SettingsState {
  const perPair: Record<string, PairSettings> = {};
  for (const [pid, p] of Object.entries(raw.pairs)) {
    perPair[pid] = { sessionSize: p.settings.sessionSize, quizMode: p.settings.quizMode };
  }
  return {
    global: { activePairId: raw.globalSettings.activePairId, theme: raw.globalSettings.theme },
    perPair,
    hydrated: true,
    raw,
  };
}

function initial(): SettingsState {
  return fromRaw(loadState(DEFAULT_PAIR_ID));
}

function reducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case 'replace':
      return fromRaw(action.state);
    case 'set-active-pair': {
      const next = structuredClone(state.raw);
      next.globalSettings.activePairId = action.pairId;
      next.pairs[action.pairId] ??= {
        cards: {},
        streak: { currentStreak: 0, longestStreak: 0, lastActiveDay: '' },
        earnedAchievements: [],
        lessonsRead: [],
        wordOfDayHistory: [],
        settings: { sessionSize: 10, quizMode: 'due' },
      };
      saveStateDebounced(next);
      return fromRaw(next);
    }
    case 'set-theme': {
      const next = structuredClone(state.raw);
      next.globalSettings.theme = action.theme;
      saveStateDebounced(next);
      return fromRaw(next);
    }
    case 'set-session-size': {
      const next = structuredClone(state.raw);
      const pair = next.pairs[action.pairId];
      if (pair) pair.settings.sessionSize = action.size;
      saveStateDebounced(next);
      return fromRaw(next);
    }
    case 'set-quiz-mode': {
      const next = structuredClone(state.raw);
      const pair = next.pairs[action.pairId];
      if (pair) pair.settings.quizMode = action.mode;
      saveStateDebounced(next);
      return fromRaw(next);
    }
  }
}

interface SettingsContextValue {
  global: GlobalSettings;
  perPair: Record<string, PairSettings>;
  rawState: PersistedState;
  setActivePair: (pairId: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setSessionSize: (pairId: string, size: number) => void;
  setQuizMode: (pairId: string, mode: 'all' | 'due') => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initial);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.global.theme === 'dark');
  }, [state.global.theme]);

  useEffect(() => {
    function onMutated(e: Event) {
      const ev = e as CustomEvent<PersistedState>;
      if (!ev.detail) return;
      dispatch({ type: 'replace', state: ev.detail });
    }
    window.addEventListener('vocawise:state-mutated', onMutated);
    return () => window.removeEventListener('vocawise:state-mutated', onMutated);
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({
      global: state.global,
      perPair: state.perPair,
      rawState: state.raw,
      setActivePair: (pairId) => dispatch({ type: 'set-active-pair', pairId }),
      setTheme: (theme) => dispatch({ type: 'set-theme', theme }),
      setSessionSize: (pairId, size) => dispatch({ type: 'set-session-size', pairId, size }),
      setQuizMode: (pairId, mode) => dispatch({ type: 'set-quiz-mode', pairId, mode }),
    }),
    [state],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
