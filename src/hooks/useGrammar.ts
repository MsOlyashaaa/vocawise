import { useMemo } from 'react';
import { useLanguagePairContext } from '@contexts/LanguagePairContext';
import type { GrammarLesson, GrammarTopic } from '@app-types/grammar';

export function useGrammar(): readonly GrammarLesson[] {
  return useLanguagePairContext().grammar;
}

export function useGrammarLesson(id: string | undefined): GrammarLesson | undefined {
  const lessons = useGrammar();
  return useMemo(() => (id ? lessons.find((l) => l.id === id) : undefined), [lessons, id]);
}

export function useGrammarByTopic(): Record<GrammarTopic, GrammarLesson[]> {
  const lessons = useGrammar();
  return useMemo(() => {
    const out: Record<GrammarTopic, GrammarLesson[]> = {
      cases: [],
      gender: [],
      plurals: [],
      verbs: [],
      adjectives: [],
      other: [],
    };
    for (const l of lessons) out[l.topic].push(l);
    return out;
  }, [lessons]);
}
