import { useSearchParams } from 'react-router-dom';
import { SessionRunner } from '@features/flashcards/SessionRunner';
import type { DeckFilter } from '@features/flashcards/useFlashcardSession';
import { CATEGORIES, type VocabCategory } from '@app-types/vocabulary';

function parseFilter(params: URLSearchParams): DeckFilter {
  const deck = params.get('deck') ?? 'due';
  if (deck === 'all') return { kind: 'all' };
  if (deck === 'favorites') return { kind: 'favorites' };
  if (deck === 'repeat') return { kind: 'repeat' };
  if (deck === 'category') {
    const c = (params.get('category') ?? '') as VocabCategory;
    if (CATEGORIES.includes(c)) return { kind: 'category', category: c };
  }
  return { kind: 'due' };
}

export default function FlashcardsSessionPage() {
  const [params] = useSearchParams();
  const filter = parseFilter(params);
  return <SessionRunner filter={filter} />;
}
