import type { LanguagePair } from '@app-types/language';

export const plUk: LanguagePair = {
  id: 'pl-uk',
  targetLanguage: 'pl',
  baseLanguage: 'uk',
  targetName: 'Польська',
  baseName: 'Українська',
  flagTarget: '🇵🇱',
  flagBase: '🇺🇦',
  loaders: {
    vocabulary: async () => {
      const [n, v, a, c, p] = await Promise.all([
        import('./vocabulary/nouns'),
        import('./vocabulary/verbs'),
        import('./vocabulary/adjectives'),
        import('./vocabulary/common'),
        import('./vocabulary/phrases'),
      ]);
      return [...n.default, ...v.default, ...a.default, ...c.default, ...p.default];
    },
    grammar: async () => (await import('./grammar/lessons')).default,
    uiStrings: async () => (await import('./ui-strings')).default,
  },
};
