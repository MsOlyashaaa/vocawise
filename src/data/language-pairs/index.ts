import type { LanguagePair } from '@app-types/language';
import { plUk } from './pl-uk/pair';

export const LANGUAGE_PAIRS: Readonly<Record<string, LanguagePair>> = {
  [plUk.id]: plUk,
};

export const DEFAULT_PAIR_ID = plUk.id;

export function getPair(id: string): LanguagePair {
  const pair = LANGUAGE_PAIRS[id];
  if (!pair) throw new Error(`Unknown language pair: ${id}`);
  return pair;
}

export function listPairs(): LanguagePair[] {
  return Object.values(LANGUAGE_PAIRS);
}
