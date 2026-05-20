import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand-500 text-white hover:bg-brand-600 active:scale-[0.97] shadow-soft',
  secondary: 'bg-surface-muted text-zinc-700 hover:bg-zinc-200 active:scale-[0.97]',
  ghost: 'bg-transparent text-zinc-700 hover:bg-surface-muted active:scale-[0.97]',
  danger: 'bg-danger-500 text-white hover:bg-danger-700 active:scale-[0.97]',
};

const SIZES: Record<Size, string> = {
  sm: 'text-sm px-3 py-2 rounded-xl',
  md: 'text-base px-5 py-3 rounded-2xl font-semibold',
  lg: 'text-base px-6 py-4 rounded-2xl font-semibold',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 transition-transform disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
