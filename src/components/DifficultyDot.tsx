import type { Difficulty } from '@app-types/vocabulary';

const DOT_TONE: Record<Difficulty, string> = {
  easy: 'bg-success-500',
  medium: 'bg-warning-500',
  hard: 'bg-danger-500',
};

export function DifficultyDot({ value }: { value: Difficulty }) {
  return (
    <span className={`inline-block h-2 w-2 rounded-full ${DOT_TONE[value]}`} aria-label={value} />
  );
}
