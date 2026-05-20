import { useCallback } from 'react';
import { useLanguagePairContext } from '@contexts/LanguagePairContext';

const FALLBACK_EN: Record<string, string> = {
  'common.unknown': 'Unknown',
};

export function useT(): (key: string, vars?: Record<string, string | number>) => string {
  const { uiStrings } = useLanguagePairContext();
  return useCallback(
    (key, vars) => {
      const tpl = uiStrings[key] ?? FALLBACK_EN[key] ?? key;
      if (!vars) return tpl;
      return tpl.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ''));
    },
    [uiStrings],
  );
}
