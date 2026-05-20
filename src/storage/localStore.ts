import { STORAGE_KEY, migrate, emptyState, type PersistedState } from './schema';
import { debounce } from './debounce';

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export function loadState(defaultPairId: string): PersistedState {
  if (!isBrowser) return emptyState(defaultPairId);
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState(defaultPairId);
    const parsed: unknown = JSON.parse(raw);
    return migrate(parsed, defaultPairId);
  } catch {
    return emptyState(defaultPairId);
  }
}

export type QuotaListener = () => void;
const quotaListeners = new Set<QuotaListener>();

export function onQuotaExceeded(fn: QuotaListener): () => void {
  quotaListeners.add(fn);
  return () => {
    quotaListeners.delete(fn);
  };
}

const writeNow = (state: PersistedState): void => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    if (err instanceof DOMException && err.name === 'QuotaExceededError') {
      quotaListeners.forEach((fn) => fn());
    }
  }
};

export const saveStateDebounced = debounce(writeNow, 250);

export function clearStorage(): void {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}
