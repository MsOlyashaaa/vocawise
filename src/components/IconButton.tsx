import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
}

export function IconButton({ label, className = '', children, ...rest }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface-muted text-zinc-700 transition hover:bg-zinc-200 active:scale-[0.93] ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
