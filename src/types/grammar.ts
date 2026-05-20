import type { Difficulty } from './vocabulary';

export type GrammarTopic = 'cases' | 'gender' | 'plurals' | 'verbs' | 'adjectives' | 'other';

export const GRAMMAR_TOPIC_LABELS_UK: Readonly<Record<GrammarTopic, string>> = {
  cases: 'Відмінки',
  gender: 'Рід',
  plurals: 'Множина',
  verbs: 'Дієслова',
  adjectives: 'Прикметники',
  other: 'Інше',
};

export interface GrammarExample {
  target: string;
  base: string;
  note?: string;
}

export type GrammarBlock =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'example'; target: string; base: string }
  | { type: 'table'; headers: readonly string[]; rows: readonly (readonly string[])[] }
  | { type: 'note'; text: string };

export interface GrammarLesson {
  id: string;
  pairId: string;
  title: string;
  topic: GrammarTopic;
  difficulty: Difficulty;
  summary: string;
  body: readonly GrammarBlock[];
  examples: readonly GrammarExample[];
  related?: readonly string[];
}
