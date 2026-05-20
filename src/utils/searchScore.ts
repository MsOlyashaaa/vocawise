function norm(s: string): string {
  return s.toLocaleLowerCase().trim();
}

export interface ScoredHit<T> {
  item: T;
  score: number;
}

export function scoreText(haystack: string, needle: string): number {
  if (!needle) return 0;
  const h = norm(haystack);
  const n = norm(needle);
  if (!h) return 0;
  if (h === n) return 100;
  if (h.startsWith(n)) return 70;
  const idx = h.indexOf(n);
  if (idx >= 0) return 40 - Math.min(idx, 30);
  return 0;
}

export function searchItems<T>(
  items: readonly T[],
  query: string,
  fields: readonly ((item: T) => string | undefined)[],
): ScoredHit<T>[] {
  if (!query.trim()) return [];
  const out: ScoredHit<T>[] = [];
  for (const item of items) {
    let best = 0;
    for (const f of fields) {
      const v = f(item);
      if (!v) continue;
      const s = scoreText(v, query);
      if (s > best) best = s;
    }
    if (best > 0) out.push({ item, score: best });
  }
  out.sort((a, b) => b.score - a.score);
  return out;
}
