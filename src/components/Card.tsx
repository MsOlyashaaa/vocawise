import type { HTMLAttributes, ReactNode } from 'react';

type Variant = 'default' | 'muted' | 'brand' | 'flat';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  padding?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  default: 'bg-surface-card shadow-soft',
  muted: 'bg-surface-muted',
  brand: 'bg-brand-50 text-brand-700',
  flat: 'bg-surface-card border border-surface-border',
};

const PADDINGS = { sm: 'p-3', md: 'p-5', lg: 'p-6' } as const;

export function Card({
  variant = 'default',
  padding = 'md',
  className = '',
  children,
  ...rest
}: CardProps) {
  return (
    <div className={`rounded-3xl ${VARIANTS[variant]} ${PADDINGS[padding]} ${className}`} {...rest}>
      {children}
    </div>
  );
}
