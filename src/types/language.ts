import type { VocabularyItem } from './vocabulary';
import type { GrammarLesson } from './grammar';

export type LangCode = 'pl' | 'uk' | 'en' | 'de' | (string & {});

export type UiStrings = Readonly<Record<string, string>>;

export interface LanguagePair {
  id: string;
  targetLanguage: LangCode;
  baseLanguage: LangCode;
  targetName: string;
  baseName: string;
  flagTarget: string;
  flagBase: string;
  loaders: {
    vocabulary: () => Promise<VocabularyItem[]>;
    grammar: () => Promise<GrammarLesson[]>;
    uiStrings: () => Promise<UiStrings>;
  };
}
