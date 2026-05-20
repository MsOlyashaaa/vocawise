import type { InputHTMLAttributes } from 'react';

type SearchBarProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export function SearchBar({ className = '', ...rest }: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" aria-hidden>
        🔍
      </span>
      <input
        type="search"
        className="w-full rounded-2xl border border-surface-border bg-surface-card py-3 pl-10 pr-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-300"
        {...rest}
      />
    </div>
  );
}
