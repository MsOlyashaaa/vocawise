export type VocabCategory = 'nouns' | 'verbs' | 'adjectives' | 'common' | 'phrases';
export type Difficulty = 'easy' | 'medium' | 'hard';

export type CaseKey = 'nom' | 'gen' | 'dat' | 'acc' | 'ins' | 'loc' | 'voc';

export interface NounCases {
  readonly gen?: string;
  readonly dat?: string;
  readonly acc?: string;
  readonly ins?: string;
  readonly loc?: string;
  readonly voc?: string;
  readonly genPl?: string;
  readonly datPl?: string;
  readonly accPl?: string;
  readonly insPl?: string;
  readonly locPl?: string;
}

export interface VerbPastForms {
  readonly onM?: string;
  readonly onaF?: string;
  readonly onN?: string;
  readonly mPersPl?: string;
  readonly otherPl?: string;
}

export interface VocabularyMeta {
  gender?: 'masc' | 'fem' | 'neut';
  plural?: string;
  animacy?: 'animate' | 'inanimate';
  cases?: NounCases;
  aspect?: 'perf' | 'imperf';
  aspectPartner?: string;
  conjugation?: Readonly<Record<string, string>>;
  past?: VerbPastForms;
}

export interface VocabularyItem {
  id: string;
  pairId: string;
  category: VocabCategory;
  difficulty: Difficulty;
  target: string;
  base: string;
  exampleTarget?: string;
  exampleBase?: string;
  tags?: readonly string[];
  emoji?: string;
  imageUrl?: string;
  association?: string;
  similarSounding?: string;
  meta?: VocabularyMeta;
}

export const CATEGORIES: readonly VocabCategory[] = [
  'nouns',
  'verbs',
  'adjectives',
  'common',
  'phrases',
] as const;

export const CATEGORY_LABELS_UK: Readonly<Record<VocabCategory, string>> = {
  nouns: 'Іменники',
  verbs: 'Дієслова',
  adjectives: 'Прикметники',
  common: 'Часті слова',
  phrases: 'Фрази',
};

export const CATEGORY_EMOJI: Readonly<Record<VocabCategory, string>> = {
  nouns: '📦',
  verbs: '🏃',
  adjectives: '🎨',
  common: '💬',
  phrases: '🗣️',
};

export const DIFFICULTY_LABELS_UK: Readonly<Record<Difficulty, string>> = {
  easy: 'легко',
  medium: 'середньо',
  hard: 'важко',
};
