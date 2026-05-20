import { useLanguagePairContext } from '@contexts/LanguagePairContext';

export function useLanguagePair() {
  const { pair, loading } = useLanguagePairContext();
  return { pair, loading };
}
