import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon = '🌱', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      <div className="text-5xl" aria-hidden>
        {icon}
      </div>
      <h2 className="font-display text-xl font-bold">{title}</h2>
      {description ? <p className="text-sm text-zinc-500">{description}</p> : null}
      {action}
    </div>
  );
}
