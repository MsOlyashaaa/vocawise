import type { HTMLAttributes, ReactNode } from 'react';

type Tone = 'brand' | 'accent' | 'success' | 'warning' | 'danger' | 'neutral';

interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  children: ReactNode;
}

const TONES: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-700',
  accent: 'bg-accent-50 text-accent-700',
  success: 'bg-success-50 text-success-700',
  warning: 'bg-warning-50 text-warning-700',
  danger: 'bg-danger-50 text-danger-700',
  neutral: 'bg-surface-muted text-zinc-600',
};

export function Pill({ tone = 'brand', className = '', children, ...rest }: PillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${TONES[tone]} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}
