import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { MultipleChoiceMode } from '@features/quiz/MultipleChoiceMode';
import { MatchPairsMode } from '@features/quiz/MatchPairsMode';
import { FillBlankMode } from '@features/quiz/FillBlankMode';
import { WordFormMode } from '@features/quiz/WordFormMode';
import { RepeatDifficultMode } from '@features/quiz/RepeatDifficultMode';
import { AssociationMode } from '@features/quiz/AssociationMode';
import { GrammarDrillMode } from '@features/quiz/GrammarDrillMode';
import type { DeckFilter } from '@features/flashcards/useFlashcardSession';
import { CATEGORIES, type VocabCategory } from '@app-types/vocabulary';

function parseFilter(params: URLSearchParams): DeckFilter {
  const cat = params.get('cat');
  const tag = params.get('tag') ?? undefined;
  if (cat && CATEGORIES.includes(cat as VocabCategory)) {
    return { kind: 'category', category: cat as VocabCategory, tag };
  }
  if (tag) return { kind: 'all', tag };
  return { kind: 'all' };
}

function parseCount(params: URLSearchParams): number | undefined {
  const n = Number(params.get('count'));
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

export default function PracticeSessionPage() {
  const { mode } = useParams<{ mode: string }>();
  const [params] = useSearchParams();
  const filter = parseFilter(params);
  const count = parseCount(params);

  switch (mode) {
    case 'multipleChoice':
      return <MultipleChoiceMode filter={filter} count={count} />;
    case 'matchPairs':
      return <MatchPairsMode filter={filter} count={count} />;
    case 'fillBlank':
      return <FillBlankMode filter={filter} count={count} />;
    case 'wordForm':
      return <WordFormMode filter={filter} count={count} />;
    case 'repeatDifficult':
      return <RepeatDifficultMode />;
    case 'association':
      return <AssociationMode filter={filter} count={count} />;
    case 'grammar':
      return <GrammarDrillMode />;
    default:
      return <Navigate to="/practice" replace />;
  }
}
