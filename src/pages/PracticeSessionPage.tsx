import { Navigate, useParams } from 'react-router-dom';
import { MultipleChoiceMode } from '@features/quiz/MultipleChoiceMode';
import { MatchPairsMode } from '@features/quiz/MatchPairsMode';
import { FillBlankMode } from '@features/quiz/FillBlankMode';
import { WordFormMode } from '@features/quiz/WordFormMode';
import { RepeatDifficultMode } from '@features/quiz/RepeatDifficultMode';
import { AssociationMode } from '@features/quiz/AssociationMode';
import { GrammarDrillMode } from '@features/quiz/GrammarDrillMode';
import type { DeckFilter } from '@features/flashcards/useFlashcardSession';

const FILTER_DUE: DeckFilter = { kind: 'due' };

export default function PracticeSessionPage() {
  const { mode } = useParams<{ mode: string }>();
  switch (mode) {
    case 'multipleChoice':
      return <MultipleChoiceMode filter={FILTER_DUE} />;
    case 'matchPairs':
      return <MatchPairsMode filter={FILTER_DUE} />;
    case 'fillBlank':
      return <FillBlankMode filter={FILTER_DUE} />;
    case 'wordForm':
      return <WordFormMode filter={FILTER_DUE} />;
    case 'repeatDifficult':
      return <RepeatDifficultMode />;
    case 'association':
      return <AssociationMode filter={FILTER_DUE} />;
    case 'grammar':
      return <GrammarDrillMode />;
    default:
      return <Navigate to="/practice" replace />;
  }
}
