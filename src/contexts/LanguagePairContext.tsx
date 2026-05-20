import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useSettings } from './SettingsContext';
import { getPair } from '@data/language-pairs';
import type { LanguagePair, UiStrings } from '@app-types/language';
import type { VocabularyItem } from '@app-types/vocabulary';
import type { GrammarLesson } from '@app-types/grammar';

interface LangPairContextValue {
  pair: LanguagePair;
  vocabulary: readonly VocabularyItem[];
  grammar: readonly GrammarLesson[];
  uiStrings: UiStrings;
  loading: boolean;
}

const Ctx = createContext<LangPairContextValue | null>(null);

export function LanguagePairProvider({ children }: { children: ReactNode }) {
  const { global } = useSettings();
  const pair = getPair(global.activePairId);
  const [vocabulary, setVocabulary] = useState<readonly VocabularyItem[]>([]);
  const [grammar, setGrammar] = useState<readonly GrammarLesson[]>([]);
  const [uiStrings, setUiStrings] = useState<UiStrings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void Promise.all([
      pair.loaders.vocabulary(),
      pair.loaders.grammar(),
      pair.loaders.uiStrings(),
    ]).then(([v, g, u]) => {
      if (cancelled) return;
      setVocabulary(v);
      setGrammar(g);
      setUiStrings(u);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [pair]);

  const value = useMemo<LangPairContextValue>(
    () => ({ pair, vocabulary, grammar, uiStrings, loading }),
    [pair, vocabulary, grammar, uiStrings, loading],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLanguagePairContext(): LangPairContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLanguagePairContext must be used within LanguagePairProvider');
  return ctx;
}
