const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function toLocalISODate(d: Date | number = Date.now()): string {
  const date = typeof d === 'number' ? new Date(d) : d;
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function startOfLocalDay(d: Date | number = Date.now()): number {
  const date = typeof d === 'number' ? new Date(d) : new Date(d.getTime());
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

export function diffInDays(aISO: string, bISO: string): number {
  const a = new Date(`${aISO}T00:00:00`).getTime();
  const b = new Date(`${bISO}T00:00:00`).getTime();
  return Math.round((a - b) / ONE_DAY_MS);
}

export function lastNDates(n: number, today: Date | number = Date.now()): string[] {
  const start = startOfLocalDay(today);
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    out.push(toLocalISODate(start - i * ONE_DAY_MS));
  }
  return out;
}
