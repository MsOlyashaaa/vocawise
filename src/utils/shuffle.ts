export function shuffle<T>(arr: readonly T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = out[i] as T;
    out[i] = out[j] as T;
    out[j] = tmp;
  }
  return out;
}

export function pickN<T>(arr: readonly T[], n: number): T[] {
  if (n >= arr.length) return shuffle(arr);
  return shuffle(arr).slice(0, n);
}

export function weightedSample<T>(pool: readonly { item: T; weight: number }[], n: number): T[] {
  const remaining = pool.map((p) => ({ ...p }));
  const out: T[] = [];
  while (out.length < n && remaining.length > 0) {
    const total = remaining.reduce((s, p) => s + p.weight, 0);
    if (total <= 0) break;
    let r = Math.random() * total;
    let idx = 0;
    for (let i = 0; i < remaining.length; i++) {
      r -= remaining[i]!.weight;
      if (r <= 0) {
        idx = i;
        break;
      }
    }
    out.push(remaining[idx]!.item);
    remaining.splice(idx, 1);
  }
  return out;
}
