import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from './IconButton';

interface AppBarProps {
  title: string;
  subtitle?: string;
  back?: boolean;
  right?: ReactNode;
}

export function AppBar({ title, subtitle, back, right }: AppBarProps) {
  const nav = useNavigate();
  return (
    <header className="safe-top sticky top-0 z-20 flex items-center gap-2 bg-surface-page/90 px-4 py-3 backdrop-blur">
      {back ? (
        <IconButton label="Назад" onClick={() => nav(-1)}>
          <span aria-hidden>‹</span>
        </IconButton>
      ) : null}
      <div className="min-w-0 flex-1">
        <h1 className="truncate font-display text-lg font-bold leading-tight">{title}</h1>
        {subtitle ? <p className="truncate text-xs text-zinc-500">{subtitle}</p> : null}
      </div>
      {right}
    </header>
  );
}
