import type { CardState } from '@app-types/progress';
import type { VocabularyItem } from '@app-types/vocabulary';
import { weightedSample } from './shuffle';

export interface SessionInput {
  vocabulary: readonly VocabularyItem[];
  cards: Readonly<Record<string, CardState>>;
  size: number;
  now?: number;
  filter?: (item: VocabularyItem, state: CardState | undefined) => boolean;
}

interface Eligible {
  item: VocabularyItem;
  state: CardState | undefined;
  weight: number;
}

function weightFor(state: CardState | undefined, flagged: boolean): number {
  if (flagged) return 5;
  if (!state) return 2;
  if (state.box === 1) return 3;
  if (state.box === 5) return 0.3;
  return 1;
}

export function buildSession(input: SessionInput): VocabularyItem[] {
  const now = input.now ?? Date.now();
  const eligibles: Eligible[] = [];

  for (const item of input.vocabulary) {
    const state = input.cards[item.id];
    if (input.filter && !input.filter(item, state)) continue;
    const flagged = state?.flaggedRepeat === true;
    const due = state ? state.nextDueAt <= now : true;
    if (!flagged && !due) continue;
    eligibles.push({ item, state, weight: weightFor(state, flagged) });
  }

  if (eligibles.length === 0) return [];
  return weightedSample(
    eligibles.map((e) => ({ item: e.item, weight: e.weight })),
    input.size,
  );
}
