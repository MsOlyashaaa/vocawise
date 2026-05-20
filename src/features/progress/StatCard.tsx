import { Card } from '@components/Card';

interface Props {
  label: string;
  value: string | number;
  emoji?: string;
}

export function StatCard({ label, value, emoji }: Props) {
  return (
    <Card className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-zinc-500">
        {emoji ? <span aria-hidden>{emoji}</span> : null}
        {label}
      </div>
      <div className="font-display text-3xl font-bold">{value}</div>
    </Card>
  );
}
