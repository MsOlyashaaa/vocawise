import { useCallback } from 'react';
import { useProgress } from '@contexts/ProgressContext';

export function useLeitner() {
  const { rateCard, toggleRepeatLater } = useProgress();
  const markCorrect = useCallback((id: string) => rateCard(id, true), [rateCard]);
  const markWrong = useCallback((id: string) => rateCard(id, false), [rateCard]);
  return { rateCard, markCorrect, markWrong, toggleRepeatLater };
}
